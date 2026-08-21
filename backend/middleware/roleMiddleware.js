// Restricts a route to one or more roles.
// Must run AFTER authMiddleware, since it reads req.user.role which
// authMiddleware attaches from the decoded JWT.
//
// Usage: router.patch("/:id/status", authMiddleware, requireRole("admin", "hr", "manager"), controllerFn);
function requireRole(...allowedRoles) {
  return function (req, res, next) {
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to perform this action",
      });
    }

    next();
  };
}

export default requireRole;
