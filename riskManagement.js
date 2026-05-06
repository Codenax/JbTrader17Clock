
document.addEventListener("DOMContentLoaded", function () {

  const priceType = document.getElementById("priceType");
  const dynamicLabel = document.getElementById("dynamicLabel");
  const dynamicInput = document.getElementById("dynamicInput");

  function updateLabel() {
    if (priceType.value === "tp") {
      dynamicLabel.innerText = "TAKE PROFIT PRICE";
      dynamicInput.placeholder = "Enter Take Profit Price";

      dynamicLabel.classList.remove("sl-label");
      dynamicLabel.classList.add("tp-label");

    } else {
      dynamicLabel.innerText = "STOP LOSS PRICE";
      dynamicInput.placeholder = "Enter Stop Loss Price";

      dynamicLabel.classList.remove("tp-label");
      dynamicLabel.classList.add("sl-label");
    }
  }

  // run on load
  updateLabel();

  // run on change
  priceType.addEventListener("change", updateLabel);

});

// =========================
// RISK % (1% → 30%)
// =========================
const riskSelect = document.getElementById("riskBalance");

for (let i = 1; i <= 30; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i + "%";

  // default select (recommended 2%)
  if (i === 2) option.selected = true;

  riskSelect.appendChild(option);
}


// =========================
// REWARD RATIO (1:1 → 1:10, step 0.5, PERFECT ORDER)
// =========================
document.addEventListener("DOMContentLoaded", function () {

  const rewardSelect = document.getElementById("rewardRatio");

  // reset আগে (important যদি multiple run হয়)
  rewardSelect.innerHTML = "";

  for (let i = 2; i <= 20; i++) {

    let value = i / 2; // 1, 1.5, 2 ...

    // clean number (no float bug)
    value = Number(value.toFixed(1));

    const option = document.createElement("option");
    option.value = value;

    // show clean label
    option.textContent = "1:" + (value % 1 === 0 ? value : value.toFixed(1));

    // default select
    if (value === 2) option.selected = true;

    rewardSelect.appendChild(option);
  }

});





// =========================
// ALERT SYSTEM
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
// VALIDATION CHECK
// =========================
function validateInputs() {

  const balance = document.getElementById("balance").value;
  const entry = document.getElementById("entry").value;
  const risk = document.getElementById("riskBalance").value;
  const reward = document.getElementById("rewardRatio").value;

  const priceType = document.getElementById("priceType").value;
  const dynamicInput = document.getElementById("dynamicInput").value;

  if (!balance) return "Account Balance is required!";
  if (balance <= 0) return "Balance must be greater than 0";

  if (!entry) return "Entry Price is required!";
  if (entry <= 0) return "Invalid Entry Price";

  if (!risk) return "Select Risk Percentage";
  if (!reward) return "Select Reward Ratio";

  // 🔥 IMPORTANT FIX (SL / TP validation)
  if (!dynamicInput || dynamicInput.trim() === "") {
    if (priceType === "tp") {
      return "Take Profit Price is required!";
    } else {
      return "Stop Loss Price is required!";
    }
  }

  if (dynamicInput <= 0) {
    return priceType === "tp"
      ? "Invalid Take Profit Price!"
      : "Invalid Stop Loss Price!";
  }

  return null;
}


// =========================
// CALCULATE BUTTON
// =========================
document.getElementById("calcBtn").addEventListener("click", function () {

  const error = validateInputs();

  if (error) {
    showAlert(error, "error");
    return;
  }

  showAlert("Calculation Successful", "success");

  // এখানে future calculation logic attach হবে
  console.log("All inputs valid ✔");
});


// =========================
// CLEAR BUTTON
// =========================
document.getElementById("clearBtn").addEventListener("click", function () {

  // text inputs clear
  document.getElementById("balance").value = "";
  document.getElementById("entry").value = "";
  document.getElementById("profit").value = "";

  // dynamic SL/TP field clear (IMPORTANT FIX)
  document.getElementById("dynamicInput").value = "";

  // reset select (optional but pro)
  document.getElementById("riskBalance").selectedIndex = 0;
  document.getElementById("rewardRatio").selectedIndex = 0;
  document.getElementById("priceType").selectedIndex = 1; // SL default

  // reset label
  const label = document.getElementById("dynamicLabel");
  label.innerText = "Stop Loss Price";
  label.classList.remove("tp-label");
  label.classList.add("sl-label");

  // hide alert
  const box = document.getElementById("alertBox");
  box.style.display = "none";

  showAlert("All fields cleared", "success");
});