/* =========================
   WINDOW CONTROLS
========================= */

function closeApp() {
  window.close();
}

function minimize() {
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("minimize-window");
}

function toggleFull() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}



/* =========================
   FUNDING RULER
========================= */

function createFundingRuler() {
  const r = document.getElementById("fundingRuler");

  r.innerHTML =
    '<div id="fundingPointer" class="pointer" style="position:absolute;width:2px;background:yellow;z-index:2;"></div>';

  for (let h = 0; h <= 8; h++) {
    const pos = (h / 8) * 100;

    const tick = document.createElement("div");
    tick.className = "tick";

    let color = "#555", height = 8;

    if (h === 0 || h === 4 || h === 8) {
      color = "red"; height = 12;
    } else if (h % 2 === 0) {
      color = "#888"; height = 12;
    }

    tick.style.cssText = `height:${height}px;background:${color};left:${pos}%`;
    r.appendChild(tick);

    const label = document.createElement("div");
    label.className = "label";
    label.style.left = pos + "%";
    label.innerText = h;
    r.appendChild(label);
  }
}

/* =========================
   POINTERS
========================= */

function updateMinutePointer() {
  const now = new Date();
  const total = now.getUTCMinutes() + now.getUTCSeconds() / 60;

  document.getElementById("minutePointer").style.left =
    (total / 60) * 100 + "%";
}

function updateFundingPointer() {
  const now = new Date();
  const total =
    (now.getUTCHours() % 8) +
    now.getUTCMinutes() / 60 +
    now.getUTCSeconds() / 3600;

  document.getElementById("fundingPointer").style.left =
    (total / 8) * 100 + "%";
}

function updateHourPointer() {
  const now = new Date();
  const total =
    now.getUTCHours() +
    now.getUTCMinutes() / 60 +
    now.getUTCSeconds() / 3600;

  document.getElementById("hourPointer").style.left =
    (total / 24) * 100 + "%";
}

function updateSecondPointer() {
  const now = new Date();
  const total = now.getUTCSeconds() + now.getUTCMilliseconds() / 1000;

  document.getElementById("secondPointer").style.left =
    (total / 60) * 100 + "%";
}

/* =========================
   RULERS
========================= */

function createHourRuler() {
  const r = document.getElementById("hourRuler");
  r.innerHTML = '<div class="pointer hour" id="hourPointer"></div>';

  for (let i = 0; i <= 24; i++) {
    const pos = (i / 24) * 100;

    const tick = document.createElement("div");
    tick.className = "tick";

    let color = i % 8 === 0 ? "red" : "#aaa";
    let height = i % 8 === 0 ? 12 : 8;

    tick.style.cssText = `height:${height}px;background:${color};left:${pos}%`;
    r.appendChild(tick);

    if (i % 2 === 0) {
      const label = document.createElement("div");
      label.className = "label";
      label.style.left = pos + "%";
      label.innerText = i;
      r.appendChild(label);
    }
  }
}

function createMinuteRuler() {
  const r = document.getElementById("minuteRuler");

  for (let m = 0; m <= 60; m++) {
    const pos = (m / 60) * 100;

    const tick = document.createElement("div");
    tick.className = "tick";

    let color = "#555", height = 6;

    if (m % 30 === 0) { color = "red"; height = 12; }
    else if (m % 15 === 0) { color = "purple"; height = 12; }
    else if (m % 5 === 0) { color = "#aaa"; height = 10; }

    tick.style.cssText = `height:${height}px;background:${color};left:${pos}%`;
    r.appendChild(tick);

    if (m % 5 === 0) {
      const label = document.createElement("div");
      label.className = "label";
      label.style.left = pos + "%";
      label.innerText = m;
      r.appendChild(label);
    }
  }
}

function createSecondRuler() {
  const r = document.getElementById("secondRuler");

  for (let s = 0; s <= 60; s++) {
    const pos = (s / 60) * 100;

    const tick = document.createElement("div");
    tick.className = "tick";

    let color = "#555", height = 6;

    if (s % 30 === 0) { color = "red"; height = 12; }
    else if (s % 15 === 0) { color = "purple"; height = 12; }
    else if (s % 5 === 0) { color = "#aaa"; height = 10; }

    tick.style.cssText = `height:${height}px;background:${color};left:${pos}%`;
    r.appendChild(tick);

    if (s % 5 === 0) {
      const label = document.createElement("div");
      label.className = "label";
      label.style.left = pos + "%";
      label.innerText = s;
      r.appendChild(label);
    }
  }
}

/* =========================
   SESSION SYSTEM (FIXED CORE)
========================= */

const sessions = [
  { name: "Sydney", start: 22, end: 7 },
  { name: "Tokyo", start: 0, end: 9 },
  { name: "London", start: 8, end: 17 },
  { name: "New York", start: 13, end: 22 }
];

function getIntervals(s) {
  if (s.start < s.end) return [[s.start, s.end]];
  return [[s.start, 24], [0, s.end]];
}

function isActive(t, s) {
  return getIntervals(s).some(i => t >= i[0] && t < i[1]);
}

function getCountdown(end, t) {
  let diff = end - t;
  if (diff < 0) diff += 24;

  const total = Math.floor(diff * 3600);
  return `${String(Math.floor(total/3600)).padStart(2,"0")}:${String(Math.floor((total%3600)/60)).padStart(2,"0")}:${String(total%60).padStart(2,"0")}`;
}

function checkOverlap(a, b) {
  const A = getIntervals(a);
  const B = getIntervals(b);

  for (let x of A) {
    for (let y of B) {
      if (x[0] < y[1] && y[0] < x[1]) return true;
    }
  }
  return false;
}

/* =========================
   SESSION STATUS
========================= */

function updateStatus(t) {
  const active = sessions.filter(s => isActive(t, s));

  let lines = [];
  const seen = new Set();

  active.sort((a,b)=>a.start-b.start);

  const color = i => i===0?"#ffd400":i===1?"#00ffb3":"#aaa";

  for (let i=0;i<active.length;i++) {
    const s = active[i];

    lines.push({
      text: `${s.name} End In (${getCountdown(s.end,t)})`,
      color: color(i)
    });

    for (let j=i+1;j<active.length;j++) {
      const s2 = active[j];
      const key = [s.name,s2.name].sort().join("-");

      if (!seen.has(key) && checkOverlap(s,s2)) {
        seen.add(key);

        lines.push({
          text: `${s.name} + ${s2.name} 🔥(${getCountdown(Math.min(s.end,s2.end),t)})`,
          color: "#ff3b3b"
        });
      }
    }
  }

  document.getElementById("sessionStatus").innerHTML =
    lines.map(l=>`<div style="color:${l.color}">${l.text}</div>`).join("")
    || `<div style="color:#888">No Active Session</div>`;
}

/* =========================
   CLOCK ENGINE
========================= */

function tick() {
  const now = new Date();

  const SYSTEM_OFFSET = -now.getTimezoneOffset()/60;

  let h = now.getUTCHours();
  let m = now.getUTCMinutes();
  let s = now.getUTCSeconds();

  let localHour = h + SYSTEM_OFFSET;
  if (localHour >= 24) localHour -= 24;
  if (localHour < 0) localHour += 24;

  const h12 = localHour % 12 || 12;
  const ampm = localHour >= 12 ? "PM" : "AM";

  document.getElementById("digitalTime").innerText =
    `${String(h12).padStart(2,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")} ${ampm}`;

  const t = h + m/60 + s/3600;

  updateFundingPointer();
  updateHourPointer();
  updateMinutePointer();
  updateSecondPointer();
  updateStatus(t);

  requestAnimationFrame(tick);
}

/* =========================
   INIT
========================= */

createFundingRuler();
createHourRuler();
createMinuteRuler();
createSecondRuler();
tick();

document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll(".doc-item");

  // =========================
  // INIT: set height for open item
  // =========================
  items.forEach((item) => {
    const content = item.querySelector(".doc-content");

    if (item.classList.contains("open")) {
      content.style.height = content.scrollHeight + "px";
    } else {
      content.style.height = "0px";
    }
  });

  // =========================
  // CLICK HANDLER
  // =========================
  document.querySelectorAll(".doc-item summary").forEach((summary) => {
    summary.addEventListener("click", function (e) {
      e.preventDefault();

      const item = this.parentElement;
      const content = item.querySelector(".doc-content");

      const isOpen = item.classList.contains("open");

      // =========================
      // CLOSE if already open
      // =========================
      if (isOpen) {
        closeItem(item, content);
        return;
      }

      // =========================
      // CLOSE ALL FIRST
      // =========================
      items.forEach((el) => {
        closeItem(
          el,
          el.querySelector(".doc-content")
        );
      });

      // =========================
      // OPEN CLICKED
      // =========================
      openItem(item, content);
    });
  });
});

// =========================
// OPEN FUNCTION
// =========================
function openItem(item, content) {
  item.classList.add("open");

  content.style.transition = "height 0.25s ease";
  content.style.height = content.scrollHeight + "px";

  setTimeout(() => {
    content.style.height = "auto";
  }, 250);
}

// =========================
// CLOSE FUNCTION
// =========================
function closeItem(item, content) {
  if (!item.classList.contains("open")) return;

  item.classList.remove("open");

  content.style.transition = "height 0.25s ease";

  // force current height first
  content.style.height = content.scrollHeight + "px";

  requestAnimationFrame(() => {
    content.style.height = "0px";
  });
}