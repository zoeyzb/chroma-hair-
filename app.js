const $ = (s) => document.querySelector(s);
addEventListener("scroll", () => $("#nav").classList.toggle("s", scrollY > 60));
const menuToggle = $("#menu-toggle"),
  nav = $("#nav");
function closeMenu() {
  nav.classList.remove("mobile-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}
menuToggle.addEventListener("click", () => {
  const open = nav.classList.toggle("mobile-open");
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute(
    "aria-label",
    open ? "Close navigation" : "Open navigation",
  );
});
$("#nav-links")
  .querySelectorAll("a")
  .forEach((link) => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

/* services: arrows + drag + 3D */
const sc = $("#sc"),
  cw = () => sc.querySelector(".svc").offsetWidth + 28;
$("#nx").onclick = () => sc.scrollBy({ left: cw(), behavior: "smooth" });
$("#pv").onclick = () => sc.scrollBy({ left: -cw(), behavior: "smooth" });
let dn = 0,
  sx = 0,
  sl = 0,
  mv = 0;
sc.onpointerdown = (e) => {
  dn = 1;
  sx = e.clientX;
  sl = sc.scrollLeft;
  mv = 0;
};
addEventListener("pointermove", (e) => {
  if (!dn) return;
  const d = e.clientX - sx;
  if (Math.abs(d) > 4) {
    mv = 1;
    sc.classList.add("d");
  }
  sc.scrollLeft = sl - d;
});
addEventListener("pointerup", () => {
  dn = 0;
  sc.classList.remove("d");
});
sc.onclick = (e) => {
  if (mv) {
    e.preventDefault();
    mv = 0;
  }
};
const f3 = () =>
  sc.querySelectorAll(".svc").forEach((c) => {
    const r = c.getBoundingClientRect(),
      k = Math.max(
        -1,
        Math.min(1, (r.left + r.width / 2 - innerWidth / 2) / innerWidth),
      );
    c.style.transform = `rotateY(${-k * 26}deg) scale(${1 - Math.abs(k) * 0.1})`;
  });
sc.addEventListener("scroll", f3);
addEventListener("resize", f3);
f3();
/* 3D tilt */
document.querySelectorAll(".tl").forEach((e) => {
  e.addEventListener("pointermove", (v) => {
    const r = e.getBoundingClientRect(),
      x = (v.clientX - r.left) / r.width,
      y = (v.clientY - r.top) / r.height;
    e.style.transform = `perspective(900px) rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 14}deg)`;
    e.style.setProperty("--mx", x * 100 + "%");
    e.style.setProperty("--my", y * 100 + "%");
  });
  e.addEventListener("pointerleave", () => (e.style.transform = ""));
});
/* Booking request builder */
const B = { s: null, d: null, t: null },
  MN = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
const cm = new Date();
cm.setDate(1);
const firstMonth = new Date(cm);
$("#wd").innerHTML = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"]
  .map((day) => "<span>" + day + "</span>")
  .join("");
function updateSummary() {
  const parts = [];
  if (B.s) parts.push(B.s);
  if (B.d)
    parts.push(
      B.d.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    );
  if (B.t) parts.push(B.t);
  $("#sm").textContent = parts.length
    ? "Preferred: " + parts.join(" · ")
    : "Choose a service, preferred date and time.";
}
function renderTimes() {
  $("#tf").hidden = !B.d;
  const times = $("#ts");
  times.innerHTML = "";
  if (B.d)
    [
      "10:00 AM",
      "11:30 AM",
      "1:00 PM",
      "2:30 PM",
      "4:00 PM",
      "5:30 PM",
    ].forEach((time) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = time;
      button.className = B.t === time ? "on" : "";
      button.setAttribute("aria-pressed", String(B.t === time));
      button.addEventListener("click", () => {
        B.t = time;
        renderTimes();
        updateSummary();
        $("#booking-result").hidden = true;
      });
      times.appendChild(button);
    });
}
function renderCalendar() {
  $("#cm").textContent = MN[cm.getMonth()] + " " + cm.getFullYear();
  $("#cp").disabled = cm <= firstMonth;
  const grid = $("#dg");
  grid.innerHTML = "";
  const count = new Date(cm.getFullYear(), cm.getMonth() + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let blank = 0; blank < cm.getDay(); blank++)
    grid.appendChild(document.createElement("span"));
  for (let day = 1; day <= count; day++) {
    const date = new Date(cm.getFullYear(), cm.getMonth(), day),
      button = document.createElement("button");
    button.type = "button";
    button.textContent = String(day);
    const selectable = date > today && date.getDay() > 1;
    button.disabled = !selectable;
    if (selectable) button.classList.add("av");
    const selected = Boolean(B.d && B.d.getTime() === date.getTime());
    if (selected) button.classList.add("on");
    button.setAttribute("aria-pressed", String(selected));
    button.setAttribute(
      "aria-label",
      date.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }),
    );
    if (selectable)
      button.addEventListener("click", () => {
        B.d = date;
        B.t = null;
        renderCalendar();
        renderTimes();
        updateSummary();
        $("#booking-result").hidden = true;
      });
    grid.appendChild(button);
  }
}
function changeMonth(offset) {
  const next = new Date(cm.getFullYear(), cm.getMonth() + offset, 1);
  if (next < firstMonth) return;
  cm.setTime(next.getTime());
  B.d = null;
  B.t = null;
  renderCalendar();
  renderTimes();
  updateSummary();
  $("#booking-result").hidden = true;
}
$("#cn").addEventListener("click", () => changeMonth(1));
$("#cp").addEventListener("click", () => changeMonth(-1));
document.querySelectorAll("#svs button").forEach((button) => {
  button.addEventListener("click", () => {
    document.querySelectorAll("#svs button").forEach((option) => {
      option.classList.remove("on");
      option.setAttribute("aria-pressed", "false");
    });
    button.classList.add("on");
    button.setAttribute("aria-pressed", "true");
    B.s = button.textContent.trim();
    $("#booking-result").hidden = true;
    $("#form-status").textContent = "";
    updateSummary();
  });
});
$("#bf").addEventListener("submit", (event) => {
  event.preventDefault();
  if (!(B.s && B.d && B.t)) {
    $("#form-status").textContent =
      "Choose a service, preferred date, and preferred time first.";
    return;
  }
  const name = $("#client-name").value.trim(),
    contact = $("#client-contact").value.trim();
  if (!name || !contact) {
    $("#form-status").textContent =
      "Add your name and a way for the salon to reach you.";
    return;
  }
  const date = B.d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const request = [
    "CHROMA HAIR ATELIER — APPOINTMENT REQUEST",
    "Name: " + name,
    "Contact: " + contact,
    "Service: " + B.s,
    "Preferred date: " + date,
    "Preferred time: " + B.t,
    "",
    "Please confirm availability and the appointment details.",
  ].join("\n");
  $("#booking-message").value = request;
  $("#booking-result").hidden = false;
  $("#form-status").textContent =
    "Your request is prepared. It has not been sent and no appointment is booked until the salon confirms.";
  $("#booking-result").scrollIntoView({
    behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? "auto"
      : "smooth",
    block: "nearest",
  });
});
$("#copy-request").addEventListener("click", async () => {
  const field = $("#booking-message");
  try {
    if (!navigator.clipboard || !window.isSecureContext)
      throw new Error("Clipboard unavailable");
    await navigator.clipboard.writeText(field.value);
    $("#form-status").textContent =
      "Request copied. Send it to the salon to confirm your appointment.";
  } catch (error) {
    field.focus();
    field.select();
    $("#form-status").textContent =
      "Your request is ready above. Copy it and send it to the salon to confirm.";
  }
});
renderCalendar();
renderTimes();
updateSummary();
