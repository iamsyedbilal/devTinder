const express = require("express");
const { signup, signin, signout } = require("../controllers/auth");

const authRouter = express.Router();

// API - Signup
authRouter.post("/signup", signup);

// API - Sign In
authRouter.post("/signin", signin);

// API - Sign Out
authRouter.post("/signout", signout);

module.exports = authRouter;
