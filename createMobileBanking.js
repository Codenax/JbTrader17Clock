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
   COPY SYSTEM
========================= */

function copyText(el, type, event) {

  event.stopPropagation();

  let value = "";

  if (type === "bkash") {
    value = el.previousElementSibling.innerText.split(":")[1].trim();
  }

  if (type === "nagad") {
    value = el.previousElementSibling.innerText.split(":")[1].trim();
  }

  if (type === "rocket") {
    value = el.previousElementSibling.innerText.split(":")[1].trim();
  }

  navigator.clipboard.writeText(value).then(() => {

    el.innerText = "✔";

    // show mouse toast
    showToast();

    setTimeout(() => {
      el.innerText = "⧉";
    }, 800);

  });

}


/* =========================
   GLOBAL PAYMENT DATA
========================= */

const bankingData = {
  bkash: "017XXXXXXXX7",
  nagad: "018XXXXXXXX12",
  rocket: "019XXXXXXX5"
};


/* =========================
   CREATE ALL PAYMENT BOXES
========================= */

createMobileBanking(bankingData);


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