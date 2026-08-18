export const BUILTIN = {
  "arunsparrow02@gmail.com": {
    pass: "arun123",
    name: "Arun",
    last: "Sparrow",
    degree: "B.Tech – Computer Science",
    year: "Final Year",
    role: "admin",
  },
  "student@aktech.ai": {
    pass: "student123",
    name: "Student",
    last: "User",
    degree: "BCA",
    year: "3rd Year",
    role: "user",
  },
  "admin@aktech.ai": {
    pass: "admin123",
    name: "Admin",
    last: "",
    degree: "MBA",
    year: "Graduated",
    role: "user",
  },
  "demo@aktech.ai": {
    pass: "demo123",
    name: "Demo",
    last: "User",
    degree: "B.Tech – Computer Science",
    year: "Final Year",
    role: "user",
  },
};

const FIXED_ADMIN_EMAIL = "arunsparrow02@gmail.com";

export function getAllUsers() {
  let extra = {};
  try {
    const s = localStorage.getItem("aktech_registered");
    if (s) extra = JSON.parse(s);
  } catch (e) {
    /* ignore */
  }
  const merged = Object.assign({}, BUILTIN, extra);
  // Hard lock: no matter how a user record was created or edited (including
  // direct localStorage tampering), only FIXED_ADMIN_EMAIL may hold role 'admin'.
  for (const email of Object.keys(merged)) {
    if (email !== FIXED_ADMIN_EMAIL && merged[email].role === "admin") {
      merged[email] = Object.assign({}, merged[email], { role: "user" });
    }
  }
  return merged;
}

export function saveNewUser(email, data) {
  let extra = {};
  try {
    const s = localStorage.getItem("aktech_registered");
    if (s) extra = JSON.parse(s);
  } catch (e) {
    /* ignore */
  }
  // Hard lock: no account created through this function can ever be admin.
  // The only admin account is the fixed one in BUILTIN above.
  extra[email] = Object.assign({}, data, { role: "user" });
  try {
    localStorage.setItem("aktech_registered", JSON.stringify(extra));
  } catch (e) {
    /* ignore */
  }
}

export function deleteUserFromStorage(email) {
  if (BUILTIN[email]) return false; // can't delete builtins
  let extra = {};
  try {
    const s = localStorage.getItem("aktech_registered");
    if (s) extra = JSON.parse(s);
  } catch (e) {
    /* ignore */
  }
  delete extra[email];
  try {
    localStorage.setItem("aktech_registered", JSON.stringify(extra));
  } catch (e) {
    /* ignore */
  }
  return true;
}

export function updateUserPassword(email, newPass) {
  let extra = {};
  try {
    const s = localStorage.getItem("aktech_registered");
    if (s) extra = JSON.parse(s);
  } catch (e) {
    /* ignore */
  }
  extra[email] = Object.assign({}, getAllUsers()[email], { pass: newPass });
  try {
    localStorage.setItem("aktech_registered", JSON.stringify(extra));
  } catch (e) {
    /* ignore */
  }
}

// ===== SESSION: used by App.jsx to remember who's logged in =====
const SESSION_KEY = "aktech_session";

// Returns the logged-in user's email, or null if nobody is logged in.
export function getSession() {
  try {
    return localStorage.getItem(SESSION_KEY) || null;
  } catch (e) {
    return null;
  }
}

// Marks `email` as the logged-in user (persists across page reloads).
export function setSession(email) {
  try {
    localStorage.setItem(SESSION_KEY, email);
  } catch (e) {
    /* ignore */
  }
}

// Logs the current user out.
export function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (e) {
    /* ignore */
  }
}

// ===== AUTH: used by Login.jsx =====

// Checks email + password against BUILTIN + registered users.
// Returns { ok: true, email } on success, or { ok: false, error } on failure.
export function authenticateUser(email, password) {
  const cleanEmail = (email || "").trim().toLowerCase();
  if (!cleanEmail || !password) {
    return { ok: false, error: "Enter both email and password." };
  }
  const users = getAllUsers();
  const user = users[cleanEmail];
  if (!user) {
    return { ok: false, error: "No account found with that email." };
  }
  if (user.pass !== password) {
    return { ok: false, error: "Incorrect password." };
  }
  return { ok: true, email: cleanEmail };
}

// Creates a new (non-admin) account from the signup form.
// form: { email, password, first, last, degree }
// Returns { ok: true, email } on success, or { ok: false, error } on failure.
export function registerUser(form) {
  const cleanEmail = (form.email || "").trim().toLowerCase();
  const first = (form.first || "").trim();
  const last = (form.last || "").trim();
  const password = form.password || "";
  const degree = form.degree || "";

  if (!first) {
    return { ok: false, error: "First name is required." };
  }
  if (!cleanEmail || !cleanEmail.includes("@")) {
    return { ok: false, error: "Enter a valid email." };
  }
  if (!password || password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }
  const existing = getAllUsers();
  if (existing[cleanEmail]) {
    return { ok: false, error: "An account with this email already exists." };
  }

  saveNewUser(cleanEmail, {
    pass: password,
    name: first,
    last,
    degree,
    year: "",
    role: "user",
  });

  return { ok: true, email: cleanEmail };
}