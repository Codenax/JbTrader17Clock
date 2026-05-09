function createMobileBanking(data, containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = `
  <h4>📱 Mobile Banking</h4>

  <ul>
    <li>
      <span style="color: #d12053;"><strong>bKash: ${data.bkash}</strong></span>
      <span class="copy-icon" onclick="copyText(this, 'bkash', event)">⧉</span>
    </li>

    <li>
      <span style="color:yellow;"><strong>Nagad: ${data.nagad}</strong></span>
      <span class="copy-icon" onclick="copyText(this, 'nagad', event)">⧉</span>
    </li>

    <li>
      <span style="color: violet;"><strong>Rocket: ${data.rocket}</strong></span>
      <span class="copy-icon" onclick="copyText(this, 'rocket', event)">⧉</span>
    </li>
  </ul>
  `;
}

function copyText(el, type, event) {
  event.stopPropagation();

  let value = "";

  if (type === "bkash") value = el.previousElementSibling.innerText.split(":")[1].trim();
  if (type === "nagad") value = el.previousElementSibling.innerText.split(":")[1].trim();
  if (type === "rocket") value = el.previousElementSibling.innerText.split(":")[1].trim();

  navigator.clipboard.writeText(value).then(() => {

    el.innerText = "✔";

    // ✅ ADD THIS LINE (THIS FIXES YOUR TOAST)
    showToast("Copied: " + value);

    setTimeout(() => {
      el.innerText = "⧉";
    }, 800);
  });
}


/*golobal paymant section start*/
const bankingData = {
  bkash: "017XXXXXXXX7",
  nagad: "018XXXXXXXX",
  rocket: "019XXXXXXX5"
};
/*golobal paymant section end*/

createMobileBanking(bankingData, "paymentBox1");

createMobileBanking(bankingData, "paymentBox2");

createMobileBanking(bankingData, "paymentBox3");


let mouseX = 0;
let mouseY = 0;

// track mouse globally
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function showToast() {
  const toast = document.getElementById("cursorToast");
  if (!toast) return;

  toast.innerText = "Copied";

  // position near cursor
  toast.style.left = mouseX + "px";
  toast.style.top = mouseY + "px";

  toast.classList.add("show");

  clearTimeout(window.__toastTimer);

  window.__toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 600);
}

navigator.clipboard.writeText(value).then(() => {
  showToast(); // 👈 ONLY THIS
});