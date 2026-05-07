function formatPrice(num) {

  let n = parseFloat(num);

  if (isNaN(n)) return "0";

  // max 5 decimal + remove trailing zeros
  return parseFloat(n.toFixed(5)).toString();
}

const select = document.getElementById("pair");

select.addEventListener("change", function () {
  if (this.value === "Gold") {
    select.classList.add("gold-mode");
  } else {
    select.classList.remove("gold-mode");
  }
});

// ===== LOT GENERATION =====
const lotSelect = document.getElementById("lot");

for (let i = 1; i <= 1000; i++) {
  let val = (i / 100).toFixed(2);
  let opt = document.createElement("option");
  opt.value = val;
  opt.textContent = val;
  lotSelect.appendChild(opt);
}

// ===== INPUTS =====
const pair = document.getElementById("pair");
const balance = document.getElementById("balance");
const entry = document.getElementById("entry");

const profitInput = document.getElementById("profit");
const profitType = document.getElementById("profitType");

const lot = document.getElementById("lot");
const account = document.getElementById("account");

// ===== OUTPUTS =====
const tp = document.getElementById("tp");
const sl = document.getElementById("sl");
const tpd = document.getElementById("tpd");
const sld = document.getElementById("sld");
const commissionLabel = document.getElementById("commission");

const tpSell = document.getElementById("tpSell");
const slSell = document.getElementById("slSell");

const btcValueLabel = document.getElementById("btcValue");
const tpAfterFee = document.getElementById("tpAfterFee");
const slAfterFee = document.getElementById("slAfterFee");

// ======================
// 🔥 PROFIT CONVERTER
// ======================
function convertProfitToUSD(prof, type, balance, entry, lotSize) {

  let usdProfit = 0;

  // ======================
  // 1. USD
  // ======================
  if (type === "usd") {
    usdProfit = prof;
  }

  // ======================
  // 2. PERCENT
  // ======================
  else if (type === "percent") {
    usdProfit = (balance * prof) / 100;
  }

  // ======================
  // 3. PIPS (UPDATED 🔥)
  // ======================
  else if (type === "pips") {

    let pipValue = 0;

    // 🔥 YOUR BASE RULE
    if (pair.value === "BTC") {
      pipValue = 0.1;   // 1 lot → 10 pips = $1
    }
    else if (pair.value === "ETH") {
  pipValue = 0.1;
}

    else if (pair.value === "Gold") {
      pipValue = 1;     // 1 lot → 1 pip = $1
    }
    // ===== XAG =====
else if (pair.value === "XAG") {
  pipValue = 50; // 0.01 lot → 100 pips = $50
}
  // ===== USOIL =====
  else if (pair.value === "USOIL") {
    pipValue = 10;
  }

    else {
      pipValue = 1; // fallback
    }

    usdProfit = prof * pipValue * lotSize;
  }

  return usdProfit;
}

// ===== COMMISSION =====
function getBaseCommission() {
  let acc = account.value;
  let pr = pair.value;

  if (pr === "Gold") {
    if (acc === "Raw Spread") return 7;
    if (acc === "Zero") return 11;
    return 0;
  }

    // ===== XAG =====
  if (pr === "XAG") {
    if (acc === "Raw Spread") return 7.00;
    if (acc === "Zero") return 95.00;
    return 0;
  }

  if (pr === "BTC") {
    if (acc === "Raw Spread") return 4;
    if (acc === "Zero") return 16;
    return 0;
  }

 if (pr === "ETH") {
    if (acc === "Raw Spread") return 0.50;
    if (acc === "Zero") return 1.00;
    return 0;
  }
// ===== USOIL =====
if (pr === "USOIL") {
  if (acc === "Raw Spread") return 7.00;
  if (acc === "Zero") return 12.5;
  return 0;
}

  return 0;
}

// ===== MAIN ENGINE =====
function calculate() {

  let bal = parseFloat(balance.value) || 0;
  let en = parseFloat(entry.value) || 0;
  let lotSize = parseFloat(lot.value) || 0;
if (!en || en <= 0) {

  // RESULT
  tp.innerText = "0";
  sl.innerText = "0";
  tpSell.innerText = "0";
  slSell.innerText = "0";

  // DISTANCE
  tpd.innerText = "0";
  sld.innerText = "0";

  // FEE
  commissionLabel.innerText = "0";
  btcValueLabel.innerText = "0";

  // AFTER SPREAD
  tpAfterFee.innerText = "0";
  slAfterFee.innerText = "0";

  // ENTRY SHOW
  document.getElementById("entryShow").innerText = "0";

  return; // ⛔ stop calculation
}
  // 🔥 UPDATED PROFIT SYSTEM
  let profRaw = parseFloat(profitInput.value) || 0;
  let type = profitType.value;
  let prof = convertProfitToUSD(profRaw, type, bal, en, lotSize);

  let spreadFee = 0;

  // ======================
  // SPREAD FEE
  // ======================

  if (pair.value === "BTC") {

    let acc = account.value;

    if (acc === "Standard") spreadFee = 14;
    else if (acc === "Pro") spreadFee = 9.6;
    else if (acc === "Raw Spread") spreadFee = 8;
    else if (acc === "Zero") spreadFee = 0;

    btcValueLabel.innerText = spreadFee;
  }
  // ===== ETH =====
  else if (pair.value === "ETH") {

  let acc = account.value;

  if (acc === "Standard") spreadFee = 1.40;
  else if (acc === "Pro") spreadFee = 0.98;
  else if (acc === "Raw Spread") spreadFee = 0.33;
  else if (acc === "Zero") spreadFee = 0;

  btcValueLabel.innerText = spreadFee;
}
// ===== GOLD =====
  else if (pair.value === "Gold") {

    let acc = account.value;

    if (acc === "Standard") spreadFee = 0.32;
    else if (acc === "Pro") spreadFee = 0.22;
    else if (acc === "Raw Spread") spreadFee = 0.05;
    else if (acc === "Zero") spreadFee = 0;

    btcValueLabel.innerText = spreadFee;
  }
// ===== XAG =====
else if (pair.value === "XAG") {

  let acc = account.value;

  if (acc === "Standard") spreadFee = 0.033;
  else if (acc === "Pro") spreadFee = 0.023;
  else if (acc === "Raw Spread") spreadFee = 0.019;
  else if (acc === "Zero") spreadFee = 0;

  btcValueLabel.innerText = spreadFee;
}
// ===== USOIL =====
else if (pair.value === "USOIL") {

  let acc = account.value;

  if (acc === "Standard") spreadFee = 0.02;
  else if (acc === "Pro") spreadFee = 0.014;
  else if (acc === "Raw Spread") spreadFee = 0.005;
  else if (acc === "Zero") spreadFee = 0;

  btcValueLabel.innerText = spreadFee;
}
  else {
    btcValueLabel.innerText = "-";
    spreadFee = 0;
  }

  if (lotSize === 0) return;

  // ======================
  // COMMISSION
  // ======================
  let baseCommission = getBaseCommission();
  let commission = baseCommission * lotSize * 2;
 commissionLabel.innerText = formatPrice(commission);

  let takeProfit = 0;
  let stopOut = 0;

  // ======================
  // GOLD
  // ======================
// ======================
// GOLD + XAG
// ======================
if (pair.value === "Gold" || pair.value === "XAG" || pair.value === "USOIL") {

  let contractSize =
  pair.value === "XAG" ? 5000 :
  pair.value === "USOIL" ? 1000 :
  100;

  takeProfit = en + (prof / (contractSize * lotSize));
  stopOut = en - (bal / (contractSize * lotSize));
}

  // ======================
  // BTC & ETH
  // ======================
else if (pair.value === "BTC" || pair.value === "ETH") {

  let priceMove = bal / lotSize;

  takeProfit = en + (prof / lotSize);
  stopOut = en - priceMove;
}

  // SELL
  let takeProfitSell = 0;
  let stopOutSell = 0;

  if (pair.value === "Gold" || pair.value === "XAG" || pair.value === "USOIL") {

   let contractSize =
  pair.value === "XAG" ? 5000 :
  pair.value === "USOIL" ? 1000 :
  100;

    takeProfitSell = en - (prof / (contractSize * lotSize));
    stopOutSell = en + (bal / (contractSize * lotSize));
  }

  else if (pair.value === "BTC" || pair.value === "ETH") {

  let priceMove = bal / lotSize;

  takeProfitSell = en - (prof / lotSize);
  stopOutSell = en + priceMove;
}

  // DISTANCE
  let tpDistance = takeProfit - en;
  let slDistance = en - stopOut;

  // OUTPUT
  // OUTPUT
tp.innerText = formatPrice(takeProfit);
sl.innerText = formatPrice(stopOut);

tpSell.innerText = formatPrice(takeProfitSell);
slSell.innerText = formatPrice(stopOutSell);

tpd.innerText = formatPrice(tpDistance);
sld.innerText = formatPrice(slDistance);

document.getElementById("entryShow").innerText = formatPrice(en);

document.getElementById("sumResultBalance").innerText =
formatPrice(bal) + " $";

// AFTER SPREAD
let tpAfter = tpDistance + spreadFee;
let slAfter = slDistance - spreadFee;

if (slAfter < 0) slAfter = 0;

tpAfterFee.innerText = formatPrice(tpAfter);
slAfterFee.innerText = formatPrice(slAfter);
}

// ===== EVENTS =====
document.querySelectorAll("input, select").forEach(el => {
  el.addEventListener("input", calculate);
});



// ===== AUTO INIT =====
window.addEventListener("load", calculate);
window.addEventListener("load", function () {

  if (!balance.value) {
    balance.value = 100;
  }

  if (!profitInput.value) {
    profitInput.value = 1;
  }

  calculate(); // auto run
});



/*live price start*/



// =========================
// LIVE PRICE ENGINE
// =========================


// ======================
// 🟣 LIVE PRICE API
// ======================
async function getLivePrice() {

   try {

      let symbol = "";

      // BTC
      if (pair.value === "BTC") {
         symbol = "BTCUSDT";
      }

      // ETH
      else if (pair.value === "ETH") {
         symbol = "ETHUSDT";
      }

      else {
         return 0;
      }

      const res = await fetch(
         `https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`
      );

      const data = await res.json();

      return parseFloat(data.price);

   } catch (err) {
      return 0;
   }
}


// ======================
// STATE
// ======================
let liveInterval = null;

const toggleBtn = document.getElementById("liveToggleBtn");
const liveBox = document.getElementById("liveBox");


// ======================
// START LIVE
// ======================
function startLivePrice() {

   stopLivePrice();

   liveInterval = setInterval(async () => {

      const price = await getLivePrice();

      if (price > 0) {
         document.getElementById("entry").value = formatPrice(price);
         calculate();
      }

   }, 2000);
}


// ======================
// STOP LIVE
// ======================
function stopLivePrice() {

   if (liveInterval) {
      clearInterval(liveInterval);
      liveInterval = null;
   }

   document.getElementById("entry").value = "";
   calculate();
}


// ======================
// CLICK TOGGLE
// ======================
toggleBtn.addEventListener("click", function () {

  // ⛔ BLOCK IF OFFLINE
  if (!navigator.onLine) {
    showAlert("Your system is offline", "error");
    return;
  }

  if (pair.value !== "BTC" && pair.value !== "ETH") return;

  this.classList.toggle("active");

  if (this.classList.contains("active")) {
    startLivePrice();
  } else {
 stopLivePrice();
  }
});

window.addEventListener("online", syncLiveToggleWithNetwork);
window.addEventListener("offline", syncLiveToggleWithNetwork);

window.addEventListener("load", function () {
  syncLiveToggleWithNetwork();
});

function syncLiveToggleWithNetwork() {

  if (!navigator.onLine) {

    // ⛔ OFFLINE → FORCE OFF
    toggleBtn.classList.remove("active");
stopLivePrice();

  } else {

    // ✅ ONLINE → FORCE ON (only if BTC or ETH selected)
    if (pair.value === "BTC" || pair.value === "ETH") {
      toggleBtn.classList.add("active");
      startLivePrice();
    }
  }
}
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



// ======================
// PAIR CONTROL
// ======================
pair.addEventListener("change", function () {

 if (this.value === "BTC" || this.value === "ETH") {
  liveBox.style.display = "flex";
} else {
      liveBox.style.display = "none";

      toggleBtn.classList.remove("active");
      stopLivePrice();
   }
});


// ======================
// 🌐 NETWORK STATUS
// ======================
const netStatus = document.getElementById("netStatus");

function updateNetworkStatus() {

   if (navigator.onLine) {
      netStatus.innerText = "ONLINE";
      netStatus.classList.remove("jb-net-offline");
      netStatus.classList.add("jb-net-online");
   } else {
      netStatus.innerText = "OFFLINE";
      netStatus.classList.remove("jb-net-online");
      netStatus.classList.add("jb-net-offline");
   }
}


// initial check
updateNetworkStatus();

// listen system changes
window.addEventListener("online", updateNetworkStatus);
window.addEventListener("offline", updateNetworkStatus);
// ======================

/*live price end*/

function openCalcModal(){
  document.getElementById("calcModal").style.display = "block";
}

function closeCalcModal(){
  document.getElementById("calcModal").style.display = "none";
}

// ======================
// NUMBER INPUT FIX
// ======================
document.querySelectorAll('input[type="number"]').forEach(input => {

  input.addEventListener("input", function () {

    // allow only numbers and single decimal point
    this.value = this.value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*?)\..*/g, "$1");

  });

});


