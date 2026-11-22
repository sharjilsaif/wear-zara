// Validation rules shared by the sign-up form (client) and the register API (server).

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup({ name = "", email = "", password = "" }) {
  const errors = {};
  const trimmedName = name.trim();

  if (trimmedName.length < 2) errors.name = "Please enter your name (at least 2 characters).";
  else if (trimmedName.length > 60) errors.name = "Name must be 60 characters or fewer.";

  if (!EMAIL_PATTERN.test(email.trim())) errors.email = "Please enter a valid email address.";

  if (password.length < 8) errors.password = "Password must be at least 8 characters.";
  else if (password.length > 72) errors.password = "Password must be 72 characters or fewer.";
  else if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) errors.password = "Use at least one letter and one number.";

  return errors;
}
