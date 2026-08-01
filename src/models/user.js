const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minLength: [3, "First name should be at least 3 characters long"],
    },
    lastName: {
      type: String,
      minlength: [3, "First name should be at least 3 characters long"],
    },
    emailId: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
      validate: {
        validator: function (value) {
          // Regular expression for email validation
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid email address!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minLength: [6, "Password should be at least 6 characters long"],
      validate: {
        validator: function (value) {
          // Regular expression for password validation
          const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
          return passwordRegex.test(value);
        },
        message: (props) =>
          `${props.value} is not a valid password! Password should contain at least one letter and one number.`,
      },
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (value) {
          return value === this.password;
        },
        message: "Passwords do not match",
      },
    },
    age: {
      type: Number,
      min: [18, "Age should be at least 18"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      validate: {
        validator: function (value) {
          return ["male", "female", "other"].includes(value);
        },
        message: (props) => `${props.value} is not a valid gender`,
      },
    },
    about: {
      type: String,
      default: "",
      maxlength: [500, "About section should not exceed 500 characters"],
    },
    profileImage: {
      type: String,
      validate: {
        validator: function (value) {
          // Regular expression for URL validation
          const urlRegex =
            /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/;
          return urlRegex.test(value);
        },
        message: (props) => `${props.value} is not a valid URL`,
      },
      default:
        "https://uxwing.com/wp-content/themes/uxwing/download/peoples-avatars/default-avatar-profile-picture-male-icon.png",
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length <= 10;
        },
        message: "Skills should not exceed 10",
      },
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
