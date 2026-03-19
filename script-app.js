// Redirect to login if user is not authenticated
if (localStorage.getItem("strand_logged_in") !== "1") {
  window.location.replace("index.html");
}

// Toggles between dark and light mode, saves preference to localStorage
function toggleTheme() {
  const html     = document.documentElement;
  const isDark   = html.getAttribute("data-theme") === "dark";
  const newTheme = isDark ? "light" : "dark";
  html.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  _updateThemeLabels(newTheme);
}

// Updates the topbar button label to show what mode you'll switch to
function _updateThemeLabels(theme) {
  const isDark   = theme === "dark";
  const topLabel = document.getElementById("topbarThemeLabel");
  if (topLabel) topLabel.textContent = isDark ? "Light" : "Dark";
}

// Reads saved theme from localStorage and applies it on page load
function _initTheme() {
  const saved = localStorage.getItem("theme");
  const theme = saved === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", theme);
  _updateThemeLabels(theme);
}

// Sets the school logo image across sidebar and topbar slots
function setSchoolLogo(src) {
  ["sidebarLogo", "topbarLogo"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.src = src;
  });
}

// Quiz questions — each maps to a strand and is scored by the student's answer
const questions = [
  // STEM — 8 questions
  { id: 1,  text: "I enjoy solving difficult math problems and number puzzles.", strand: "STEM" },
  { id: 2,  text: "Conducting science experiments and observing results excites me.", strand: "STEM" },
  { id: 3,  text: "I am interested in how machines, bridges, or structures are built.", strand: "STEM" },
  { id: 4,  text: "Studying biology, chemistry, or physics is something I genuinely enjoy.", strand: "STEM" },
  { id: 5,  text: "I want to pursue a career in medicine, nursing, or health sciences.", strand: "STEM" },
  { id: 6,  text: "I like researching scientific topics and drawing evidence-based conclusions.", strand: "STEM" },
  { id: 7,  text: "Technology and innovation — like AI, robotics, or software — fascinate me.", strand: "STEM" },
  { id: 8,  text: "I prefer analytical subjects over social or creative ones.", strand: "STEM" },

  // ABM — 7 questions
  { id: 9,  text: "I enjoy planning and managing finances or budgets.", strand: "ABM" },
  { id: 10, text: "Starting a business or being an entrepreneur is a goal of mine.", strand: "ABM" },
  { id: 11, text: "Studying market trends, supply and demand, or economics interests me.", strand: "ABM" },
  { id: 12, text: "I like creating marketing campaigns or selling ideas to people.", strand: "ABM" },
  { id: 13, text: "Accounting, bookkeeping, or financial reports are topics I want to learn.", strand: "ABM" },
  { id: 14, text: "I enjoy taking leadership roles and organizing teams.", strand: "ABM" },
  { id: 15, text: "Business law, taxation, or corporate management sounds interesting to me.", strand: "ABM" },

  // HUMSS — 7 questions
  { id: 16, text: "I love reading books, writing essays, or discussing literature.", strand: "HUMSS" },
  { id: 17, text: "Social issues like poverty, politics, or human rights concern me deeply.", strand: "HUMSS" },
  { id: 18, text: "Communicating, public speaking, or debating comes naturally to me.", strand: "HUMSS" },
  { id: 19, text: "I am drawn to history, philosophy, or understanding different cultures.", strand: "HUMSS" },
  { id: 20, text: "Psychology and understanding how people think and behave fascinates me.", strand: "HUMSS" },
  { id: 21, text: "I want to be a teacher, lawyer, journalist, or social worker.", strand: "HUMSS" },
  { id: 22, text: "I prefer subjects that involve discussion, research, and writing over lab work.", strand: "HUMSS" },

  // GAS — 6 questions
  { id: 23, text: "I have broad interests and haven't committed to one specific career yet.", strand: "GAS" },
  { id: 24, text: "I enjoy studying a mix of subjects — science, arts, and humanities equally.", strand: "GAS" },
  { id: 25, text: "I want to keep my college options open and decide later.", strand: "GAS" },
  { id: 26, text: "I like exploring topics like culture, current events, and general knowledge.", strand: "GAS" },
  { id: 27, text: "I am comfortable with both creative and logical types of schoolwork.", strand: "GAS" },
  { id: 28, text: "I prefer a flexible academic path over a very specialized one right now.", strand: "GAS" },

  // TVL-ICT — 7 questions (aligned to NC III Java, .Net, and CSS NC II)
  { id: 29, text: "I enjoy writing or learning computer programs and code.", strand: "TVL-ICT" },
  { id: 30, text: "I am interested in Java or .Net programming and software development.", strand: "TVL-ICT" },
  { id: 31, text: "Troubleshooting computers — like fixing hardware or reinstalling software — appeals to me.", strand: "TVL-ICT" },
  { id: 32, text: "I want to earn an NC certification in computer programming or systems servicing.", strand: "TVL-ICT" },
  { id: 33, text: "Setting up networks, installing operating systems, or configuring devices interests me.", strand: "TVL-ICT" },
  { id: 34, text: "I enjoy working with technology hands-on more than reading about it in textbooks.", strand: "TVL-ICT" },
  { id: 35, text: "Building or repairing computer hardware and peripherals is something I like doing.", strand: "TVL-ICT" },

  // TVL-HE — 8 questions (aligned to Cookery, Beauty Care, Dressmaking, etc.)
  { id: 36, text: "I love cooking or baking and experimenting with recipes.", strand: "TVL-HE" },
  { id: 37, text: "Preparing and serving food and beverages in a professional setting appeals to me.", strand: "TVL-HE" },
  { id: 38, text: "I enjoy sewing, dressmaking, or designing and altering clothes.", strand: "TVL-HE" },
  { id: 39, text: "Beauty care — like nail art, facial treatments, or skincare — excites me.", strand: "TVL-HE" },
  { id: 40, text: "Hairdressing, hair coloring, or hair styling is a skill I want to develop.", strand: "TVL-HE" },
  { id: 41, text: "I am interested in wellness massage and promoting health through therapy.", strand: "TVL-HE" },
  { id: 42, text: "Tailoring — cutting patterns and stitching garments — interests me.", strand: "TVL-HE" },
  { id: 43, text: "I want to earn an NC certification in a hospitality or home economics skill.", strand: "TVL-HE" },

  // TVL-IA — 7 questions (aligned to Electrical, Electronics, and Welding NC II)
  { id: 44, text: "I am interested in electrical wiring, circuits, and power installation.", strand: "TVL-IA" },
  { id: 45, text: "Working on electrical systems in homes or buildings appeals to me.", strand: "TVL-IA" },
  { id: 46, text: "Assembling or repairing electronic devices and gadgets is something I enjoy.", strand: "TVL-IA" },
  { id: 47, text: "I want to learn how electronic products like amplifiers or circuit boards are built.", strand: "TVL-IA" },
  { id: 48, text: "Welding and metal fabrication sounds like an exciting hands-on skill to learn.", strand: "TVL-IA" },
  { id: 49, text: "I prefer working with tools, machines, and physical materials over desk work.", strand: "TVL-IA" },
  { id: 50, text: "I want to earn an NC certification in electrical, electronics, or welding trades.", strand: "TVL-IA" }
];

// Strand reference data — name, emoji, description, and available courses
const strandData = {
  STEM: {
    name: "Science, Technology, Engineering & Mathematics",
    emoji: "🔬",
    desc: "For aspiring scientists, engineers, and medical professionals. Focuses on advanced math, sciences, and problem-solving.",
    courses: []
  },
  ABM: {
    name: "Accountancy, Business & Management",
    emoji: "💼",
    desc: "Prepares for business careers with emphasis on finance, management, and entrepreneurship.",
    courses: []
  },
  HUMSS: {
    name: "Humanities & Social Sciences",
    emoji: "📖",
    desc: "Ideal for law, teaching, journalism. Explores society, culture, and human behavior.",
    courses: []
  },
  GAS: {
    name: "General Academic Strand",
    emoji: "📚",
    desc: "Flexible strand for broad interests, bridging multiple fields for undecided students.",
    courses: []
  },
  "TVL-ICT": {
    name: "TVL - Information and Communications Technology (ICT)",
    emoji: "💻",
    desc: "Hands-on training in computer programming, networking, and systems servicing with TESDA NC certifications.",
    courses: ["Computer Programming NC III (Java)", "Programming .Net Technologies NC III", "Computer Systems Servicing NC II"]
  },
  "TVL-HE": {
    name: "TVL - Home Economics (HE)",
    emoji: "🏠",
    desc: "Practical skills in culinary, fashion, beauty, and wellness with TESDA NC certifications.",
    courses: ["Beauty Care (Nail Care) NC II", "Bread & Pastry Production NC II", "Cookery NC II", "Dressmaking NC II", "Food & Beverages Services NC II", "Hairdressing NC II", "Tailoring NC II", "Wellness Massage NC II"]
  },
  "TVL-IA": {
    name: "TVL - Industrial Arts (IA)",
    emoji: "⚙️",
    desc: "Technical training in electrical, electronics, and welding trades with TESDA NC certifications.",
    courses: ["Electrical Installation and Maintenance NC II", "Electronic Products Assembly and Servicing NC II", "Shielded Metal Arc Welding NC II"]
  }
};

// App state — tracks the current user, quiz answers, scores, and completion flags
let currentUser = null;
let quizAnswers = {};
let quizScores  = {};
let totalScores = {};
let top3Strands = [];
let quizDone    = false;
let gradesDone  = false;

// Switches the visible section and updates the active nav item and topbar title
function goTo(page) {
  document.querySelectorAll(".section").forEach(s => s.classList.remove("active"));
  document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));

  const section = document.getElementById("sec-" + page);
  const navItem = document.getElementById("nav-" + page);
  if (section) section.classList.add("active");
  if (navItem)  navItem.classList.add("active");

  const titles = {
    dashboard: "Dashboard",
    quiz:      "Interest Assessment",
    grades:    "Grade Input",
    results:   "My Results",
    strands:   "Strand Information Hub"
  };
  document.getElementById("topbarTitle").textContent = titles[page] || page;
  document.getElementById("sidebar").classList.remove("open");
}

// Toggles the sidebar open/closed on mobile
function toggleSidebar() {
  document.getElementById("sidebar").classList.toggle("open");
}

// Builds and injects quiz question cards into the DOM
function renderQuestions() {
  const container = document.getElementById("questionsContainer");
  container.innerHTML = "";

  questions.forEach((q, i) => {
    const card = document.createElement("div");
    card.className = "quiz-card";
    card.innerHTML = `
      <div class="quiz-question">
        <span class="quiz-num">${i + 1}</span>
        ${q.text}
      </div>
      <div class="quiz-options">
        <button class="quiz-option" onclick="selectOption(${q.id}, 0, this)">Disagree</button>
        <button class="quiz-option" onclick="selectOption(${q.id}, 1, this)">Neutral</button>
        <button class="quiz-option" onclick="selectOption(${q.id}, 2, this)">Agree</button>
        <button class="quiz-option" onclick="selectOption(${q.id}, 3, this)">Strongly Agree</button>
      </div>
    `;
    container.appendChild(card);
  });
}

// Records the selected answer for a question and highlights the chosen option
function selectOption(qid, val, el) {
  quizAnswers[qid] = val;
  el.closest(".quiz-options")
    .querySelectorAll(".quiz-option")
    .forEach(o => o.classList.remove("selected"));
  el.classList.add("selected");
}

// Validates all questions are answered, tallies scores per strand, then moves to grades
function submitQuiz() {
  if (Object.keys(quizAnswers).length < questions.length) {
    return showToast("Please answer all questions before continuing.");
  }
  quizScores = { STEM: 0, ABM: 0, HUMSS: 0, GAS: 0, "TVL-ICT": 0, "TVL-HE": 0, "TVL-IA": 0 };
  questions.forEach(q => { quizScores[q.strand] += (quizAnswers[q.id] || 0); });
  quizDone = true;
  updateDashboard();
  showToast("Assessment complete! Now enter your grades.");
  goTo("grades");
}

// Reads grade inputs, applies subject-based score boosts to strand totals, then shows results
function submitGrades() {
  if (!quizDone) {
    return showToast("Please complete the Interest Quiz first before entering grades.");
  }

  const math = parseInt(document.getElementById("mathGrade").value) || 0;
  const sci  = parseInt(document.getElementById("sciGrade").value)  || 0;
  const eng  = parseInt(document.getElementById("engGrade").value)  || 0;
  const fil  = parseInt(document.getElementById("filGrade").value)  || 0;
  const ap   = parseInt(document.getElementById("apGrade").value)   || 0;
  const tle  = parseInt(document.getElementById("tleGrade").value)  || 0;

  // Start from quiz scores then add grade-based boosts
  totalScores = { ...quizScores };

  if (math > 85) { totalScores.STEM += 6; totalScores.ABM += 4; totalScores["TVL-ICT"] += 3; }
  if (sci  > 85) { totalScores.STEM += 6; totalScores.GAS += 3; }
  if (eng  > 85) { totalScores.HUMSS += 6; totalScores.GAS += 4; totalScores.ABM += 3; }
  if (fil  > 85) { totalScores.HUMSS += 4; totalScores.GAS += 3; }
  if (ap   > 85) { totalScores.HUMSS += 3; totalScores.ABM += 3; totalScores.GAS += 3; }
  if (tle  > 85) { totalScores["TVL-ICT"] += 7; totalScores["TVL-HE"] += 7; totalScores["TVL-IA"] += 7; }

  // Bonus for strong combined scores
  if (math > 85 && sci > 85) totalScores.STEM  += 3;
  if (eng  > 85 && ap  > 85) totalScores.HUMSS += 3;

  gradesDone = true;
  renderResults();
  updateDashboard();
  showToast("Results calculated! Check your recommendations.");
  goTo("results");
}

// Sorts total scores and builds the top 3 podium cards
function renderResults() {
  const sorted = Object.entries(totalScores).sort((a, b) => b[1] - a[1]);
  top3Strands  = sorted.slice(0, 3).map(s => s[0]);

  const podium     = document.getElementById("resultPodium");
  podium.innerHTML = "";

  const rankClasses = ["rank-1", "rank-2", "rank-3"];
  const rankLabels  = ["#1 Best Fit", "#2 Great Match", "#3 Good Fit"];

  top3Strands.forEach((strand, i) => {
    const d    = strandData[strand];
    const card = document.createElement("div");
    card.className = `podium-card ${rankClasses[i]}`;
    card.innerHTML = `
      <div class="podium-badge">${i + 1}</div>
      <div class="podium-emoji">${d.emoji}</div>
      <div class="podium-strand-key">${strand}</div>
      <div class="podium-rank-label">${rankLabels[i]}</div>
      <div class="podium-strand-name">${d.name}</div>
    `;
    podium.appendChild(card);
  });

  // Update the dashboard stat card with the top strand
  if (top3Strands[0]) {
    const top = strandData[top3Strands[0]];
    document.getElementById("cardTopStrand").textContent = `${top.emoji} ${top3Strands[0]}`;
  }
}

// Updates stat cards and progress ring based on quiz/grade completion
function updateDashboard() {
  let pct = 0;
  document.getElementById("cardQuiz").textContent   = quizDone   ? "✓ Done" : "Pending";
  document.getElementById("cardGrades").textContent = gradesDone ? "✓ Done" : "Pending";
  if (quizDone)   pct += 50;
  if (gradesDone) pct += 50;
  document.getElementById("progressPct").textContent = pct + "%";
  document.getElementById("progressBar").style.strokeDashoffset = 207 - (207 * pct / 100);
}

// Builds and injects strand info cards into the Strand Info section
function renderStrandInfo() {
  const grid   = document.getElementById("strandInfoGrid");
  grid.innerHTML = "";

  Object.entries(strandData).forEach(([key, d]) => {
    const card = document.createElement("div");
    card.className = "strand-info-card";
    card.innerHTML = `
      <div class="strand-info-card__head">
        <div class="strand-info-card__icon">${d.emoji}</div>
        <div>
          <div class="strand-info-card__key">${key}</div>
          <div class="strand-info-card__name">${d.name}</div>
        </div>
      </div>
      <p class="strand-info-card__desc">${d.desc}</p>
      <div class="strand-career-label">Available Courses</div>
      <div class="strand-career-pills">
        ${d.courses.map(c => `<span class="career-pill">${c}</span>`).join("")}
      </div>
    `;
    grid.appendChild(card);
  });
}


// Opens print-template.html in a new tab, injects student data, then triggers print
function exportPDF() {
  if (!gradesDone || top3Strands.length === 0) {
    return showToast("Please complete the assessment and grades first.");
  }

  const date = new Date().toLocaleDateString("en-PH", { year: "numeric", month: "long", day: "numeric" });

  // Build the recommendations HTML to inject into the template
  const recommendationsHTML = top3Strands.map((s, i) => `
    <div class="rec-card rec-card--rank${i + 1}">
      <div class="rec-rank rec-rank--${i + 1}">${i + 1}</div>
      <div class="rec-body">
        <div class="rec-label">${["Best Fit", "Great Match", "Good Fit"][i]}</div>
        <div class="rec-strand">${strandData[s].emoji}&nbsp; ${s} &mdash; ${strandData[s].name}</div>
        <div class="rec-desc">${strandData[s].desc}</div>
      </div>
    </div>
  `).join("");

  // Fetch the print template, replace tokens with real data, then open and print
  fetch("print-template.html")
    .then(res => res.text())
    .then(html => {
      html = html.replace("{{STUDENT_NAME}}", `${currentUser.firstname} ${currentUser.surname}`);
      html = html.replace("{{STUDENT_NAME}}", `${currentUser.firstname} ${currentUser.surname}`);
      html = html.replace("{{STUDENT_LRN}}",  currentUser.lrn);
      html = html.replace("{{DATE}}",          date);
      html = html.replace("{{RECOMMENDATIONS}}", recommendationsHTML);

      const win = window.open("", "_blank");
      win.document.open();
      win.document.write(html);
      win.document.close();
      setTimeout(() => win.print(), 600);
    })
    .catch(() => {
      showToast("Could not load print template. Make sure print-template.html is in the same folder.");
    });
}


// Displays a brief toast notification that auto-hides after 3.4 seconds
function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove("show"), 3400);
}

window.addEventListener("load", () => {
  // Apply saved theme before the page renders
  _initTheme();

  // Load logged-in user data and populate name/avatar in sidebar and welcome banner
  const stored = JSON.parse(localStorage.getItem("strand_current_user") || "null");
  if (stored) {
    currentUser = stored;
    const fullName = `${currentUser.firstname} ${currentUser.surname}`;
    document.getElementById("welcomeName").textContent      = currentUser.firstname;
    document.getElementById("sidebarUserName").textContent  = fullName;
    const initial = currentUser.firstname[0].toUpperCase();
    document.getElementById("userAvatarInitial").textContent = initial;
    document.getElementById("sidebarAvatar").textContent     = initial;
  }

  // Render all dynamic content and start on the dashboard section
  renderQuestions();
  renderStrandInfo();
  updateDashboard();
  goTo("dashboard");

  // Show the hamburger menu button on small screens
  if (window.innerWidth <= 768) {
    const btn = document.getElementById("menuBtn");
    if (btn) btn.style.display = "flex";
  }
});

// Clears session data and sends the user back to the login page
function logout() {
  localStorage.removeItem("strand_logged_in");
  localStorage.removeItem("strand_current_user");
  window.location.replace("index.html");
}
