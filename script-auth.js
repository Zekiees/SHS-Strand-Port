// Toggles between dark and light mode, saves preference to localStorage
function toggleTheme() {
  const html = document.documentElement;
  const current = html.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateThemeLabel(next);
}

// Updates the button label text to show what mode you'll switch to
function updateThemeLabel(theme) {
  const label = theme === "dark" ? "Light Mode" : "Dark Mode";
  const authLabel = document.getElementById("authThemeLabel");
  const topLabel  = document.getElementById("topbarThemeLabel");
  if (authLabel) authLabel.textContent = label;
  if (topLabel)  topLabel.textContent  = theme === "dark" ? "Light" : "Dark";
}

// Reads saved theme from localStorage and applies it on page load
function loadTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  document.documentElement.setAttribute("data-theme", saved);
  updateThemeLabel(saved);
}

// Shows the login form and hides the register form
function showLogin() {
  document.getElementById("registerForm").style.display = "none";
  document.getElementById("loginForm").style.display = "block";
}

// Shows the register form and hides the login form
function showRegister() {
  document.getElementById("loginForm").style.display = "none";
  document.getElementById("registerForm").style.display = "block";
}

// Validates inputs and saves the new user account to localStorage
function register() {
  const lrn   = document.getElementById("regLRN")?.value.trim();
  const sn    = document.getElementById("regSurname")?.value.trim();
  const fn    = document.getElementById("regFirstname")?.value.trim();
  const pass  = document.getElementById("regPassword")?.value;
  const cpass = document.getElementById("regConfirmPassword")?.value;

  if (!lrn || lrn.length !== 12 || !/^\d{12}$/.test(lrn)) return showToast("Invalid LRN (12 digits expected)");
  if (!sn || !fn) return showToast("Surname and First Name are required");
  if (!pass || pass.length < 6) return showToast("Password must be at least 6 characters");
  if (pass !== cpass) return showToast("Passwords do not match");

  const user = { lrn, surname: sn, firstname: fn, password: pass };
  localStorage.setItem("strand_user", JSON.stringify(user));
  showToast("Account created! Please sign in.");
  showLogin();
}

// Verifies credentials against localStorage and redirects to dashboard on success
function login() {
  const lrn  = document.getElementById("loginLRN")?.value.trim();
  const pass = document.getElementById("loginPassword")?.value;
  const stored = JSON.parse(localStorage.getItem("strand_user") || "null");

  if (!stored || stored.lrn !== lrn || stored.password !== pass) {
    return showToast("Incorrect LRN or password");
  }

  // Mark session as active and store current user info for the dashboard
  localStorage.setItem("strand_logged_in", "1");
  localStorage.setItem("strand_current_user", JSON.stringify({
    lrn: stored.lrn,
    firstname: stored.firstname,
    surname: stored.surname
  }));

  window.location.href = "dashboard.html";
}

// Displays a brief toast notification message that auto-hides after 3.2s
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.add("show");
  setTimeout(() => t.classList.remove("show"), 3200);
}

window.addEventListener("load", () => {
  // Apply saved theme preference before anything renders
  loadTheme();

  // Attach Enter key listeners so forms submit without clicking the button
  document.querySelectorAll("#regLRN, #regSurname, #regFirstname, #regPassword, #regConfirmPassword")
    .forEach(el => el.addEventListener("keypress", e => { if (e.key === "Enter") register(); }));

  document.querySelectorAll("#loginLRN, #loginPassword")
    .forEach(el => el.addEventListener("keypress", e => { if (e.key === "Enter") login(); }));

  // Start on the login form by default
  showLogin();
});
