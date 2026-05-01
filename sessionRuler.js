function createSessionRuler() {
  const r = document.getElementById("sessionRuler");
  if (!r) return;

  r.style.position = "relative";
  r.innerHTML = "";

  // =========================
  // POINTER
  // =========================
  const pointer = document.createElement("div");
  pointer.id = "sessionPointer";
  pointer.style.cssText =
    "position:absolute;top:16px;height:50%;width:2px;background:yellow;z-index:999;box-shadow:0 0 3px yellow;";
  r.appendChild(pointer);

  const startUTC = 12;
  const endUTC = 18;
  const total = endUTC - startUTC;

  // =========================
  // TICKS + LABELS
  // =========================
  for (let utc = startUTC; utc <= endUTC; utc++) {
    const pos = ((utc - startUTC) / total) * 100;

    // TICK
    const tick = document.createElement("div");
    tick.className = "tick";
    tick.style.cssText = `
      position:absolute;
      left:${pos}%;
      width:2px;
      height:12px;
      background:${utc >= 13 && utc <= 17 ? "#00ffb3" : "#555"};
    `;
    r.appendChild(tick);

    // LABEL
    const label = document.createElement("div");
    label.className = "label";

    const offset = -new Date().getTimezoneOffset() / 60;
    const localHour = (utc + offset + 24) % 24;

    const h12 = localHour % 12 || 12;
    const ampm = localHour >= 12 ? "PM" : "AM";

    label.innerText = `${h12}${ampm}`;

    label.style.cssText = `
      position:absolute;
      left:${pos}%;
      top:5px;
      transform:translateX(-50%);
      font-size:9px;
      color:#fff;
    `;

    r.appendChild(label);

    // =========================
    // BOTTOM LABEL
    // =========================
    const bottom = document.createElement("div");
    bottom.style.cssText = `
      position:absolute;
      left:${pos}%;
      top:30px;
      transform:translateX(-50%);
      font-size:9px;
      color:#888;
    `;

    if (utc === 13) {
      bottom.innerText = "N Start";
      bottom.style.color = "#00ffb3";
    } else if (utc === 17) {
      bottom.innerText = "L End";
      bottom.style.color = "#ff3b3b";
    } else {
      bottom.innerText = "";
    }

    r.appendChild(bottom);
  }

  // =========================
  // LIVE POINTER UPDATE
  // =========================
  function update() {
    const now = new Date();

    let t =
      now.getUTCHours() +
      now.getUTCMinutes() / 60 +
      now.getUTCSeconds() / 3600;

    let progress = ((t - startUTC) / total) * 100;

    // clamp inside 0–100
    progress = Math.max(0, Math.min(100, progress));

    pointer.style.left = progress + "%";
    pointer.style.display = "block";

    requestAnimationFrame(update);
  }

  update();
}

createSessionRuler();