const validator = require("validator");

function validateSignupData(data) {
  const errors = {};
  const { firstName, lastName, emailId, password, confirmPassword } = data;

  // Validate firstName
  if (!firstName || !firstName.trim()) {
    errors.firstName = "First name is required";
  } else if (firstName.length < 3 || firstName.length > 30) {
    errors.firstName = "First name should be between 3 and 30 characters";
  }

  //   Validate lastName
  if (!lastName || !lastName.trim()) {
    errors.lastName = "Last name is required";
  } else if (lastName.length < 3 || lastName.length > 30) {
    errors.lastName = "Last name should be between 3 and 30 characters";
  }

  //   Validate emailId
  if (!emailId || !emailId.trim()) {
    errors.emailId = "Email is required";
  } else if (!validator.isEmail(emailId.trim())) {
    errors.emailId = "Invalid email";
  }

  //   Validate password and confirmPassword
  if (!password || !password.trim()) {
    errors.password = "Password is required";
  } else if (
    !validator.isStrongPassword(password, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    errors.password =
      "Password must be at least 6 characters and contain at least one letter and one number.";
  }

  if (!confirmPassword || !confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your password";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

function validateLoginData(data) {
  const errors = {};
  const { emailId, password } = data;

  // Validate emailId
  if (!emailId || !emailId.trim()) {
    errors.emailId = "Email is required";
  } else if (!validator.isEmail(emailId.trim())) {
    errors.emailId = "Invalid email";
  }

  // Validate password
  if (!password || !password.trim()) {
    errors.password = "Password is required";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

module.exports = {
  validateSignupData,
  validateLoginData,
};
