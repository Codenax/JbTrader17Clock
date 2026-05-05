function ForexSessionRuler(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  container.style.position = "relative";
  container.style.width = "100%";
    
  

  const sessions = [
    { name: "Sydney", start: 22, end: 7, color: "#007ea7" },
    { name: "Tokyo", start: 0, end: 9, color: "#5a189a" },
    { name: "London", start: 8, end: 17, color: "#c9184a" },
    { name: "New York", start: 13, end: 22, color: "#2b9348" }
  ];

  function timeToPercent(h) {
    return (h / 24) * 100;
  }

  const rowHeight = 17;
  const startY = 17;

  function getRowY(index) {
    return startY + index * rowHeight;
  }

  function isActive(utc, start, end) {
    if (start < end) return utc >= start && utc < end;
    return utc >= start || utc < end;
  }

  // =========================
  // TICKS
  // =========================
  for (let i = 0; i <= 24; i++) {
    const left = (i / 24) * 100;

    const tick = document.createElement("div");
    tick.style.position = "absolute";
    tick.style.left = left + "%";
    tick.style.top = "18px";
    tick.style.height = "70%";
    tick.style.width = "1px";
    tick.style.background = "#1a1a1a";
    container.appendChild(tick);

    if (i % 2 === 0) {
      const label = document.createElement("div");
      label.innerText = i;
      label.style.position = "absolute";
      label.style.left = left + "%";
      label.style.top = "5px";
      label.style.transform = "translateX(-50%)";
      label.style.fontSize = "9px";
      label.style.color = "#ffffff";
      container.appendChild(label);
    }
  }
// =========================
// BOTTOM LOCAL TIME LABELS
// =========================
 // =========================
 // BOTTOM LOCAL TIME LABELS (12H FORMAT)
 // =========================
for (let i = 0; i <= 24; i++) {
  if (i % 2 === 0) {
    const localLabel = document.createElement("div");

    const now = new Date();
    const offset = now.getTimezoneOffset() / -60;
    let localHour = (i + offset) % 24;
    if (localHour < 0) localHour += 24;

    // 12H conversion
    let hour12 = localHour % 12;
    if (hour12 === 0) hour12 = 12;

    const ampm = localHour >= 12 ? "PM" : "AM";

    // container style
    localLabel.style.position = "absolute";
    localLabel.style.left = (i / 24) * 100 + "%";
    localLabel.style.bottom = "2px";
    localLabel.style.transform = "translateX(-50%)";
    localLabel.style.fontSize = "9px";
    localLabel.style.color = "#ffffff";
    localLabel.classList.add("label");

    // main hour
    const hourSpan = document.createElement("span");
    hourSpan.innerText = hour12;

    // small AM/PM
    const ampmSpan = document.createElement("span");
    ampmSpan.innerText = ampm;
    ampmSpan.style.fontSize = "6px";   // 👈 smaller
    ampmSpan.style.marginLeft = "2px";
   if (ampm === "AM") {
  ampmSpan.style.color = "#00c3ff"; // blue (your system sky blue)
} else {
  ampmSpan.style.color = "#ff7b00"; // orange (your warning color)
}

    localLabel.appendChild(hourSpan);
    localLabel.appendChild(ampmSpan);

    container.appendChild(localLabel);
  }
}
  const bars = [];

  function createBar(session, rowIndex, start, end, type) {
    const bar = document.createElement("div");

    bar.style.position = "absolute";
    bar.style.left = timeToPercent(start) + "%";
    bar.style.top = getRowY(rowIndex) + "px";
    bar.style.height = "14px";
    bar.style.width = timeToPercent(end - start) + "%";
    bar.style.background = session.color;
    bar.style.opacity = "0.35";
    bar.style.borderLeft = `2px solid ${session.color}`;
    bar.style.borderRight = `2px solid ${session.color}`;
    bar.style.borderRadius = "4px";
    bar.style.zIndex = 5;

    bar.dataset.session = session.name;
    bar.dataset.part = type;

    if (type === "label") {
      const label = document.createElement("div");
      label.innerText = session.name;

      label.style.position = "absolute";
      label.style.left = "0px";
      label.style.top = "50%";
      label.style.transform = "translateY(-50%)";
      label.style.fontSize = "8px";
      label.style.color = "#fff";
      label.style.fontWeight = "bold";

      bar.appendChild(label);

      const countdown = document.createElement("div");
      countdown.className = "countdown";
      countdown.dataset.end = end;

      countdown.style.position = "absolute";
      countdown.style.right = "0px";
      countdown.style.top = "50%";
      countdown.style.transform = "translateY(-50%)";
      countdown.style.fontSize = "8px";
      countdown.style.color = "#fff";
      countdown.style.fontWeight = "bold";
      countdown.style.display = "none";

      bar.appendChild(countdown);
    }

    container.appendChild(bar);
    bars.push(bar);
  }

  // =========================
  // BUILD SESSION BARS
  // =========================
  sessions.forEach((session, index) => {
    if (session.name === "Sydney") {
      createBar(session, index, 22, 24, "none");
      createBar(session, index, 0, 7, "label");
    } else {
      if (session.start < session.end) {
        createBar(session, index, session.start, session.end, "label");
      } else {
        createBar(session, index, session.start, 24, "label");
        createBar(session, index, 0, session.end, "label");
      }
    }
  });

  // =========================
  // POINTER
  // =========================
  const pointer = document.createElement("div");
  pointer.style.position = "absolute";
  pointer.style.top = "16px";
  pointer.style.bottom = "0";
  pointer.style.width = "2px";
  pointer.style.background = "yellow";
  pointer.style.boxShadow = "0 0 3px yellow";
  pointer.style.height = "70%";
  pointer.style.zIndex = "1";
  
  container.appendChild(pointer);

  // =========================
  // UPDATE LOOP
  // =========================
  function updateUI() {
    const now = new Date();
    const utc =
      now.getUTCHours() +
      now.getUTCMinutes() / 60 +
      now.getUTCSeconds() / 3600;

    pointer.style.left = timeToPercent(utc) + "%";

    const sydneyActive =
      isActive(utc, 22, 24) || isActive(utc, 0, 7);

    bars.forEach((bar) => {
      const session = bar.dataset.session;
      const part = bar.dataset.part;
      const countdown = bar.querySelector(".countdown");

      let active = false;

      if (session === "Sydney") {
        active = sydneyActive;
      } else {
        const s = sessions.find(x => x.name === session);
        active = isActive(utc, s.start, s.end);
      }

      // RESET STYLE
      bar.style.opacity = "0.35";
      bar.style.boxShadow = "none";
      bar.style.transform = "scale(1)";
      bar.style.zIndex = "1";

      // ACTIVE STYLE
      if (active) {
        const sessionData = sessions.find(s => s.name === session);

        bar.style.opacity = "0.95";
        bar.style.boxShadow = `0 0 3px ${sessionData.color}`;
        bar.style.transform = "scale(1.02)";
        bar.style.zIndex = "5";
      }

      // =========================
      // COUNTDOWN (ALL SESSIONS)
      // =========================
      if (countdown) {
        if (active) {
          countdown.style.display = "block";

          let end;

          if (session === "Sydney") {
            end = parseFloat(countdown.dataset.end);
          } else {
            const sData = sessions.find(s => s.name === session);
            end = sData.end;
          }

          let diff = end - utc;
          if (diff < 0) diff += 24;

          const totalSeconds = Math.floor(diff * 3600);

          const h = Math.floor(totalSeconds / 3600);
          const m = Math.floor((totalSeconds % 3600) / 60);
          const s = totalSeconds % 60;

          countdown.innerText =
            `${String(h).padStart(2, "0")}:` +
            `${String(m).padStart(2, "0")}:` +
            `${String(s).padStart(2, "0")}`;

        } else {
          countdown.style.display = "none";
        }
      }
    });
  }

  updateUI();
  setInterval(updateUI, 1000);
}

window.createForexSessionRuler = ForexSessionRuler;