import nodemailer from "nodemailer";
import env from "../config/env.js";

// Lazily created so importing this file never fails if SMTP creds aren't
// set yet (e.g. local dev before the team has real credentials).
let transporter = null;

function getTransporter() {
  if (!env.email.smtpHost || !env.email.smtpUser || !env.email.smtpPass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.email.smtpHost,
      port: env.email.smtpPort,
      secure: env.email.smtpPort === 465,
      auth: {
        user: env.email.smtpUser,
        pass: env.email.smtpPass,
      },
    });
  }

  return transporter;
}

async function sendMail({ to, subject, text }) {
  const client = getTransporter();

  // No SMTP configured yet — log instead of throwing, so the rest of the
  // request (e.g. approving a leave request) still succeeds during dev/demo.
  if (!client || !to) {
    console.log(`[email.service] (dev fallback) To: ${to || "unknown"} | Subject: ${subject}\n${text}`);
    return { delivered: false, reason: "SMTP not configured" };
  }

  await client.sendMail({
    from: env.email.fromAddress,
    to,
    subject,
    text,
  });

  return { delivered: true };
}

// request is the leave_requests row returned by LeaveRequest.updateStatus,
// joined with the employee's name. It does not currently include an email
// address (leave_requests has no contact column) — once employees.contact
// is reliably populated, wire that in here as `to`.
async function sendLeaveStatusNotification(request) {
  const subject = `Your ${request.leave_type} request has been ${request.status.toLowerCase()}`;
  const text =
    `Hi ${request.employee},\n\n` +
    `Your leave request (${request.start_date} to ${request.end_date}) has been ${request.status.toLowerCase()}.\n\n` +
    `— Modern Tech HR`;

  return sendMail({
    to: request.employee_email || null,
    subject,
    text,
  });
}

export {
  sendMail,
  sendLeaveStatusNotification,
};
