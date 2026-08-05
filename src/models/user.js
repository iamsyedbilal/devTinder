const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

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
      enum: {
        values: ["male", "female", "others"],
        message: `{VALUE} is not a valid gender type`,
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

// Pre-save hook to hash the password before saving the user
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare the provided password with the hashed password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// toJSON method to exclude sensitive information when converting the user document to JSON
userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

// Method to generate JWT token
userSchema.methods.getJWTToken = async function () {
  return await jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const User = mongoose.models.User || mongoose.model("User", userSchema);

module.exports = User;
