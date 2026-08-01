const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "First name is required"],
      minlength: [3, "First name should be at least 3 characters long"],
      maxlength: [30, "First name should not exceed 30 characters"],
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Last name is required"],
      minlength: [3, "Last name should be at least 3 characters long"],
      maxlength: [30, "Last name should not exceed 30 characters"],
    },
    emailId: {
      type: String,
      trim: true,
      lowercase: true,
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
    },
    age: {
      type: Number,
      min: [18, "Age should be at least 18"],
      max: [100, "Age should not exceed 100"],
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
        validator(value) {
          return (
            value.length <= 10 &&
            new Set(value).size === value.length &&
            value.every((skill) => skill.trim() !== "")
          );
        },
        message: "Skills must be unique, non-empty and cannot exceed 10 items",
      },
    },
  },
  {
    timestamps: true,
  },
);

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
