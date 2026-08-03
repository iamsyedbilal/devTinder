require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { validateSignupData, validateLoginData } = require("./utils/validation");
const cookieParser = require("cookie-parser");
const userAuth = require("./middlewares/auth");

const app = express();
app.use(express.json());
app.use(cookieParser());

// API - Signup
app.post("/signup", async function (req, res) {
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
});

// API - Signing
app.post("/signin", async function (req, res) {
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
});

// API - GET User Profile
app.get("/profile", userAuth, async function (req, res) {
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
});

// API - Update User
app.patch("/user/:userId", async function (req, res) {
  const { userId } = req.params;
  const data = req.body;

  if (!userId) {
    return res.status(400).send("Invalid user id");
  }

  if (Object.keys(data).length === 0) {
    return res.status(400).send("Data is required");
  }

  try {
    const ALLOWED_UPDATES = [
      "firstName",
      "lastName",
      "password",
      "confirmPassword",
      "age",
      "gender",
      "profileImage",
      "about",
      "skills",
    ];

    const isUpdateAllowed = Object.keys(data).every((key) =>
      ALLOWED_UPDATES.includes(key),
    );

    if (!isUpdateAllowed) {
      return res.status(400).send("Invalid updates");
    }

    const updatedUser = await User.findByIdAndUpdate(userId, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: `Error: user not updated ${error}`,
    });
  }
});

connectDB()
  .then(() => {
    console.log("DB connected🟢");
    app.listen(3000, function () {
      console.log(`Server is running on PORT: http://localhost:${3000}`);
    });
  })
  .catch((err) => {
    console.log(`failed to connect ${err.message}`);
  });
