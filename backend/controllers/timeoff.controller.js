const LeaveRequest = require("../models/LeaveRequest");
const emailService = require("../services/email.service");

const VALID_LEAVE_TYPES = [
  "Annual Leave",
  "Sick Leave",
  "Family Responsibility",
  "Study Leave",
];

const VALID_STATUSES = ["Pending", "Approved", "Denied"];

function validateLeaveInput(body) {
  const { employee, leaveType, startDate, endDate, reason } = body;

  if (!employee || !leaveType || !startDate || !endDate) {
    return "employee, leaveType, startDate, and endDate are required";
  }

  if (!VALID_LEAVE_TYPES.includes(leaveType)) {
    return `Invalid leaveType. Allowed values: ${VALID_LEAVE_TYPES.join(", ")}`;
  }

  if (endDate < startDate) {
    return "endDate must be greater than or equal to startDate";
  }

  return null;
}

async function getAll(req, res) {
  try {
    const requests = await LeaveRequest.getAll();

    res.json({
      success: true,
      data: requests,
    });
  } catch (error) {
    console.error("Get leave requests error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve leave requests",
    });
  }
}

async function getById(req, res) {
  try {
    const request = await LeaveRequest.getById(req.params.id);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Get leave request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve leave request",
    });
  }
}

async function create(req, res) {
  try {
    const validationError = validateLeaveInput(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const { employee, leaveType, startDate, endDate, reason } = req.body;

    const request = await LeaveRequest.create({
      employeeId: employee,
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Create leave request error:", error);

    if (error.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(400).json({
        success: false,
        message: "Employee does not exist",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create leave request",
    });
  }
}

async function update(req, res) {
  try {
    const validationError = validateLeaveInput(req.body);

    if (validationError) {
      return res.status(400).json({
        success: false,
        message: validationError,
      });
    }

    const existing = await LeaveRequest.getById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    const { leaveType, startDate, endDate, reason } = req.body;

    const request = await LeaveRequest.update(req.params.id, {
      leaveType,
      startDate,
      endDate,
      reason,
    });

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Update leave request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update leave request",
    });
  }
}

async function remove(req, res) {
  try {
    const removed = await LeaveRequest.remove(req.params.id);

    if (!removed) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    res.json({
      success: true,
      message: "Leave request deleted successfully",
    });
  } catch (error) {
    console.error("Delete leave request error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete leave request",
    });
  }
}

async function updateStatus(req, res) {
  try {
    // Role check also happens at the route level via roleMiddleware, but we
    // keep this as a defensive second layer in case the route is ever
    // mounted without it.
    const allowedRoles = ["admin", "hr", "manager"];

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to change leave request status",
      });
    }

    const { status } = req.body;

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Allowed values: ${VALID_STATUSES.join(", ")}`,
      });
    }

    const existing = await LeaveRequest.getById(req.params.id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Leave request not found",
      });
    }

    const request = await LeaveRequest.updateStatus(
      req.params.id,
      status,
      req.user.userId,
    );

    // Best-effort notification — never let an email failure block the
    // status update itself.
    try {
      await emailService.sendLeaveStatusNotification(request);
    } catch (emailError) {
      console.error("Leave status notification failed:", emailError);
    }

    res.json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Update leave status error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update leave request status",
    });
  }
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
  updateStatus,
};
