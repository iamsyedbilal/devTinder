const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      minlength: [3, "First name should be at least 3 characters long"],
    },
    lastName: {
      type: String,
      minlength: [3, "Last name should be at least 3 characters long"],
    },
    emailId: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
      validate: {
        validator: function (value) {
          return validator.isEmail(value);
        },
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      validate: {
        validator: function (value) {
          return validator.isStrongPassword(value, {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 0,
            minNumbers: 1,
            minSymbols: 0,
          });
        },
        message: (props) =>
          `${props.value} password must be at least 6 characters long and contain at least one lowercase letter and one number`,
      },
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
      validate: {
        validator: function (value) {
          // Check if confirmPassword matches password
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
          return validator.isURL(value);
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
