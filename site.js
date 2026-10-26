const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  const open = navToggle.getAttribute("aria-expanded") !== "true";
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.textContent = open ? "Close" : "Menu";
  navLinks.dataset.open = String(open);
});
navLinks?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    navLinks.dataset.open = "false";
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.textContent = "Menu";
  }),
);
const form = document.querySelector("[data-inquiry]");
function connectBrief(title, collect) {
  if (!form) return;
  form
    .querySelectorAll('[type="submit"]')
    .forEach((button) => (button.disabled = false));
  const result = document.getElementById("brief-result"),
    area = document.getElementById("brief-text"),
    email = document.getElementById("email-brief"),
    status = document.getElementById("copy-status");
  const update = () => {
    email.href =
      "mailto:josephjilovec@pm.me?subject=" +
      encodeURIComponent(title) +
      "&body=" +
      encodeURIComponent(area.value);
  };
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    area.value =
      title +
      "\n\n" +
      collect(new FormData(form)) +
      "\n\nI understand this service is in development. Please let me know whether a suitable pilot is available and agree the scope before any engagement.";
    update();
    result.hidden = false;
    document.getElementById("brief-heading").focus();
    status.textContent =
      "Draft created in this browser. Nothing has been sent.";
  });
  area.addEventListener("input", update);
  document.getElementById("copy-brief").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(area.value);
      status.textContent =
        "Copied. Paste the draft into your preferred email app.";
    } catch {
      area.focus();
      area.select();
      status.textContent =
        "Select and copy the draft above using your device’s copy command.";
    }
  });
  form.addEventListener("input", (e) => {
    if (e.target.closest("#brief-result")) return;
    result.hidden = true;
    status.textContent = "";
  });
}
function observeChapters(selector, onChange) {
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver(
    (entries) => {
      const active = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (active) onChange(active.target.dataset.chapter);
    },
    { rootMargin: "-18% 0px -36% 0px", threshold: [0, 0.25, 0.5] },
  );
  document.querySelectorAll(selector).forEach((e) => observer.observe(e));
}
const timeNotes = {
  day: "Daytime generation and daytime consumption are separate records. Compare their timing before assuming they match.",
  evening:
    "Evening demand may continue after solar generation falls. Review the tariff, timing and any proposed storage assumptions.",
  interruption:
    "The grid connection is unavailable in this illustrative scene. Backup requires a verified design for selected loads and operating limits.",
};
function setTime(id) {
  if (!timeNotes[id]) return;
  document.querySelector(".power-scene").dataset.time = id;
  document.getElementById("scene-note").textContent = timeNotes[id];
  document
    .querySelectorAll("[data-time-select]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.timeSelect === id)),
    );
}
document
  .querySelectorAll("[data-time-select]")
  .forEach((b) =>
    b.addEventListener("click", () => setTime(b.dataset.timeSelect)),
  );
function updateEnergy() {
  const watts = [...document.querySelectorAll("[data-watts]:checked")].reduce(
    (sum, e) => sum + Number(e.dataset.watts),
    0,
  );
  const hours = Number(document.getElementById("hours").value);
  document.getElementById("hours-value").textContent =
    hours + (hours === 1 ? " hour" : " hours");
  document.getElementById("power-total").textContent =
    watts + " W average × " + hours + " hours";
  document
    .getElementById("energy-total")
    .replaceChildren(
      document.createTextNode(((watts * hours) / 1000).toFixed(2) + " "),
    );
  const unit = document.createElement("small");
  unit.textContent = "kWh";
  document.getElementById("energy-total").append(unit);
}
document
  .querySelectorAll("[data-watts],#hours")
  .forEach((e) => e.addEventListener("input", updateEnergy));
connectBrief(
  "Solvanti — household planning interest",
  (d) =>
    "Main decision: " +
    d.get("priority") +
    "\nBilling history: " +
    d.get("records") +
    "\nHousehold priorities and questions: " +
    (d.get("context") || "To discuss") +
    "\n\nPlease help define the records, assumptions and site-specific questions to take to a qualified provider. The website arithmetic example is fictional and is not a measurement of my home.",
);
