import { RESERVATION_LABELS } from "../config/constants.js";

export class PopupView {
  constructor(onEdit, onDelete) {
    this.eventPopup = document.getElementById("eventPopup");
    this.closePopup = document.getElementById("closePopup");
    this.popupEdit = document.getElementById("popupEdit");
    this.popupDelete = document.getElementById("popupDelete");

    this.currentPopupId = null;
    this.onEdit = onEdit;
    this.onDelete = onDelete;

    this.bindEvents();
  }

  bindEvents() {
    this.closePopup.addEventListener("click", () => this.hide());

    this.popupEdit.addEventListener("click", () => {
      if (this.currentPopupId) {
        this.onEdit(this.currentPopupId);
        this.hide();
      }
    });

    this.popupDelete.addEventListener("click", () => {
      if (this.currentPopupId) {
        const idToDelete = this.currentPopupId;
        this.hide();
        this.onDelete(idToDelete);
      }
    });

    document.addEventListener("click", (e) => {
      if (
        !this.eventPopup.classList.contains("event-popup-hidden") &&
        !this.eventPopup.contains(e.target) &&
        !e.target.closest(".reservation-event")
      ) {
        this.hide();
      }
    });
  }

  show(reservation, eventRect) {
    this.currentPopupId = reservation.id;

    const popupWidth = 300;
    const popupHeight = 280;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    let left = eventRect.right + 10;
    if (left + popupWidth > windowWidth) {
      left = eventRect.left - popupWidth - 10;
    }
    left = Math.max(10, left);

    let top = eventRect.top;
    if (top + popupHeight > windowHeight) {
      top = Math.max(10, windowHeight - popupHeight - 10);
    }

    this.eventPopup.style.left = `${left}px`;
    this.eventPopup.style.top = `${top}px`;

    document.getElementById("popupClientName").textContent =
      reservation.clientName;
    document.getElementById(
      "popupTime"
    ).textContent = `${reservation.startTime} - ${reservation.endTime}`;
    document.getElementById("popupPeople").textContent = `${
      reservation.numberOfPeople
    } personne${reservation.numberOfPeople > 1 ? "s" : ""}`;
    document.getElementById("popupType").textContent =
      RESERVATION_LABELS[reservation.type] || reservation.type;

    const notesContainer = document.getElementById("popupNotesContainer");
    if (reservation.notes && reservation.notes.trim()) {
      document.getElementById("popupNotes").textContent = reservation.notes;
      notesContainer.classList.remove("popup-info-hidden");
    } else {
      notesContainer.classList.add("popup-info-hidden");
    }

    this.eventPopup.style.display = "block";
    this.eventPopup.classList.remove("event-popup-hidden");
  }

  hide() {
    this.eventPopup.classList.add("event-popup-hidden");
    this.eventPopup.style.display = "none";
    this.currentPopupId = null;
    this.eventPopup.style.left = "-9999px";
    this.eventPopup.style.top = "-9999px";
  }

  isVisible() {
    return !this.eventPopup.classList.contains("event-popup-hidden");
  }
}
