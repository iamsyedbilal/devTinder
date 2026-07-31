const express = require("express");
const connectDB = require("./config/database");

const app = express();

// app.use((req, res) => {
//   res.send("Hello babe from server");
// });

app.use("/hello", function (req, res) {
  res.send("Hello");
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
