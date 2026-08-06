const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "From user id is required"],
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "To user id is required"],
    },
    status: {
      type: String,
      enum: {
        values: ["interested", "ignore", "accepted", "rejected"],
        message: `{VALUE} is not a valid status`,
      },
    },
  },
  { timestamps: true },
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

const ConnectionRequest =
  mongoose.models.ConnectionRequest ||
  mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequest;
