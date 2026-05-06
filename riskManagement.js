document.addEventListener("DOMContentLoaded", function () {

  // =========================
  // ELEMENTS
  // =========================
  const pair = document.getElementById("pair");
  const riskTitle = document.getElementById("riskTitle");

  const riskSelect = document.getElementById("riskBalance");
  const rewardSelect = document.getElementById("rewardRatio");

  const priceType = document.getElementById("priceType");
  const dynamicLabel = document.getElementById("dynamicLabel");
  const dynamicInput = document.getElementById("dynamicInput");

  const calcBtn = document.getElementById("calcBtn");
  const clearBtn = document.getElementById("clearBtn");


  // =========================
  // RISK TITLE
  // =========================
  function updateRiskTitle() {

    if (!riskTitle || !pair) return;

    if (pair.value === "BTC") {
      riskTitle.innerText = "(BTC)";
      riskTitle.style.color = "#00c3ff";
    } else {
      riskTitle.innerText = "(GOLD)";
      riskTitle.style.color = "#ffd400";
    }
  }


  // =========================
  // RISK DROPDOWN
  // =========================
  if (riskSelect) {
    riskSelect.innerHTML = "";

    for (let i = 1; i <= 30; i++) {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = i + "%";
      if (i === 2) opt.selected = true;
      riskSelect.appendChild(opt);
    }
  }


  // =========================
  // REWARD DROPDOWN
  // =========================
  if (rewardSelect) {
    rewardSelect.innerHTML = "";

    for (let i = 2; i <= 20; i++) {
      let v = (i / 2).toFixed(1);
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = "1:" + v;
      if (v == 2) opt.selected = true;
      rewardSelect.appendChild(opt);
    }
  }


  // =========================
  // PRICE TYPE LABEL
  // =========================
  function updateLabel() {

    if (!priceType) return;

    if (priceType.value === "tp") {
      dynamicLabel.innerText = "TAKE PROFIT PRICE";
      dynamicInput.placeholder = "Enter Take Profit Price";
    } else {
      dynamicLabel.innerText = "STOP LOSS PRICE";
      dynamicInput.placeholder = "Enter Stop Loss Price";
    }
  }


  // =========================
  // ALERT (SAFE)
  // =========================
function showAlert(message, type = "error") {
  const box = document.getElementById("alertBox");

  box.style.display = "block";
  box.innerText = message;

  box.classList.remove("error", "success");
  box.classList.add(type);

  setTimeout(() => {
    box.style.display = "none";
  }, 3000);
}


  // =========================
  // VALIDATION
  // =========================
  function validateInputs() {

    const balance = document.getElementById("balance")?.value;
    const entry = document.getElementById("entry")?.value;
    const risk = riskSelect?.value;
    const reward = rewardSelect?.value;
    const dynamic = dynamicInput?.value;

    if (!balance || balance <= 0) return "Account Balance is required!";
    if (!entry || entry <= 0) return "Entry Price is required!";
    if (!risk) return "Select Risk";
    if (!reward) return "Select Reward";

    if (!dynamic || dynamic.trim() === "") {
      return priceType.value === "tp"
        ? "Take Profit Required!"
        : "Stop Loss Required!";
    }

    return null;
  }


  // =========================
  // EVENTS
  // =========================

  if (pair) {
    updateRiskTitle();
    pair.addEventListener("change", updateRiskTitle);
  }

  if (priceType) {
    updateLabel();
    priceType.addEventListener("change", updateLabel);
  }

  if (calcBtn) {
    calcBtn.addEventListener("click", function () {

      const err = validateInputs();

      if (err) {
        showAlert(err, "error");
        return;
      }

      showAlert("Calculation Successful", "success");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {

      document.getElementById("balance").value = "";
      document.getElementById("entry").value = "";
      document.getElementById("dynamicInput").value = "";

      riskSelect.selectedIndex = 0;
      rewardSelect.selectedIndex = 0;

      showAlert("Cleared", "success");
    });
  }

});


