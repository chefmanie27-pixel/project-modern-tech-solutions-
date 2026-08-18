// middleware/roleMiddleware.js
// Restricts a route to specific roles. Must run AFTER authMiddleware,
// since it reads req.user set by that middleware.
//
// Usage: router.patch('/:id/status', authMiddleware, requireRole('admin', 'hr'), controllerFn)

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Insufficient permissions" });
    }
    next();
  };
}

export default requireRole;