const validator = require("validator");

// Validate Signup Data
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

// Validate Login Data
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

// Validate Update User Data
function validateUpdateUserData(data) {
  const errors = {};
  const allowedEditFields = [
    "firstName",
    "lastName",
    "profileImage",
    "gender",
    "age",
    "about",
    "skills",
  ];

  // Check for invalid fields
  const invalidFields = Object.keys(data).filter(
    (field) => !allowedEditFields.includes(field),
  );

  if (invalidFields.length > 0) {
    errors.invalidFields = `Invalid fields: ${invalidFields.join(", ")}`;
  }

  // Validate firstName
  if (data.firstName !== undefined) {
    if (!data.firstName || !data.firstName.trim()) {
      errors.firstName = "First name is required";
    } else if (data.firstName.length < 3 || data.firstName.length > 30) {
      errors.firstName = "First name should be between 3 and 30 characters";
    }
  }

  // Validate lastName
  if (data.lastName !== undefined) {
    if (!data.lastName || !data.lastName.trim()) {
      errors.lastName = "Last name is required";
    } else if (data.lastName.length < 3 || data.lastName.length > 30) {
      errors.lastName = "Last name should be between 3 and 30 characters";
    }
  }

  // Validate profileImage
  if (data.profileImage !== undefined) {
    if (data.profileImage && !validator.isURL(data.profileImage)) {
      errors.profileImage = "Invalid URL for profile image";
    }
  }

  // Validate gender
  if (data.gender !== undefined) {
    const allowedGenders = ["male", "female", "other"];
    if (!allowedGenders.includes(data.gender)) {
      errors.gender = "Gender must be 'male', 'female', or 'other'";
    }
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}

// Validate User Password
function validateUserPassword(data) {
  const errors = {};

  const { currentPassword, newPassword, confirmPassword } = data;

  // Validate current password
  if (!currentPassword || !currentPassword.trim()) {
    errors.currentPassword = "Current password is required";
  }

  // Validate new password
  if (!newPassword || !newPassword.trim()) {
    errors.newPassword = "New password is required";
  } else if (
    !validator.isStrongPassword(newPassword, {
      minLength: 6,
      minLowercase: 1,
      minUppercase: 0,
      minNumbers: 1,
      minSymbols: 0,
    })
  ) {
    errors.newPassword =
      "New password must be at least 6 characters and contain at least one letter and one number.";
  }

  // Validate confirm password
  if (!confirmPassword || !confirmPassword.trim()) {
    errors.confirmPassword = "Please confirm your new password";
  } else if (newPassword !== confirmPassword) {
    errors.confirmPassword = "New password and confirm password do not match";
  }

  // Prevent using the same password
  if (currentPassword && newPassword && currentPassword === newPassword) {
    errors.newPassword =
      "New password must be different from the current password";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0,
  };
}
module.exports = {
  validateSignupData,
  validateLoginData,
  validateUpdateUserData,
  validateUserPassword,
};
