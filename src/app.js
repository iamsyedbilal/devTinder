const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();
app.use(express.json());

// API - Signup
app.post("/signup", async function (req, res) {
  // const userObj = {
  //   firstName: "Syed",
  //   lastName: "Bilal",
  //   emailId: "syedbilal@gmail.com",
  //   password: "bilal123",
  // };

  const userObj = req.body;

  if (!userObj) {
    res.send("User cannot be empty").status(400);
  }

  try {
    const user = await User.create(userObj);

    if (!user) {
      res.send("Error while creating the user").status(400);
    }

    res.send("User created successfully").status(200);
  } catch (error) {
    res.send(`Error: user not created ${error}`).status(400);
  }
});

// API - GET User By Email
app.get("/user", async function (req, res) {
  const { emailId } = req.body;

  if (!emailId) {
    res.send("Email cannot be empty").status(400);
  }

  try {
    const user = await User.find({ emailId });

    if (!user) {
      res.send("User not found").status(400);
    }

    res.send(user).status(200);
  } catch (error) {
    res.send(`Error: user not found ${error}`).status(400);
  }
});

// API - GET All Users
app.get("/feed", async function (req, res) {
  try {
    const user = await User.find();

    if (!user) {
      res.send("User not found").status(400);
    }

    res.send(user).status(200);
  } catch (error) {
    res.send(`Error: user not found ${error}`).status(400);
  }
});

// API - Delete Users
app.delete("/user", async function (req, res) {
  const { userId } = req.body;

  if (!userId) {
    res.send("Invalid user id").status(400);
  }

  try {
    await User.findByIdAndDelete({ _id: userId });

    res.send("user deleted").status(201);
  } catch (error) {
    res.send(`Error: user not found ${error}`).status(400);
  }
});

// API - Update User
app.patch("/user", async function (req, res) {
  const { userId } = req.body;
  const data = req.body;

  if (!userId) {
    res.send("Invalid user id").status(400);
  }

  if (!data) {
    res.send("data is required").status(400);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate(userId, data);

    if (!updatedUser) {
      res.send("user not updated").status(400);
    }

    res.send("user updated " + updatedUser).status(201);
  } catch (error) {
    res.send(`Error: user not update ${error}`).status(400);
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
