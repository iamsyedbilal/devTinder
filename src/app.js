const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const validateSignupData = require("./utils/validation");
const bcrypt = require("bcryptjs");

const app = express();
app.use(express.json());

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      emailId: normalizedEmail,
      password: hashedPassword,
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

// API - GET User By Email
app.get("/user", async function (req, res) {
  const { emailId } = req.body;

  if (!emailId) {
    return res.status(400).send("Email cannot be empty");
  }

  try {
    const user = await User.findOne({ emailId });

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

// API - GET All Users
app.get("/feed", async function (req, res) {
  try {
    const user = await User.find();

    if (user.length === 0) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send(user);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
});

// API - Delete Users
app.delete("/user", async function (req, res) {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).send("Invalid user id");
  }

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("User deleted");
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
