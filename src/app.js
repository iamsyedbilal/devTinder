const express = require("express");

const app = express();

// app.use((req, res) => {
//   res.send("Hello babe from server");
// });

app.use("/hello", function (req, res) {
  res.send("Hello");
});

app.listen(3000, function () {
  console.log(`Server is running on PORT: http://localhost:${3000}`);
});
