/* =========================
   SIDE MENU
========================= */

function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("open");
}

/* ❗ OUTSIDE CLICK → ONLY SIDE MENU CLOSE (MODAL SAFE) */
document.addEventListener("click", function (e) {
  const menu = document.getElementById("sideMenu");

  const clickedMenu = menu.contains(e.target);
  const clickedMenuBtn = e.target.classList.contains("menu-btn");
  const clickedModal = e.target.closest(".modal");

  // ❗ ignore modal clicks completely
  if (clickedModal) return;

  // close only if not menu and not button
  if (!clickedMenu && !clickedMenuBtn) {
    menu.classList.remove("open");
  }
});


/* =========================
   TOGGLES (RULERS)
========================= */

window.addEventListener("DOMContentLoaded", () => {
  ["fundingToggle", "nylondonToggle", "market24Toggle"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.dispatchEvent(new Event("change"));
  });
});

document.getElementById("fundingToggle")?.addEventListener("change", (e) => {
  const el = document.getElementById("jbFundingRullar");
  if (el) el.style.display = e.target.checked ? "block" : "none";
});

document.getElementById("nylondonToggle")?.addEventListener("change", (e) => {
  const el = document.getElementById("jbNyLondonRullar");
  if (el) el.style.display = e.target.checked ? "block" : "none";
});

document.getElementById("market24Toggle")?.addEventListener("change", (e) => {
  const el = document.getElementById("jb24hMarketRullar");
  if (el) el.style.display = e.target.checked ? "block" : "none";
});



function toggleRightMenu() {
  const menu = document.getElementById("rightMenu");
  const backdrop = document.getElementById("appBackdrop");

  menu.classList.toggle("open");

  if (menu.classList.contains("open")) {
    backdrop.classList.add("active");
  } else {
    // only close if no modal open
    const anyModal = document.querySelector(".modal.show");
    if (!anyModal) backdrop.classList.remove("active");
  }
}
/* =========================
   MODAL SYSTEM
========================= */

/* =========================
   MODAL + BACKDROP SYSTEM
========================= */

const backdrop = document.getElementById("appBackdrop");

/* OPEN MODAL */
function openModal(id) {
  const modal = document.getElementById(id);

  modal.classList.add("show");
  if (backdrop) backdrop.classList.add("active");
}

/* CLOSE MODAL */
function closeModal(id) {
  const modal = document.getElementById(id);

  modal.classList.remove("show");

  // check if any modal still open
  const anyOpen = document.querySelector(".modal.show");

  if (!anyOpen && backdrop) {
    backdrop.classList.remove("active");
  }
}

/* OUTSIDE CLICK CLOSE */
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", () => {
    modal.classList.remove("show");

    const anyOpen = document.querySelector(".modal.show");
    if (!anyOpen && backdrop) {
      backdrop.classList.remove("active");
    }
  });
});

/* STOP MODAL INNER CLICK */
document.querySelectorAll(".modal-box").forEach((box) => {
  box.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});


/*copyright 2024 JbTrader17. All rights reserved. Unauthorized reproduction, distribution, modification, reverse engineering, or use of this software without explicit permission is strictly prohibited.*/
document.querySelectorAll(".year").forEach(el => {
  el.textContent = new Date().getFullYear();
});

/* copyright end */


/*support start*/
/* =========================
   DONATION + CONTACT DATA
========================= */



/* =========================
   CURSOR TOAST
========================= */



/* =========================
   OPTIONAL AUTO SET TEXT
========================= */
window.addEventListener("DOMContentLoaded", () => {
  const wa = document.getElementById("waText");
  if (wa) wa.innerText = donationData.whatsapp;
});
/*support end*/


/*download page start*/
/*download page start*/
const downloadBtn = document.getElementById("jbDownload-btn");
downloadBtn.addEventListener("click", openDownload);

async function openDownload(e) {
  if (e) e.preventDefault();

  const url = downloadBtn.href;

  // ✅ Open download INSTANTLY, don't wait for geo
  window.open(url, "_blank");

  // ✅ Track in background (user won't notice)
  trackDownload().catch(err => console.log("Track error:", err));
}

async function trackDownload() {
  const downloadId =
    "J17-" +
    Math.random().toString(36).substring(2, 8) +
    "-" +
    Date.now();

  const deviceInfo = getDeviceInfo();
  const geo = await getGeoData();

  const params = new URLSearchParams({
    downloadId,
    app: "JbTrader17",
    device: deviceInfo,
    ip: geo.ip,
    country: geo.country,
    city: geo.city,
    isp: geo.isp
  });

  await fetch(
    "https://script.google.com/macros/s/AKfycby6sb8zXj7HMWVahj8OGFOs69lI9oVzhgpY0N-wu49h1hVS9xCocX_woJbr6bU6Sd1M/exec?" + params.toString(),
    {
      method: "GET",
      mode: "no-cors"
    }
  );
}


/* =========================
   🌍 GEO DATA
========================= */

async function getGeoData() {
  try {
    const res = await fetch("http://ip-api.com/json/");
    const data = await res.json();

    return {
      ip:      data.query   || "unknown",
      country: data.country || "unknown",
      city:    data.city    || "unknown",
      isp:     data.isp     || "unknown"
    };

  } catch (e) {
    console.log("Geo error:", e);
    return {
      ip:      "unknown",
      country: "unknown",
      city:    "unknown",
      isp:     "unknown"
    };
  }
}


/* =========================
   💻 DEVICE INFO
========================= */

function getDeviceInfo() {
  const ua = navigator.userAgent;

  let browser = "Unknown";
  if (ua.includes("Edg"))                              browser = "Edge";
  else if (ua.includes("Chrome"))                      browser = "Chrome";
  else if (ua.includes("Firefox"))                     browser = "Firefox";
  else if (ua.includes("Safari") && !ua.includes("Chrome")) browser = "Safari";

  let os = "Unknown";
  if (ua.includes("Windows"))                          os = "Windows";
  else if (ua.includes("Android"))                     os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Mac"))                         os = "Mac";
  else if (ua.includes("Linux"))                       os = "Linux";

  return os + " / " + browser;
}
/*download page end*/



/*download page end*/

/*facebook group start*/
function copyWhatsApp() {
  const text = document.getElementById("waNumber").innerText;
  navigator.clipboard.writeText(text);
  alert("WhatsApp number copied!");
}

let shell;

try {
  shell = require("electron").shell;
} catch (e) {
  shell = null;
}

function openFacebook() {
  const url = "https://web.facebook.com/profile.php?id=61583165673209";

  if (shell) {
    shell.openExternal(url);   // Electron
  } else {
    window.open(url, "_blank"); // Browser fallback
  }
}
/*facebook group end*/


/*live status animetion start*/
const statusList = [
  {
    text: "All calculation results are estimated",
    color: "#F87171"
  },
  {
    text: "Live price works only for crypto (BTC, ETH)",
    color: "#4ADE80"
  },
  {
    text: "All calculations based on CFDs (Like Exness)",
    color: "#f6da53"
  }
];

let i = 0;
const el = document.getElementById("statusText");

function rotateStatus() {

  // fade + blur out
  el.classList.add("hide");

  setTimeout(() => {

    // change content while hidden
    i = (i + 1) % statusList.length;

    el.textContent = statusList[i].text;
    el.style.color = statusList[i].color;

    // force reflow (ensures smooth animation restart)
    void el.offsetWidth;

    // fade + blur in
    el.classList.remove("hide");

  }, 600); // must match CSS transition
}

// initial state
el.textContent = statusList[0].text;
el.style.color = statusList[0].color;

// loop
setInterval(rotateStatus, 6000);

/*live status animetion end*/