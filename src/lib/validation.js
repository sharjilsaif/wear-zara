// Validation shared by forms (client) and API routes (server).
// Functions return error *codes*; the UI translates them via `validation.<code>`.

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^[+\d][\d\s()-]{6,19}$/;

const clean = (value) => String(value ?? "").trim();

export function validateName(name) {
  const value = clean(name);
  if (value.length < 2) return "nameShort";
  if (value.length > 60) return "nameLong";
  return null;
}

export function validateEmail(email) {
  return EMAIL_PATTERN.test(clean(email)) ? null : "email";
}

export function validatePassword(password = "") {
  if (password.length < 8) return "passwordShort";
  if (password.length > 72) return "passwordLong";
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) return "passwordWeak";
  return null;
}

export function validatePhone(phone, { required = true } = {}) {
  const value = clean(phone);
  if (!value) return required ? "phone" : null;
  return PHONE_PATTERN.test(value) ? null : "phone";
}

function collect(checks) {
  return Object.fromEntries(Object.entries(checks).filter(([, code]) => code));
}

export function validateSignup({ name, email, password }) {
  return collect({ name: validateName(name), email: validateEmail(email), password: validatePassword(password) });
}

export function validateCheckout(data) {
  return collect({
    name: validateName(data.name),
    street: clean(data.street).length < 3 ? "street" : null,
    city: clean(data.city).length < 2 ? "city" : null,
    phone: validatePhone(data.phone),
    email: validateEmail(data.email),
  });
}

export function validateContact(data) {
  const message = clean(data.message);
  return collect({
    name: validateName(data.name),
    email: validateEmail(data.email),
    phone: validatePhone(data.phone, { required: false }),
    message: message.length < 10 ? "messageShort" : message.length > 2000 ? "messageLong" : null,
  });
}
