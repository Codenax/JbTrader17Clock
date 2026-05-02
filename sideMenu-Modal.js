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


/* =========================
   MODAL SYSTEM
========================= */

function openModal(id) {
  document.getElementById(id).classList.add("show");
}

function closeModal(id) {
  document.getElementById(id).classList.remove("show");
}

/* stop modal click bubbling */
document.querySelectorAll(".modal-box").forEach((box) => {
  box.addEventListener("click", function (e) {
    e.stopPropagation();
  });
});

/* outside click closes ONLY modal */
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", function () {
    modal.classList.remove("show");
  });
});


