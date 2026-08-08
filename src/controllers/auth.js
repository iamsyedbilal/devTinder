const User = require("../models/user");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validation");

// API - Signup
async function signup(req, res) {
  const { errors, isValid } = validateSignupData(req.body);

  if (!isValid) {
    return res.status(400).json({
      message: "Please correct the highlighted fields and try again.",
      errors,
    });
  }

  try {
    const { firstName, lastName, emailId, password } = req.body;

    const normalizedEmail = emailId.trim().toLowerCase();

    const existingUser = await User.findOne({
      emailId: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        errors: {
          emailId: "This email is already registered. Please sign in instead.",
        },
      });
    }

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailId: normalizedEmail,
      password,
    });

    return res.status(201).json({
      message: "Account created successfully. Please sign in to continue.",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        errors: {
          emailId: "This email is already registered. Please sign in instead.",
        },
      });
    }

    return res.status(400).json({
      message: "We couldn't create your account. Please try again.",
    });
  }
}

// API - Sign In
async function signin(req, res) {
  const { errors, isValid } = validateLoginData(req.body);

  if (!isValid) {
    return res.status(400).json({
      message: "Please enter a valid email and password.",
      errors,
    });
  }

  try {
    const { emailId, password } = req.body;

    const normalizedEmail = emailId.trim().toLowerCase();

    const user = await User.findOne({ emailId: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        errors: {
          emailId: "No account found with this email. Please sign up first.",
        },
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        errors: {
          password: "The password you entered is incorrect. Please try again.",
        },
      });
    }

    const token = await user.getJWTToken();

    res.cookie("token", token, {
      expires: new Date(Date.now() + 3600000),
    });
    return res.status(200).json({
      message: "Signed in successfully.",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      message: "We couldn't sign you in. Please try again.",
    });
  }
}

// API - Sign Out
async function signout(req, res) {
  res.clearCookie("token", null, {
    expires: new Date(Date.now()),
  });
  return res.status(200).json({
    message: "Signed out successfully.",
  });
}

module.exports = {
  signup,
  signin,
  signout,
};
