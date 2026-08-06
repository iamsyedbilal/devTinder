const express = require("express");
const userAuth = require("../middlewares/auth");
const {
  acceptOrRejectRequest,
  sendConnectionRequest,
} = require("../controllers/connectionRequest");

const connectionRouter = express.Router();

// API - Send Connection Request
connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  sendConnectionRequest,
);

// API - Accept Or Reject Connection Request
connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  acceptOrRejectRequest,
);

module.exports = connectionRouter;
