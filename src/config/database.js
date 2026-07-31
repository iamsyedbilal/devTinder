const mongoose = require("mongoose");

async function connectDB() {
  try {
    const connectionInstance = await mongoose.connect();

    console.log(
      `mongodb connected to the ${connectionInstance.connection.host}`,
    );
  } catch (error) {
    console.log(`failed to connect to the mongodb ${error.message}`);
    process.exit(1);
  }
}

module.exports = connectDB;
