const isAdmin = async (req, res, next) => {
  const { token } = req.body;

  const isAuthorizedAdmin = token === "xyz";

  if (!isAuthorizedAdmin) {
    return res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

const userAuth = async (req, res, next) => {
  const { token } = req.body;
  const isAuthorizedUser = token === "xyz";

  if (!isAuthorizedAdmin) {
    return res.status(401).send("unauthorized request");
  } else {
    next();
  }
};

module.export = {
  isAdmin,
  userAuth,
};
