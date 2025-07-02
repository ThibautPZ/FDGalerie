const checkRoles = (...roles) => {
  return (req, res, next) => {
    const userRole = req.user.usertype_id;
    if (roles.some((role) => role === userRole)) {
      return next();
    }
    return res.sendStatus(401);
  };
};

module.exports = checkRoles;
