const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA =
  "firstName lastName age gender profileImage about skills";

// API - GET All Pending Connection
userRouter.get("/user/requests/received", userAuth, async function (req, res) {
  try {
    const user = req.user;

    const connection = await ConnectionRequest.findOne({
      toUserId: user._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    if (!connection) {
      return res
        .status(404)
        .json({ message: "No interested connection found" });
    }

    res.status(200).json({
      message: "Interested Connection Requests Found",
      data: connection,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// API - Connections
userRouter.get("/user/connections", userAuth, async function (req, res) {
  try {
    const user = req.user;

    const connections = await ConnectionRequest.find({
      $or: [
        { toUserId: user._id, status: "accepted" },
        { fromUserId: user._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    if (!connections) {
      return res.status(404).json({ message: "No connection request found" });
    }

    const data = connections.map((row) => {
      if (row.fromUserId._id.toString() === user._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });

    res.status(200).json({
      message: "Connection requested fetched successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
