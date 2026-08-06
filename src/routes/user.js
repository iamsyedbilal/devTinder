const express = require("express");
const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/User");

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

    // connections will be an array; handle empty array as no results
    if (!connections || connections.length === 0) {
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

// API - Feed API
userRouter.get("/feed", userAuth, async function (req, res) {
  try {
    const user = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    // sanitize pagination params
    const MAX_LIMIT = 50;
    if (isNaN(page) || page < 1) {
      return res.status(400).json({ message: "Invalid page number" });
    }
    if (isNaN(limit) || limit < 1) {
      limit = 10;
    }
    if (limit > MAX_LIMIT) limit = MAX_LIMIT;
    // (page number - 1) * limit
    const skip = (page - 1) * limit;

    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: user._id }, { toUserId: user._id }],
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();
    connectionRequest.forEach((request) => {
      hideUserFromFeed.add(request.toUserId.toString());
      hideUserFromFeed.add(request.fromUserId.toString());
    });

    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUserFromFeed) } },
        {
          _id: { $ne: user._id },
        },
      ],
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Feed fetched successfully",
      data: feedUsers,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = userRouter;
