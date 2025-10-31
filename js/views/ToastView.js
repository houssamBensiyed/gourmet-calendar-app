import { CONFIG } from "../config/constants.js";

export class ToastView {
  constructor() {
    this.toast = document.getElementById("toast");
    this.toastIcon = document.getElementById("toastIcon");
    this.toastMessage = document.getElementById("toastMessage");
    this.timeout = null;
    this.bindEvents();
  }

  bindEvents() {
    this.toast.addEventListener("mouseenter", () => {
      clearTimeout(this.timeout);
    });

    this.toast.addEventListener("mouseleave", () => {
      this.timeout = setTimeout(() => this.hide(), 1000);
    });
  }

  show(message, type = "success") {
    clearTimeout(this.timeout);

    this.toastMessage.textContent = message;
    this.toastIcon.className = `toast-icon fas ${
      type === "success"
        ? "fa-check-circle success"
        : "fa-exclamation-circle error"
    }`;

    this.toast.classList.remove("toast-hidden");
    this.toast.classList.add("active");

    this.timeout = setTimeout(() => this.hide(), CONFIG.TOAST_DURATION);
  }

  hide() {
    this.toast.classList.remove("active");
    this.toast.classList.add("toast-hidden");
  }
}
