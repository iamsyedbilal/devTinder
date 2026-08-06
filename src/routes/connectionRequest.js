const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

const connectionRouter = express.Router();

// API - Send Connection Request
connectionRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async function (req, res) {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const ALLOWED_STATUS = ["interested", "ignore"];

      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ message: "Invalid status request" });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const existingUser = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "Connection request has already been sent" });
      }

      if (fromUserId.equals(toUserId)) {
        return res
          .status(400)
          .json({ message: "Cannot send connection request to self" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      if (!connectionRequest) {
        return res
          .status(400)
          .json({ message: "Failed to connect the connection request" });
      }

      await connectionRequest.save();

      res.status(200).json({
        message: `${req.user.firstName} ${status} connection request of ${toUser.firstName}`,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
);

// API - Accept Or Reject Connection Request
connectionRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async function (req, res) {
    try {
      const { status, requestId } = req.params;

      const user = req.user;

      const ALLOWED_STATUS = ["accepted", "rejected"];

      if (!ALLOWED_STATUS.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      const connectionStatus = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: user._id,
        status: "interested",
      });

      if (!connectionStatus) {
        return res
          .status(400)
          .json({ message: "Connection request not found" });
      }

      connectionStatus.status = status;

      const updatedConnection = await connectionStatus.save();

      return res.status(200).json({
        message: `Connection request has been ${status}`,
        connection: updatedConnection,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message,
      });
    }
  },
);

module.exports = connectionRouter;
