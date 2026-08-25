const USERS_KEY = "wear_zara_users";
const CURRENT_USER_KEY = "wear_zara_current_user";

export function readUsers() {
  if (typeof window === "undefined") return [];

  try {
    const value = localStorage.getItem(USERS_KEY);
    return value ? JSON.parse(value) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function getCurrentUser() {
  if (typeof window === "undefined") return null;

  try {
    const value = localStorage.getItem(CURRENT_USER_KEY);
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user) {
  const safeUser = {
    ...user,
    id: user.id ?? user._id ?? crypto.randomUUID(),
    name: user.name ?? "User",
    email: user.email ?? "",
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(safeUser));
  window.dispatchEvent(new Event("auth:change"));
}

export function removeCurrentUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  window.dispatchEvent(new Event("auth:change"));
}

export function findUserByEmail(email) {
  const normalizedEmail = email.trim().toLowerCase();
  return (
    readUsers().find((user) => user.email.toLowerCase() === normalizedEmail) ||
    null
  );
}

export function deleteCurrentUser() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    removeCurrentUser();
    return;
  }

  const users = readUsers().filter(
    (user) => user.email.toLowerCase() !== currentUser.email.toLowerCase(),
  );
  saveUsers(users);
  removeCurrentUser();
}
