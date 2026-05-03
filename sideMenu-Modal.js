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
const donationData = {
  bkash: "01XXXXXXXX1",
  nagad: "01XXXXXXXX2",
  rocket: "01XXXXXXXX3",
  crypto: "0xa2931e62f7715603938c45a377f1b70afa8b4438"
};


function copyText(el, type, event) {
  navigator.clipboard.writeText(donationData[type]);

  // change icon to tick
  el.textContent = "✔";

  setTimeout(() => {
    el.textContent = "⧉";
  }, 1500);

  // show near cursor
  showCursorToast(event.pageX, event.pageY);
}

function showCursorToast(x, y) {
  const toast = document.getElementById("cursorToast");

  toast.style.left = x + "px";
  toast.style.top = y + "px";

  toast.classList.add("show");

  setTimeout(() => {
    toast.classList.remove("show");
  }, 1000);
}
/*support end*/