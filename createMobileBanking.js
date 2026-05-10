function createMobileBanking(data) {

  const html = `
    <h4>📱 Mobile Banking</h4>

    <ul>
      <li>
        <span style="color:#d12053;">
          <strong>bKash: ${data.bkash}</strong>
        </span>

        <span class="copy-icon"
        onclick="copyText(this, 'bkash', event)">⧉</span>
      </li>

      <li>
        <span style="color:yellow;">
          <strong>Nagad: ${data.nagad}</strong>
        </span>

        <span class="copy-icon"
        onclick="copyText(this, 'nagad', event)">⧉</span>
      </li>

      <li>
        <span style="color:violet;">
          <strong>Rocket: ${data.rocket}</strong>
        </span>

        <span class="copy-icon"
        onclick="copyText(this, 'rocket', event)">⧉</span>
      </li>
    </ul>
  `;

  document.querySelectorAll(".paymentBox")
    .forEach(box => {
      box.innerHTML = html;
    });
}


/* =========================
   GLOBAL DATA
========================= */

const bankingData = {
  bkash: "01722466597",
  nagad: "01722466597",
  rocket: "017224665977"
};

const donationData = {
  crypto: "0xa2931e62f7715603938c45a377f1b70afa8b4438"
};


/* =========================
   CREATE PAYMENT BOXES
========================= */

createMobileBanking(bankingData);


/* =========================
   GLOBAL COPY SYSTEM
========================= */

function copyText(el, type, event) {

  event.stopPropagation();

  let value = "";

  // banking
  if (type === "bkash") {
    value = bankingData.bkash;
  }

  if (type === "nagad") {
    value = bankingData.nagad;
  }

  if (type === "rocket") {
    value = bankingData.rocket;
  }

  // donation
  if (type === "crypto") {
    value = donationData.crypto;
  }

  if (!value) return;

  navigator.clipboard.writeText(value).then(() => {

    // icon change
    el.innerText = "✔";

    setTimeout(() => {
      el.innerText = "⧉";
    }, 800);

    // toast
    showToast();

  });

}


/* =========================
   MOUSE TOAST SYSTEM
========================= */

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {

  mouseX = e.clientX;
  mouseY = e.clientY;

});

function showToast() {

  const toast = document.getElementById("cursorToast");

  if (!toast) return;

  toast.innerText = "Copied";

  toast.style.left = mouseX + "px";
  toast.style.top = mouseY + "px";

  toast.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 600);

}

/*open acc*/
function copyBrokerCode(el, code, event){

  event.stopPropagation();

  navigator.clipboard.writeText(code).then(() => {

    el.innerText = "✔";

    showToast(); // your existing toast

    setTimeout(() => {
      el.innerText = "⧉";
    }, 800);

  });

}
/*open acc end*/