// =========================
// 🔥 GLOBAL FUNCTIONS (FIX)
// =========================
function smartFormat(value, decimals = 5) {
  if (value === null || value === undefined || isNaN(value)) return "0";

  let num = parseFloat(value);

  let fixed = num.toFixed(decimals);

  fixed = fixed.replace(/\.?0+$/, "");

  return fixed;
}


const tradeType = document.getElementById("tradeType");

function updateTradeSelectColor() {

  if (!tradeType) return;

  tradeType.classList.remove("buy-mode", "sell-mode");

  if (tradeType.value === "buy") {
    tradeType.classList.add("buy-mode");
  } else {
    tradeType.classList.add("sell-mode");
  }
}

let isBuy = true;

function showAlert(message, type = "error") {
  const box = document.getElementById("alertBox");
  if (!box) return;

  box.style.display = "block";
  box.innerText = message;

  box.classList.remove("error", "success");
  box.classList.add(type);

  setTimeout(() => {
    box.style.display = "none";
  }, 3000);
}

function validateInputs() {

  const balance = document.getElementById("balance")?.value;
  const entry = document.getElementById("entry")?.value;
  const risk = document.getElementById("riskBalance")?.value;
  const reward = document.getElementById("rewardRatio")?.value;
  const dynamic = document.getElementById("dynamicInput")?.value;
  const priceType = document.getElementById("priceType")?.value;

  if (!balance || balance <= 0) return "Account Balance is required!";
  if (!entry || entry <= 0) return "Entry Price is required!";
  if (!risk) return "Select Risk";
  if (!reward) return "Select Reward";

  if (!dynamic || dynamic.trim() === "") {
    return priceType === "tp"
      ? "Take Profit Required!"
      : "Stop Loss Required!";
  }

  const entryNum = parseFloat(entry);
const dynamicNum = parseFloat(dynamic);

const tradeType = document.getElementById("tradeType")?.value || "buy";

// =========================
// BUY VALIDATION
// =========================
if (tradeType === "buy") {

  // BUY + SL
  if (priceType === "sl" && dynamicNum >= entryNum) {
    return "Buy SL must be below Entry Price!";
  }

  // BUY + TP
  if (priceType === "tp" && dynamicNum <= entryNum) {
    return "Buy TP must be above Entry Price!";
  }

}

if (tradeType === "sell") {

  // SELL + SL
  if (priceType === "sl" && dynamicNum <= entryNum) {
    return "Sell SL must be above Entry Price!";
  }

  // SELL + TP
  if (priceType === "tp" && dynamicNum >= entryNum) {
    return "Sell TP must be below Entry Price!";
  }

}

  return null;
}


// =========================
// MAIN DOM READY
// =========================
document.addEventListener("DOMContentLoaded", function () {

  const pair = document.getElementById("pair");
  const riskTitle = document.getElementById("riskTitle");

  const riskSelect = document.getElementById("riskBalance");
  const rewardSelect = document.getElementById("rewardRatio");

  const priceType = document.getElementById("priceType");
  const dynamicLabel = document.getElementById("dynamicLabel");
  const dynamicInput = document.getElementById("dynamicInput");

  const calcBtn = document.getElementById("calcBtn");
  const clearBtn = document.getElementById("clearBtn");

/*Buy/sell dropdown logic (NEW)*/
const tradeType = document.getElementById("tradeType");

  if (tradeType) {
    isBuy = tradeType.value === "buy";

    tradeType.addEventListener("change", function () {
      isBuy = this.value === "buy";
    });
  }
  /*End of buy/sell dropdown logic*/

if (tradeType) {

    updateTradeSelectColor(); // first load

    tradeType.addEventListener("change", updateTradeSelectColor);

  }


  // =========================
  // RISK TITLE
  // =========================
function updateRiskTitle() {

  if (!riskTitle || !pair) return;

  if (pair.value === "BTC" || pair.value === "ETH") {
    riskTitle.innerText = "(" + pair.value + ")";
    riskTitle.style.color = "#00c3ff";
  }

  else if (pair.value === "XAG") {
    riskTitle.innerText = "(XAG)";
    riskTitle.style.color = "#c0c0c0";
  }
    else if (pair.value === "XCU") {
    riskTitle.innerText = "(XCU)";
    riskTitle.style.color = "#ff7b00";
  }
    else if (pair.value === "USOIL") {
    riskTitle.innerText = "(USOIL)";
    riskTitle.style.color = "#ff7b00";
  }  
  // =========================
  // EURUSD (FOREX)
  // =========================
  else if (pair.value === "EURUSD") {

    riskTitle.innerText = "(EUR/USD)";
    riskTitle.style.color = "#00ffb3";
  }
  else if (pair.value === "GBPUSD") {
  riskTitle.innerText = "(GBP/USD)";
  riskTitle.style.color = "#00ffb3";
}
else if (pair.value === "AUDUSD") {
  riskTitle.innerText = "(AUD/USD)";
  riskTitle.style.color = "#00ffb3";
}
else if (pair.value === "USDJPY") {
  riskTitle.innerText = "(USD/JPY)";
  riskTitle.style.color = "#ed54f8";
}

  else {
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
     let v = (i / 2);

// format like 2 decimals max but remove trailing zeros
v = parseFloat(v.toFixed(2));

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

  // =========================
  // CALCULATE BUTTON (FIXED)
  // =========================
  if (calcBtn) {
    calcBtn.addEventListener("click", function () {

      const err = validateInputs();

      if (err) {
        showAlert(err, "error");
        return;
      }

      calculate();          // existing function
     // trade info update
      calculateSLTPFromTradeInfo(); 
       syncTradeInfo();   
      updateTradeResult();  
      // trade result update

      showAlert("Calculation Successful", "success");
    });
  }


  // =========================
  // CLEAR BUTTON
  // =========================
  function clearTradeInfo() {

  document.getElementById("sumBalance").innerText = "0 $";
  document.getElementById("entry2Show").innerText = "0";
  document.getElementById("sumRisk").innerText = "0 %";
  document.getElementById("sumRiskAmount").innerText = "0 $";
  document.getElementById("sumRewardRatio").innerText = "1:0";
}
function clearTradeResult() {

  document.getElementById("sumLot").innerText = "0";
  document.getElementById("sumRewardUSD").innerText = "0 $";
  document.getElementById("sumRewardPips").innerText = "0";
   document.getElementById("profit").value = "";
   document.getElementById("sumRewardPercent").innerText = "0 %";
  document.getElementById("sumTP").innerText = "0";
  document.getElementById("sumSL").innerText = "0";
  document.getElementById("sumBreakeven").innerText = "0";
}

  if (clearBtn) {
    clearBtn.addEventListener("click", function () {

      document.getElementById("balance").value = "";
      document.getElementById("entry").value = "";
      document.getElementById("dynamicInput").value = "";

      riskSelect.selectedIndex = 0;
      rewardSelect.selectedIndex = 0;
 clearTradeInfo();
 clearTradeResult();
      showAlert("Cleared", "success");
    });
  }




});

/*Trade results update function*/
function calculateSLTPFromTradeInfo() {

  const balance = parseFloat(document.getElementById("balance").value) || 0;
  const entry = parseFloat(document.getElementById("entry").value) || 0;

  const riskPercent = parseFloat(document.getElementById("riskBalance").value) || 0;
  const rewardRatio = parseFloat(document.getElementById("rewardRatio").value) || 1;

  const priceType = document.getElementById("priceType").value;
  const userInput = parseFloat(document.getElementById("dynamicInput").value) || 0;

  // ✅ LOT FROM SELECT
  const lotSize = parseFloat(document.getElementById("lot").value) || 0;

  // ✅ NEW: TRADE TYPE
  const tradeType = document.getElementById("tradeType")?.value || "buy";
  const isBuy = tradeType === "buy";

  let SL = 0;
  let TP = 0;

  const riskAmount = (balance * riskPercent) / 100;

  // =========================
  // CASE 1: USER GIVES SL
  // =========================
  if (priceType === "sl") {

    SL = userInput;

    const stopDistance = Math.abs(entry - SL);
    const rewardDistance = stopDistance * rewardRatio;

    if (isBuy) {
      TP = entry + rewardDistance;
    } else {
      TP = entry - rewardDistance;
    }
  }

  // =========================
  // CASE 2: USER GIVES TP
  // =========================
  else if (priceType === "tp") {

    TP = userInput;

    const rewardDistance = Math.abs(TP - entry);
    const stopDistance = rewardDistance / rewardRatio;

    if (isBuy) {
      SL = entry - stopDistance;
    } else {
      SL = entry + stopDistance;
    }
  }

  // =========================
  // OUTPUT
  // =========================
  document.getElementById("sumLot").innerText = lotSize.toFixed(2);
document.getElementById("sumTP").innerText = smartFormat(TP);
document.getElementById("sumSL").innerText = smartFormat(SL);
document.getElementById("entry2Show").innerText = smartFormat(entry,5);
}


function updateTradeResult() {

  const pair = document.getElementById("pair");

const lotSizeText = document.getElementById("sumLot")?.innerText;
const lotSize = parseFloat(lotSizeText) || 0;
  const tp = parseFloat(document.getElementById("sumTP").innerText) || 0;
  const sl = parseFloat(document.getElementById("sumSL").innerText) || 0;
  const entry = parseFloat(document.getElementById("entry").value) || 0;

  const rewardRatio = parseFloat(document.getElementById("rewardRatio").value) || 0;
  const riskPercent = parseFloat(document.getElementById("riskBalance").value) || 0;
  const balance = parseFloat(document.getElementById("balance").value) || 0;

  const commission = parseFloat(document.getElementById("commission").innerText) || 0;
  const spread = parseFloat(document.getElementById("btcValue").innerText) || 0;

  // ======================
  // RISK / REWARD USD
  // ======================
  const riskAmount = (balance * riskPercent) / 100;
  const rewardUSD = riskAmount * rewardRatio;
 // ======================
  // 🔥 REWARD % OF BALANCE (NEW)
  // ======================
  let rewardPercent = 0;

  if (balance > 0) {
    rewardPercent = (rewardUSD / balance) * 100;
  }
  // ======================
  // REAL PIP CALC
  // ======================
  let rewardPips = 0;

if (pair.value === "BTC" || pair.value === "ETH") {
  rewardPips = (rewardUSD * 10) / (lotSize || 1);
}

  else if (pair.value === "Gold") {
    rewardPips = rewardUSD / (lotSize || 1);
  }
  // =========================
// XAG (SILVER)
// =========================
else if (pair.value === "XAG") {

  const pipValuePerLot = 50; // 1 lot = $50 per pip

  rewardPips = rewardUSD / (pipValuePerLot * (lotSize || 1));
}
// =========================
// XCU (Coper)
// =========================
else if (pair.value === "XCU") {

  const pipValuePerLot = 0.1;

  rewardPips = rewardUSD / (pipValuePerLot * (lotSize || 1));
}
else if (pair.value === "USOIL") {

  const pipValuePerLot = 1000; 
  // because 1 lot = $1000 per 100 pips scale (0.01 = $10 per 100 pips)

  rewardPips = rewardUSD / ((pipValuePerLot / 100) * (lotSize || 1));
}

else if (pair.value === "EURUSD") {

  const pipValuePerLot = 10;

  rewardPips = rewardUSD / (pipValuePerLot * (lotSize || 1));
}
else if (pair.value === "GBPUSD") {

  // GBPUSD:
  // 1 lot = $10 per pip
  // same structure as EURUSD

  const pipValuePerLot = 10;

  rewardPips = rewardUSD / (pipValuePerLot * (lotSize || 1));
}
else if (pair.value === "AUDUSD") {

  // AUDUSD:
  // 1 lot = $10 per pip
  // same as EURUSD / GBPUSD system

  const pipValuePerLot = 10;

  rewardPips = rewardUSD / (pipValuePerLot * (lotSize || 1));
}
else if (pair.value === "USDJPY") {

  // =========================
  // USDJPY FIXED PIP MODEL
  // =========================

  const priceMove = Math.abs(tp - entry);

  // 🔥 FIXED: 1 pip = 0.01 (JPY standard)
  const pipSize = 0.01;

  rewardPips = priceMove / pipSize;
}
  // ======================
  // BREAKEVEN (FEE INCLUDED)
  // ======================
  // ======================
// BREAKEVEN (UPDATED)
// ======================

let breakeven = 0;

// ======================
// FOREX (REAL PRICE MOVE)
// ======================
if (
  pair.value === "EURUSD" ||
  pair.value === "GBPUSD" ||
  pair.value === "AUDUSD"
) {

  // NON-JPY PAIRS
  const pipValuePerLot = 10;

  const pipMove = commission / (pipValuePerLot * (lotSize || 1));
  const priceMove = pipMove * 0.0001;

  if (isBuy) breakeven = entry + priceMove;
  else breakeven = entry - priceMove;
}


// ======================
// USDJPY (SPECIAL CASE)
// ======================
else if (pair.value === "USDJPY") {

  // 1 pip = 0.01 (IMPORTANT)
  const pipValuePerLot = 10;

  const pipMove = commission / (pipValuePerLot * (lotSize || 1));

  const priceMove = pipMove * 0.01;

  if (isBuy) breakeven = entry + priceMove;
  else breakeven = entry - priceMove;
}

// ======================
// OTHER ASSETS (OLD LOGIC)
// ======================
else {

  const totalCommission = commission;

  if (isBuy) {
    breakeven = entry + totalCommission;
  } else {
    breakeven = entry - totalCommission;
  }
}
  // ======================
  // OUTPUT UI
  // ======================
  document.getElementById("sumLot").innerText = smartFormat(lotSize, 2);

document.getElementById("sumRewardUSD").innerText =
  smartFormat(rewardUSD, 2) + " $";

 document.getElementById("sumRewardPips").innerText =
  smartFormat(rewardPips, 2);

document.getElementById("sumRewardPercent").innerText =
  smartFormat(rewardPercent, 2) + " %";

document.getElementById("sumTP").innerText = smartFormat(tp);
document.getElementById("sumSL").innerText = smartFormat(sl);

 document.getElementById("sumBreakeven").innerText =
  smartFormat(breakeven);
}

/*trade info update function end*/
// =========================
// 🔒 INPUT SECURITY (NO - / TEXT)
// =========================
document.addEventListener("DOMContentLoaded", function () {

  const fields = [
    document.getElementById("balance"),
    document.getElementById("entry"),
    document.getElementById("dynamicInput"),
    document.getElementById("profit")
  ];

  fields.forEach(input => {

    if (!input) return;

    // ✅ typing control
    input.addEventListener("input", function () {

      let val = this.value;

      // remove minus
      val = val.replace(/-/g, "");

      // allow only number + dot
      val = val.replace(/[^0-9.]/g, "");

      // prevent multiple dots
      val = val.replace(/(\..*)\./g, "$1");

      this.value = val;
    });

    // ✅ paste FIX (IMPORTANT)
    input.addEventListener("paste", function (e) {

      e.preventDefault(); // stop raw paste

      let paste = (e.clipboardData || window.clipboardData).getData("text");

      // clean pasted value
      paste = paste.replace(/-/g, "");
      paste = paste.replace(/[^0-9.]/g, "");
      paste = paste.replace(/(\..*)\./g, "$1");

      // insert cleaned value
      document.execCommand("insertText", false, paste);
    });

  });

});


// =========================
// 📊 TRADE INFO UPDATE
// =========================
function updateTradeInfo() {

  const bal = parseFloat(document.getElementById("balance")?.value) || 0;
  const en = parseFloat(document.getElementById("entry")?.value) || 0;

  const riskPercent = parseFloat(document.getElementById("riskBalance")?.value) || 0;
  const rewardRatio = document.getElementById("rewardRatio")?.value || 0;

  const riskAmount = (bal * riskPercent) / 100;

  document.getElementById("sumBalance").innerText = bal.toFixed(2) + " $";
 document.getElementById("entry2Show").innerText = smartFormat(en, 5);
  document.getElementById("sumRisk").innerText = riskPercent + " %";
  document.getElementById("sumRiskAmount").innerText = riskAmount.toFixed(2) + " $";
  document.getElementById("sumRewardRatio").innerText = "1:" + rewardRatio;
}

function syncTradeInfo() {

  const bal = parseFloat(document.getElementById("balance")?.value) || 0;
  const riskPercent = parseFloat(document.getElementById("riskBalance")?.value) || 0;
  const rewardRatio = document.getElementById("rewardRatio")?.value || 0;
  const entry = parseFloat(document.getElementById("entry")?.value) || 0;

  const riskAmount = (bal * riskPercent) / 100;

  document.getElementById("sumBalance").innerText = bal.toFixed(2) + " $";
  document.getElementById("sumRisk").innerText = riskPercent + " %";
  document.getElementById("sumRiskAmount").innerText = riskAmount.toFixed(2) + " $";
  document.getElementById("sumRewardRatio").innerText = "1:" + rewardRatio;

 document.getElementById("entry2Show").innerText = smartFormat(entry, 5);
}