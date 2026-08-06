const User = require("../models/user");
const {
  validateUpdateUserData,
  validateUserPassword,
} = require("../utils/validation");

// API - GET User Profile
async function getUserProfile(req, res) {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User profile retrieved successfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

// API - updateUserData
async function updateUserData(req, res) {
  try {
    const { errors, isValid } = validateUpdateUserData(req.body);

    if (!isValid) {
      return res.status(400).json({ errors });
    }

    Object.keys(req.body).forEach((key) => {
      req.user[key] = req.body[key];
    });

    await req.user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

// API - Update Password
async function updatePassword(req, res) {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const { errors, isValid } = validateUserPassword(req.body);

    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        errors: {
          user: "User not found",
        },
      });
    }

    const isPasswordCorrect = await user.comparePassword(currentPassword);

    if (!isPasswordCorrect) {
      return res.status(400).json({
        errors: {
          password: "User password is not correct",
        },
      });
    }

    user.password = currentPassword;
    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
}

module.exports = {
  getUserProfile,
  updateUserData,
  updatePassword,
};
