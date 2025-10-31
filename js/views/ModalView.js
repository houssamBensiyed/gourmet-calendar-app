export class ModalView {
  constructor(onSubmit, onClose) {
    this.modal = document.getElementById("reservationModal");
    this.modalTitle = document.getElementById("modalTitle");
    this.form = document.getElementById("reservationForm");
    this.closeBtn = document.getElementById("closeModal");
    this.cancelBtn = document.getElementById("cancelBtn");
    this.submitBtnText = document.getElementById("submitBtnText");

    this.onSubmit = onSubmit;
    this.onClose = onClose;

    this.bindEvents();
  }

  bindEvents() {
    this.closeBtn.addEventListener("click", () => this.close());
    this.cancelBtn.addEventListener("click", () => this.close());
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) this.close();
    });
    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onSubmit(this.getFormData());
    });
  }

  open(editMode = false, data = null, dayIndex = null) {
    this.modal.classList.add("active");
    this.modal.setAttribute("aria-hidden", "false");
    this.clearErrors();

    if (editMode && data) {
      this.modalTitle.textContent = "Modifier la réservation";
      this.submitBtnText.textContent = "Enregistrer les modifications";
      this.populateForm(data);
    } else {
      this.modalTitle.textContent = "Nouvelle réservation";
      this.submitBtnText.textContent = "Enregistrer";
      this.form.reset();
      if (dayIndex !== null) {
        document.getElementById("daySelect").value = dayIndex;
      }
    }

    setTimeout(() => document.getElementById("clientName").focus(), 100);
  }

  close() {
    this.modal.classList.remove("active");
    this.modal.setAttribute("aria-hidden", "true");
    this.form.reset();
    this.clearErrors();
    this.onClose();
  }

  getFormData() {
    return {
      clientName: document.getElementById("clientName").value.trim(),
      day: parseInt(document.getElementById("daySelect").value),
      startTime: document.getElementById("startTime").value,
      endTime: document.getElementById("endTime").value,
      numberOfPeople: parseInt(document.getElementById("numberOfPeople").value),
      type: document.getElementById("reservationType").value,
      notes: document.getElementById("notes").value.trim(),
    };
  }

  populateForm(data) {
    document.getElementById("clientName").value = data.clientName;
    document.getElementById("daySelect").value = data.day;
    document.getElementById("startTime").value = data.startTime;
    document.getElementById("endTime").value = data.endTime;
    document.getElementById("numberOfPeople").value = data.numberOfPeople;
    document.getElementById("reservationType").value = data.type;
    document.getElementById("notes").value = data.notes || "";
  }

  showErrors(errors) {
    Object.entries(errors).forEach(([field, message]) => {
      this.showFieldError(field, message);
    });
  }

  showFieldError(fieldId, message) {
    const errorEl = document.getElementById(`${fieldId}Error`);
    const inputEl = document.getElementById(fieldId);

    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.add("active");
    }

    if (inputEl) {
      inputEl.setAttribute("aria-invalid", "true");
      inputEl.style.borderColor = "#dc2626";
    }
  }

  clearErrors() {
    document.querySelectorAll(".form-error").forEach((error) => {
      error.classList.remove("active");
      error.textContent = "";
    });

    document
      .querySelectorAll(".form-input, .form-select, .form-textarea")
      .forEach((input) => {
        input.setAttribute("aria-invalid", "false");
        input.style.borderColor = "";
      });
  }
}
