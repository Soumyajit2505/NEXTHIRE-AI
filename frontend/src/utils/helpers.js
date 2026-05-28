// NextHire AI - Frontend Helper Functions

function formatScore(score) {
  const num = Number(score);

  if (score === null || score === undefined || score === "" || Number.isNaN(num)) {
    return "0.00";
  }

  return num.toFixed(2);
}

function getMatchBadgeColor(level) {
  if (typeof level !== "string") {
    return "bg-zinc-800 text-gray-300 border border-zinc-700";
  }

  const normalized = level.trim().toLowerCase();

  if (normalized.includes("strong")) {
    return "bg-lime-400/15 text-lime-300 border border-lime-400/40";
  }

  if (normalized.includes("average") || normalized.includes("moderate")) {
    return "bg-yellow-400/15 text-yellow-300 border border-yellow-400/40";
  }

  if (normalized.includes("weak")) {
    return "bg-red-400/15 text-red-300 border border-red-400/40";
  }

  return "bg-zinc-800 text-gray-300 border border-zinc-700";
}

function splitSkills(skills) {
  if (!skills) return [];

  const rawList = Array.isArray(skills)
    ? skills
    : typeof skills === "string"
    ? skills.split(",")
    : [];

  return rawList
    .map((item) => String(item || "").trim())
    .filter(Boolean);
}

function formatDate(date) {
  if (!date) return "N/A";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "N/A";
  }

  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function truncateText(text, maxLength = 100) {
  if (text === null || text === undefined) return "";

  const str = String(text);
  const limit = Number(maxLength) > 0 ? Number(maxLength) : 100;

  return str.length > limit ? `${str.slice(0, limit).trim()}...` : str;
}

function getScoreColor(score) {
  const num = Number(score);

  if (score === null || score === undefined || score === "" || Number.isNaN(num)) {
    return "text-gray-400";
  }

  if (num >= 75) return "text-lime-300";
  if (num >= 50) return "text-yellow-300";

  return "text-red-300";
}

function getScoreLabel(score) {
  const num = Number(score);

  if (score === null || score === undefined || score === "" || Number.isNaN(num)) {
    return "Unknown";
  }

  if (num >= 75) return "Strong";
  if (num >= 50) return "Moderate";

  return "Weak";
}

function safeText(value) {
  if (value === null || value === undefined) return "N/A";

  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed === "" ? "N/A" : trimmed;
  }

  if (typeof value === "number") {
    return Number.isNaN(value) ? "N/A" : String(value);
  }

  if (typeof value === "boolean") {
    return String(value);
  }

  return "N/A";
}

export {
  formatScore,
  getMatchBadgeColor,
  splitSkills,
  formatDate,
  truncateText,
  getScoreColor,
  getScoreLabel,
  safeText,
};