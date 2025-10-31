export class ModalView {
  constructor(onSubmit, onClose) {
    this.modal = document.getElementById("reservationModal");
    this.modalTitle = document.getElementById("modalTitle");
    this.form = document.getElementById("reservationForm");
    this.closeBtn = document.getElementById("closeModal");
    this.cancelBtn = document.getElementById("cancelBtn");
    this.submitBtnText = document.getElementById("submitBtnText");

    this.clientNameInput = document.getElementById("clientName");
    this.daySelectInput = document.getElementById("daySelect");
    this.startTimeInput = document.getElementById("startTime");
    this.endTimeInput = document.getElementById("endTime");
    this.numberOfPeopleInput = document.getElementById("numberOfPeople");
    this.reservationTypeInput = document.getElementById("reservationType");
    this.notesInput = document.getElementById("notes");

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
      if (dayIndex !== null && dayIndex >= 0 && dayIndex < 5) {
        this.daySelectInput.value = dayIndex;
      }
    }

    setTimeout(() => this.clientNameInput.focus(), 100);
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
      clientName: this.clientNameInput.value.trim(),
      day: parseInt(this.daySelectInput.value),
      startTime: this.startTimeInput.value,
      endTime: this.endTimeInput.value,
      numberOfPeople: parseInt(this.numberOfPeopleInput.value),
      type: this.reservationTypeInput.value,
      notes: this.notesInput.value.trim(),
    };
  }

  populateForm(data) {
    this.clientNameInput.value = data.clientName;
    this.daySelectInput.value = data.day;
    this.startTimeInput.value = data.startTime;
    this.endTimeInput.value = data.endTime;
    this.numberOfPeopleInput.value = data.numberOfPeople;
    this.reservationTypeInput.value = data.type;
    this.notesInput.value = data.notes || "";
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

  isOpen() {
    return this.modal.classList.contains("active");
  }
}
