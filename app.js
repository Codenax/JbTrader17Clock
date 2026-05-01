 /* WINDOW */
    function closeApp() { window.close(); }

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
function toggleMenu() {
  const menu = document.getElementById("sideMenu");
  menu.classList.toggle("open");
}
    function createFundingRuler() {
      const r = document.getElementById("fundingRuler");

      r.innerHTML = '<div id="fundingPointer" class="pointer" style="position:absolute;width:2px;background:yellow;z-index:2;"></div>';

      for (let h = 0; h <= 8; h++) {
        const pos = (h / 8) * 100;

        const tick = document.createElement("div");
        tick.className = "tick";

        let color = "#555", height = 8;

        if (h === 0 || h === 4 || h === 8) {
          color = "red";
          height = 12;
        } else if (h % 2 === 0) {
          color = "#888";
          height = 12;
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

    function updateFundingPointer() {
      const now = new Date();

      const hours = now.getUTCHours();
      const minutes = now.getUTCMinutes();
      const seconds = now.getUTCSeconds();

      const totalHours = (hours % 8) + minutes / 60 + seconds / 3600;

      const pos = (totalHours / 8) * 100;

      document.getElementById("fundingPointer").style.left = pos + "%";
    }

    createFundingRuler();
    setInterval(updateFundingPointer, 1000);
    /* BASIC RULERS (same as before) */


    function createHourRuler() {
      const r = document.getElementById("hourRuler");
      r.innerHTML = '<div class="pointer hour" id="hourPointer"></div>';

      for (let i = 0; i <= 24; i++) {

        const pos = (i / 24) * 100;

        const tick = document.createElement("div");
        tick.className = "tick";

        let color = "#555", height = 6;

        if (i % 8 === 0) {
          color = "red";
          height = 12;
        } else {
          color = "#aaa";
          height = 8;
        }

        tick.style.cssText = `height:${height}px;background:${color};left:${pos}%`;
        r.appendChild(tick);

        // 🔥 CORRECT LABEL LOGIC
        if (i % 2 === 0) {
          const label = document.createElement("div");
          label.className = "label";
          label.style.left = pos + "%";

          let labelValue;

          if (i === 24) {
            labelValue = 24; // ✅ last fix
          } else {
            labelValue = (i + 24) % 24;
          }

          label.innerText = labelValue;

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

    /* SESSION RULER WITH 30 MIN TICKS */
    function createSessionRuler() {
      const r = document.getElementById("sessionRuler");
      r.innerHTML = '<div class="pointer" id="sessionPointer" style="background:yellow;z-index:1;"></div>';

      for (let h = 18; h <= 24; h++) {

        // POSITION (6PM → 12AM)
        let pos = ((h - 18) / 6) * 100;

        // MAIN TICK
        const tick = document.createElement("div");
        tick.className = "tick";

        let color = "#555";
        let height = 8;

        if (h >= 19 && h <= 23) {
          color = "#00ffb3";
          height = 13;
        }

        tick.style.cssText = `height:${height}px;background:${color};left:${pos}%`;
        r.appendChild(tick);

        // 30 MIN TICK
        if (h !== 24) {
          let midPos = ((h - 18 + 0.5) / 6) * 100;
          const midTick = document.createElement("div");
          midTick.className = "tick";
          midTick.style.cssText = `height:6px;background:#777;left:${midPos}%`;
          r.appendChild(midTick);
        }

        // TOP LABEL (FIXED 12AM HANDLING)
        const top = document.createElement("div");
        top.className = "label-top";
        top.style.left = pos + "%";

        if (h === 24) {
          top.innerText = "12AM";   // ✅ FIXED
        } else {
          let displayHour = h - 12; // 18→6PM, 19→7PM ...
          top.innerText = displayHour + "PM";
        }

        r.appendChild(top);

        // BOTTOM LABEL
        const bottom = document.createElement("div");
        bottom.className = "label-bottom";
        bottom.style.left = pos + "%";

        if (h === 19) {
          bottom.innerText = "N Start";
          bottom.style.color = "#00ffb3";
        }
        else if (h === 23) {
          bottom.innerText = "L End";
          bottom.style.color = "#ff3b3b";
        }
        else if (h > 19 && h < 23) {
          bottom.innerText = "N+L";
          bottom.style.color = "#aaa";
        }

        r.appendChild(bottom);
      }
    }
    /* =========================
       SESSION TIME FORMATTER
    ========================= */

    function formatCountdown(now, target) {
      let diff = target - now;
      if (diff < 0) diff += 24;

      const totalSec = Math.floor(diff * 3600);

      const hh = Math.floor(totalSec / 3600);
      const mm = Math.floor((totalSec % 3600) / 60);
      const ss = totalSec % 60;

      return `${hh}:${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
    }

    /* =========================
   SESSIONS status dispay start
========================= */
    const sessions = [
      { name: "Sydney", start: 4, end: 13 },
      { name: "Tokyo", start: 6, end: 15 },
      { name: "London", start: 14, end: 23 },
      { name: "New York", start: 19, end: 4 }
    ];

    function isActiveSession(t, s, e) {
      if (e > s) return t >= s && t < e;
      return (t >= s && t < 24) || (t >= 0 && t < e);
    }

    function getCD(end, t) {
      let d = end - t;
      if (d < 0) d += 24;
      let sec = Math.floor(d * 3600);
      let h = Math.floor(sec / 3600);
      let m = Math.floor((sec % 3600) / 60);
      let s = sec % 60;
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }

    /* =========================
       DYNAMIC STATUS + OVERLAP
    ========================= */
    function updateStatus(t) {

      let active = [];

      sessions.forEach(s => {
        if (isActiveSession(t, s.start, s.end)) {
          active.push(s);
        }
      });

      active.sort((a, b) => a.start - b.start);

      let lines = [];

      /* =========================
         COLOR BY POSITION (SIMPLE RULE)
      ========================= */
      function getColor(index, isOverlap = false) {

        // overlap always red
        if (isOverlap) return "#ff3b3b";

        // normal lines
        if (index === 0) return "#ffd400"; // yellow
        if (index === 1) return "#00ffb3"; // sky blue
        return "#aaa";
      }

      /* =========================
         BUILD LINES
      ========================= */
      for (let i = 0; i < active.length; i++) {

        let cd = getCD(active[i].end, t);

        /* MAIN LINE */
        lines.push({
          text: `${active[i].name} End In (${cd})`,
          color: getColor(i, false)
        });

        /* =========================
           OVERLAP LINE (ALWAYS RED)
        ========================= */
        if (i < active.length - 1) {

          let endA = active[i].end;
          let endB = active[i + 1].end;

          if (endA < active[i].start) endA += 24;
          if (endB < active[i + 1].start) endB += 24;

          let overlapEnd = endA < endB ? active[i].end : active[i + 1].end;

          let ocd = getCD(overlapEnd, t);

          lines.push({
            text: `${active[i].name} + ${active[i + 1].name} 🔥 (${ocd})`,
            color: getColor(i, true)
          });

        }

      }

      /* =========================
         RENDER
      ========================= */
      document.getElementById("sessionStatus").innerHTML =
        lines.map(l => `<div style="color:${l.color}">${l.text}</div>`).join("")
        || `<div style="color:#888">No Active Session</div>`;

    }

    /* =========================
       CLOCK LOOP
    ========================= */
    function tick() {

      const now = new Date();

      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds() + now.getMilliseconds() / 1000;

      document.getElementById("digitalTime").innerText =
        `${String(h % 12 || 12).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Math.floor(s)).padStart(2, '0')}`;

      let t = h + m / 60 + s / 3600;

      updateStatus(t);

      requestAnimationFrame(tick);
    }

    tick();



    /* =========================
      SESSIONS status dispay end
    ========================= */





    function formatCountdown(hoursLeft) {
      const total = Math.max(0, Math.floor(hoursLeft * 3600));

      const hh = Math.floor(total / 3600);
      const mm = Math.floor((total % 3600) / 60);
      const ss = total % 60;

      return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    }

    /* ========================= Multi session ruler start ========================= */



    function createMultiSessionRuler() {
      const r = document.getElementById("multiSessionRuler");

      r.innerHTML = '<div class="pointer" id="multiPointer" style="top:20px;height:100%;width:2px;background:yellow;"></div>';

      // 🔥 24 ticks + TOP LABELS
      for (let h = 0; h <= 24; h++) {
        let pos = (h / 24) * 100;

        // tick
        const tick = document.createElement("div");
        tick.className = "tick";
        tick.style.left = pos + "%";
        r.appendChild(tick);

        // label every 2 hours
        if (h % 2 === 0) {
          const lbl = document.createElement("div");
          lbl.className = "top-label";
          lbl.style.left = pos + "%";

          let hour = h % 24;

          let display;

          if (hour === 0) display = "12";
          else if (hour === 12) display = "12";
          else if (hour > 12) display = (hour - 12);
          else display = hour;

          // 🔥 COLOR LOGIC
          if (hour < 12) {
            lbl.style.color = "#00c3ff"; // AM → sky blue
          } else {
            lbl.style.color = "#ff7b00"; // PM → orange
          }

          // 24 case
          if (h === 24) {
            display = "12";
            lbl.style.color = "#00c3ff"; // AM
          }

          lbl.innerText = display;

          r.appendChild(lbl);
        }

      }

      // helper
      function addSession(start, end, top, color, label) {

        function draw(s, e, showLabel = false, isNYBottom = false) {
          const left = (s / 24) * 100;
          const width = ((e - s) / 24) * 100;

          const line = document.createElement("div");
          line.className = "session-line";
          line.style.cssText = `
      left:${left}%;
      width:${width}%;
      top:${top}px;
      background:${color};
      position:absolute;
      opacity:0.25;
      transition:0.3s;
    `;

          line._session = {
            start: s,
            end: e,
            label,
            isNY: (label === "New York"),
            isNYBottom
          };

          // 🔴 LABEL ONLY WHEN showLabel = true
          if (showLabel) {
            const txt = document.createElement("div");
            txt.className = "session-label";
            txt.innerText = label;
            line.appendChild(txt);
          }

          r.appendChild(line);
        }

        if (end > start) {
          draw(start, end, true);
        } else {
          // 🔥 New York split
          draw(start, 24, true, false);   // 19–24 → LABEL ONLY
          draw(0, end, false, true);      // 0–4 → COUNTDOWN ONLY
        }
      }

      // helper
      /* ========================= Sessions ========================= */

      addSession(4, 13, 24, "#007ea7", "Sydney", true);
      addSession(6, 15, 41, "#5a189a", "Tokyo", true);
      addSession(14, 23, 58, "#c9184a", "London", true);
      addSession(19, 4, 75, "#2b9348", "New York", true);
    }
    /* ========================= Multi session ruler end ========================= */



    function updateSessionHighlight() {
      const now = new Date();
      const t = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

      // NY state
      const nyActive =
        (t >= 19 && t < 24) || (t >= 0 && t < 4);

      document.querySelectorAll(".session-line").forEach(line => {

        let s = line._session.start;
        let e = line._session.end;

        let isNYTop = line._session.isNYTop;
        let isNYBottom = line._session.isNYBottom;

        let active = false;

        // =========================
        // ACTIVE CHECK
        // =========================
        if (line._session.label === "New York") {
          active = nyActive;
        } else {
          if (e > s) {
            active = (t >= s && t < e);
          } else {
            active = (t >= s && t < 24) || (t >= 0 && t < e);
          }
        }

        // =========================
        // GLOW (ALL ACTIVE CAN STACK)
        // =========================
        if (active) {
          line.style.opacity = "1";
          line.style.boxShadow = `0 0 3px ${line.style.backgroundColor}`;
        } else {
          line.style.opacity = "0.25";
          line.style.boxShadow = "none";
        }

        // =========================
        // COUNTDOWN LOGIC
        // =========================
        let cd = line.querySelector(".cd");

        // 🔥 NEW YORK
        if (line._session.isNY) {

          // ❌ TOP PART → NO countdown
          if (!line._session.isNYBottom) {
            if (cd) cd.remove();
            return;
          }

          // ✅ BOTTOM PART ONLY
          if (active) {
            if (!cd) {
              cd = document.createElement("div");
              cd.className = "session-label cd";
              cd.style.right = "4px";
              cd.style.left = "auto";
              line.appendChild(cd);
            }

            cd.innerText = getCountdown(e, t);
          } else {
            if (cd) cd.remove();
          }

          return;
        }


        // =========================
        // OTHER SESSIONS (NORMAL)
        // =========================

        if (active) {
          if (!cd) {
            cd = document.createElement("div");
            cd.className = "session-label cd";
            cd.style.right = "4px";
            cd.style.left = "auto";
            line.appendChild(cd);
          }

          cd.innerText = getCountdown(e, t);
        } else {
          if (cd) cd.remove();
        }

      });
    }
    setInterval(updateSessionHighlight, 1000);

    function updateSessionCountdown() {
      const now = new Date();
      const t = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;

      document.querySelectorAll(".session-line").forEach(line => {
        if (!line._cd) return;

        let end = line._cd.end;
        let diff = end - t;
        if (diff < 0) diff += 24;

        const total = Math.floor(diff * 3600);
        const hh = Math.floor(total / 3600);
        const mm = Math.floor((total % 3600) / 60);
        const ss = total % 60;

        line._cd.el.innerText =
          `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
      });
    }

    function getCountdown(end, t) {
      let diff = end - t;
      if (diff < 0) diff += 24;

      const total = Math.floor(diff * 3600);
      const hh = Math.floor(total / 3600);
      const mm = Math.floor((total % 3600) / 60);
      const ss = total % 60;

      return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    }






    /* CLOCK */
    function updateClockSmooth() {
      const now = new Date();

      const ms = now.getMilliseconds();
      const h = now.getHours();
      const m = now.getMinutes();
      const s = now.getSeconds() + ms / 1000;

      const h12 = h % 12 || 12;
      const ampm = h >= 12 ? "PM" : "AM";

      digitalTime.innerText =
        `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(Math.floor(s)).padStart(2, '0')} ${ampm}`;


      // 6AM base shift
      let base = 6;
      let hourNow = h + m / 60 + s / 3600;
      let dif = hourNow - base;
      if (dif < 0) dif += 24;

      hourPointer.style.left = (dif / 24 * 100) + "%";


      minutePointer.style.left = ((m + s / 60) / 60 * 100) + "%";
      secondPointer.style.left = (s / 60 * 100) + "%";

      let sessionHour = h + m / 60 + s / 3600;

      if (sessionHour >= 18 && sessionHour <= 24) {
        sessionPointer.style.left = ((sessionHour - 18) / 6 * 100) + "%";
      } else {
        sessionPointer.style.left = "-10%";
      }


      /* SESSION DETECTION */





      // multi session pointer
      let fullHour = h + m / 60 + s / 3600;
      multiPointer.style.left = (fullHour / 24 * 100) + "%";
      /* ========================= */

      updateSessionCountdown();
      requestAnimationFrame(updateClockSmooth);

    }



    /* INIT */
    createFundingRuler();
    createHourRuler();
    createMinuteRuler();
    createSecondRuler();
    createSessionRuler();
    createMultiSessionRuler();
    updateClockSmooth();