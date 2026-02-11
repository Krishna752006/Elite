module.exports = (requiredRole) => {
  return (req, res, next) => {
    if (req.session.user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};