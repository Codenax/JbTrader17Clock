/* SIDE MENU TOGGLE & Modal js */

function toggleMenu() {
  document.getElementById("sideMenu").classList.toggle("open");
}

document.addEventListener("click", function (e) {
  const menu = document.getElementById("sideMenu");
  if (!menu.contains(e.target) && !e.target.classList.contains("menu-btn")) {
    menu.classList.remove("open");
  }
});

document.addEventListener("click", function (e) {
  const menu = document.getElementById("sideMenu");
  const button = document.querySelector(".menu-btn");

  const clickedInsideMenu = menu.contains(e.target);
  const clickedButton = button && button.contains(e.target);

  if (!clickedInsideMenu && !clickedButton) {
    menu.classList.remove("open");
  }
});


window.addEventListener("DOMContentLoaded", () => {
  document.getElementById("fundingToggle").dispatchEvent(new Event("change"));
  document.getElementById("nylondonToggle").dispatchEvent(new Event("change"));
  document.getElementById("market24Toggle").dispatchEvent(new Event("change"));
});

document.getElementById("fundingToggle").addEventListener("change", (e) => {
  const el = document.getElementById("jbFundingRullar");
  if (el) el.style.display = e.target.checked ? "block" : "none";
});

document.getElementById("nylondonToggle").addEventListener("change", (e) => {
  const el = document.getElementById("jbNyLondonRullar");
  if (el) el.style.display = e.target.checked ? "block" : "none";
});

document.getElementById("market24Toggle").addEventListener("change", (e) => {
  const el = document.getElementById("jb24hMarketRullar");
  if (el) el.style.display = e.target.checked ? "block" : "none";
});





/*daynight toggle*/

/*daynight toggle end*/



