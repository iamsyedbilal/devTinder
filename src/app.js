const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", function (req, res) {
  const userObj = {
    firstName: "Syed",
    lastName: "Bilal",
    emailId: "syedbilal@gmail.com",
    password: "bilal123",
  };

  try {
    const user = User.create(userObj);

    if (!user) {
      res.send("Error while creating the user").statusCode(400);
    }

    res.send("User created successfully").statusCode(200);
  } catch (error) {
    res.send(`Error: user not created ${error}`).statusCode(400);
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
