import { CONFIG } from "../config/constants.js";
import { StorageService } from "../services/StorageService.js";
import { ValidationService } from "../services/ValidationService.js";
import { Reservation } from "../models/Reservation.js";
import { CalendarView } from "../views/CalendarView.js";
import { ModalView } from "../views/ModalView.js";
import { ToastView } from "../views/ToastView.js";
import { getWeekDates } from "../utils/dateHelpers.js";

export class CalendarController {
  constructor() {
    this.reservations = StorageService.load();
    this.currentWeekOffset = 0;
    this.editingId = null;

    this.calendarView = new CalendarView();
    this.toastView = new ToastView();
    this.modalView = new ModalView(
      (data) => this.handleSubmit(data),
      () => (this.editingId = null)
    );

    this.init();
  }

  init() {
    this.calendarView.renderTimeColumn();
    this.renderCalendar();
    this.bindNavigationEvents();
  }

  bindNavigationEvents() {
    document.getElementById("todayBtn").addEventListener("click", () => {
      this.currentWeekOffset = 0;
      this.renderCalendar();
    });

    document.getElementById("prevWeek").addEventListener("click", () => {
      this.currentWeekOffset--;
      this.renderCalendar();
    });

    document.getElementById("nextWeek").addEventListener("click", () => {
      this.currentWeekOffset++;
      this.renderCalendar();
    });

    document
      .getElementById("addReservationBtn")
      .addEventListener("click", () => {
        this.modalView.open();
      });
  }

  renderCalendar() {
    const weekDates = getWeekDates(this.currentWeekOffset);
    this.calendarView.updatePeriodDisplay(weekDates);
    this.calendarView.renderDaysHeader(weekDates);
    this.calendarView.renderGrid(weekDates, this.reservations);
    this.bindReservationEvents();
  }

  bindReservationEvents() {
    document.querySelectorAll(".reservation-event").forEach((event) => {
      event.addEventListener("click", (e) => {
        const id = e.currentTarget.dataset.id;
        this.showReservationPopup(id, e);
      });
    });
  }

  handleSubmit(formData) {
    const validation = ValidationService.validateReservation(formData);

    if (!validation.isValid) {
      this.modalView.showErrors(validation.errors);
      return;
    }

    const weekDates = getWeekDates(this.currentWeekOffset);
    const selectedDate = weekDates[formData.day];

    const reservationData = {
      ...formData,
      id: this.editingId,
      date: selectedDate.toISOString(),
    };

    if (this.editingId) {
      this.updateReservation(reservationData);
      this.toastView.show("Réservation modifiée avec succès", "success");
    } else {
      this.addReservation(reservationData);
      this.toastView.show("Réservation ajoutée avec succès", "success");
    }

    this.modalView.close();
    this.renderCalendar();
  }

  addReservation(data) {
    const reservation = new Reservation(data);
    this.reservations.push(reservation);
    StorageService.save(this.reservations);
  }

  updateReservation(data) {
    const index = this.reservations.findIndex((r) => r.id === data.id);
    if (index !== -1) {
      this.reservations[index] = new Reservation(data);
      StorageService.save(this.reservations);
    }
  }

  deleteReservation(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return;
    }
    this.reservations = this.reservations.filter((r) => r.id !== id);
    StorageService.save(this.reservations);
    this.renderCalendar();
    this.toastView.show("Réservation supprimée", "error");
  }
}
