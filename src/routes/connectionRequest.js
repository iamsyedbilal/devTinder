const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

const connectionRouter = express.Router();

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
          .json({ message: "Connection request has already been send" });
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

module.exports = connectionRouter;
