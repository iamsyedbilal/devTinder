const User = require("../models/user");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validation");

// API - Signup
async function signup(req, res) {
  const { errors, isValid } = validateSignupData(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
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
          emailId: "Email already exists",
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
      message: "User created successfully",
      user,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        errors: {
          emailId: "Email already exists",
        },
      });
    }

    return res.status(400).json({
      message: error.message,
    });
  }
}

// API - Sign In
async function signin(req, res) {
  const { errors, isValid } = validateLoginData(req.body);

  if (!isValid) {
    return res.status(400).json({ errors });
  }

  try {
    const { emailId, password } = req.body;

    const normalizedEmail = emailId.trim().toLowerCase();

    const user = await User.findOne({ emailId: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        errors: {
          emailId: "User not found",
        },
      });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({
        errors: {
          password: "Invalid password",
        },
      });
    }

    if (isPasswordValid) {
      const token = await user.getJWTToken();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 3600000),
      });
      return res.status(200).json({
        message: "User signed in successfully",
        user,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
}

// API - Sign Out
async function signout(req, res) {
  res.clearCookie("token", null, {
    expires: new Date(Date.now()),
  });
  return res.status(200).json({
    message: "User signed out successfully",
  });
}

module.exports = {
  signup,
  signin,
  signout,
};
