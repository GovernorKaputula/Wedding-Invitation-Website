import {
  eventState,
  countdownParts,
  wrapIndex,
  WEDDING_DATE,
  RSVP_DEADLINE,
} from "./event.js";
const scriptURL =
  "https://script.google.com/macros/s/AKfycbzy3Nz7vwggV2nTqxhxxm5ZNdR7BS_ILbaSyE0WSQhf2ORsF6nA4crHJ_UXtAmQDcja/exec";
const form = document.querySelector("#rsvp-form");
const message = document.querySelector("#rsvp-message");
const submit = document.querySelector("#rsvp-submit-button");
let lastPhase = "";
function refreshDateState() {
  const state = eventState(Date.now());
  form.hidden = !state.rsvpOpen;
  document.querySelector("#rsvp-closed").hidden = state.rsvpOpen;
  document.querySelector("#countdown").hidden = state.hasStarted;
  document.querySelector(".date-ornament").hidden = !state.hasStarted;
  const phase = state.hasEnded
    ? "A day to <em>remember.</em>"
    : state.hasStarted
      ? "Today, <em>we celebrate.</em>"
      : "Until we say <em>“I do”.</em>";
  if (phase !== lastPhase) {
    document.querySelector("#date-heading").innerHTML = phase;
    lastPhase = phase;
  }
  if (!state.hasStarted)
    for (const [key, value] of Object.entries(
      countdownParts(WEDDING_DATE - Date.now()),
    ))
      document.getElementById(key).textContent = String(value).padStart(2, "0");
  return state;
}
if (!refreshDateState().hasEnded) setInterval(refreshDateState, 1000);
document.querySelector("#attending").addEventListener("change", (event) => {
  document.querySelector("#dietary").disabled = event.target.value === "No";
});
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (Date.now() >= RSVP_DEADLINE) {
    refreshDateState();
    return;
  }
  if (!form.reportValidity() || submit.disabled) return;
  const name = document.querySelector("#name").value.trim();
  if (!name) {
    message.textContent = "Please enter your name.";
    document.querySelector("#name").focus();
    return;
  }
  const attending = document.querySelector("#attending").value;
  const data = {
    name,
    attending,
    guests: attending === "Yes" ? "1" : "0",
    dietary:
      attending === "Yes"
        ? document.querySelector("#dietary").value.trim() || "None"
        : "None",
  };
  submit.disabled = true;
  message.textContent = "Sending your response…";
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetch(scriptURL, {
      method: "POST",
      redirect: "follow",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(data),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error("Request failed");
    const result = await response.json();
    if (
      result.result !== "success" &&
      result.success !== true &&
      result.status !== "success"
    )
      throw new Error("Unconfirmed response");
    message.textContent = "Your RSVP has been received. Thank you!";
    form.reset();
    document.querySelector("#dietary").disabled = false;
  } catch {
    message.textContent =
      "We could not confirm your response. Your details are still here. Please contact one of our family representatives before trying again.";
  } finally {
    clearTimeout(timeout);
    submit.disabled = false;
  }
});
const photos = [...document.querySelectorAll("[data-gallery]")];
const dialog = document.querySelector("#photo-dialog");
const image = document.querySelector("#lightbox-image");
let current = 0;
let trigger;
function showPhoto(index) {
  current = wrapIndex(index, photos.length);
  const photo = photos[current];
  image.src = photo.href;
  image.alt = photo.querySelector("img").alt;
  document.querySelector("#photo-caption").textContent = image.alt;
  document.querySelector("#photo-count").textContent =
    `${current + 1} / ${photos.length}`;
}
photos.forEach((photo, index) =>
  photo.addEventListener("click", (event) => {
    if (
      typeof dialog.showModal !== "function" ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey
    )
      return;
    event.preventDefault();
    trigger = photo;
    showPhoto(index);
    dialog.showModal();
    document.body.classList.add("modal-open");
  }),
);
document
  .querySelector("#close-photo")
  .addEventListener("click", () => dialog.close());
document
  .querySelector("#previous-photo")
  .addEventListener("click", () => showPhoto(current - 1));
document
  .querySelector("#next-photo")
  .addEventListener("click", () => showPhoto(current + 1));
dialog.addEventListener("keydown", (event) => {
  if (event.key === "ArrowRight") {
    event.preventDefault();
    showPhoto(current + 1);
  }
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    showPhoto(current - 1);
  }
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  }
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  trigger?.focus();
});
