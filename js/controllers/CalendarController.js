import { CONFIG } from "../config/constants.js";
import { StorageService } from "../services/StorageService.js";
import { ValidationService } from "../services/ValidationService.js";
import { CalendarView } from "../views/CalendarView.js";
import { MiniCalendarView } from "../views/MiniCalendarView.js";
import { ModalView } from "../views/ModalView.js";
import { PopupView } from "../views/PopupView.js";
import { SidebarView } from "../views/SidebarView.js";
import { FilterView } from "../views/FilterView.js";
import { ToastView } from "../views/ToastView.js";
import { getWeekDates, getMondayOfWeek } from "../utils/dateHelpers.js";
import { generateId } from "../utils/domHelpers.js";

export class CalendarController {
  constructor() {
    this.reservations = StorageService.load() || [];
    this.currentWeekOffset = 0;
    this.editingId = null;
    this.draggedElement = null;
    this.searchTerm = "";
    this.activeFilters = ["standard", "vip", "birthday", "group", "business"];

    this.initViews();
    this.init();
  }

  initViews() {
    this.calendarView = new CalendarView();
    this.toastView = new ToastView();
    this.sidebarView = new SidebarView();

    this.miniCalendarView = new MiniCalendarView((date) => {
      this.navigateToDate(date);
    });

    this.filterView = new FilterView((filters) => {
      this.activeFilters = filters;
      this.applySearchAndFilters();
      this.toastView.show(
        `Filtres appliqués (${filters.length} types)`,
        "success"
      );
    });

    this.modalView = new ModalView(
      (data) => this.handleSubmit(data),
      () => (this.editingId = null)
    );

    this.popupView = new PopupView(
      (id) => this.editReservation(id),
      (id) => this.deleteReservation(id)
    );
  }

  init() {
    this.miniCalendarView.init();
    this.calendarView.renderTimeColumn();
    this.renderCalendar();
    this.updateStatistics();
    this.bindNavigationEvents();
    this.bindSearchEvents();
    this.bindKeyboardEvents();
  }

  bindNavigationEvents() {
    document.getElementById("todayBtn").addEventListener("click", () => {
      this.goToToday();
    });

    document.getElementById("prevWeek").addEventListener("click", () => {
      this.changeWeek(-1);
    });

    document.getElementById("nextWeek").addEventListener("click", () => {
      this.changeWeek(1);
    });

    document
      .getElementById("addReservationBtn")
      .addEventListener("click", () => {
        this.modalView.open();
      });
  }

  bindSearchEvents() {
    const searchInput = document.getElementById("searchInput");
    let searchTimeout;

    searchInput.addEventListener("input", (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.handleSearch(e.target.value);
      }, CONFIG.SEARCH_DEBOUNCE);
    });
  }

  bindKeyboardEvents() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        if (this.modalView.isOpen()) {
          this.modalView.close();
        } else if (this.popupView.isVisible()) {
          this.popupView.hide();
        } else if (this.filterView.isOpen()) {
          this.filterView.close();
        } else if (this.sidebarView.isOpen()) {
          this.sidebarView.close();
        }
      }
    });
  }

  renderCalendar() {
    const weekDates = getWeekDates(this.currentWeekOffset);
    this.calendarView.updatePeriodDisplay(weekDates);
    this.calendarView.renderDaysHeader(weekDates);
    this.calendarView.renderGrid(weekDates, this.reservations);
    this.bindReservationEvents();
    this.bindDayColumnEvents();
    this.applySearchAndFilters();
    this.updateStatistics();
  }

  bindReservationEvents() {
    document.querySelectorAll(".reservation-event").forEach((event) => {
      event.addEventListener("click", (e) => {
        if (e.target.classList.contains("resize-handle")) {
          return;
        }
        e.stopPropagation();
        this.showEventPopup(event);
      });

      event.addEventListener("dragstart", (e) => {
        this.draggedElement = event;
        event.classList.add("dragging");
        e.dataTransfer.effectAllowed = "move";
      });

      event.addEventListener("dragend", (e) => {
        event.classList.remove("dragging");
        this.draggedElement = null;
      });

      const resizeHandle = event.querySelector(".resize-handle-bottom");
      if (resizeHandle) {
        resizeHandle.addEventListener("mousedown", (e) => {
          e.stopPropagation();
          e.preventDefault();
          this.startResize(event, e);
        });
      }
    });
  }

  bindDayColumnEvents() {
    document.querySelectorAll(".day-column").forEach((column) => {
      const dayIndex = parseInt(column.dataset.day);
      const isWeekend = dayIndex >= 5;

      if (!isWeekend) {
        column.addEventListener("dblclick", () => {
          this.modalView.open(false, null, dayIndex);
        });
      }

      column.addEventListener("dragover", (e) => this.handleDragOver(e));
      column.addEventListener("drop", (e) => this.handleDrop(e, dayIndex));
    });
  }

  showEventPopup(eventEl) {
    const id = eventEl.dataset.id;
    const reservation = this.reservations.find((r) => r.id === id);
    if (!reservation) return;

    const rect = eventEl.getBoundingClientRect();
    this.popupView.show(reservation, rect);
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  handleDrop(e, targetDayIndex) {
    e.preventDefault();

    if (!this.draggedElement) return;

    if (targetDayIndex >= 5) {
      this.toastView.show("Impossible de déplacer vers le week-end", "error");
      return;
    }

    const id = this.draggedElement.dataset.id;
    const reservation = this.reservations.find((r) => r.id === id);

    if (reservation) {
      const weekDates = getWeekDates(this.currentWeekOffset);
      const targetDate = weekDates[targetDayIndex];

      reservation.day = targetDayIndex;
      reservation.date = targetDate.toISOString();

      this.saveToStorage();
      this.renderCalendar();
      this.toastView.show("Réservation déplacée avec succès", "success");
    }
  }

  startResize(eventEl, e) {
    const id = eventEl.dataset.id;
    const reservation = this.reservations.find((r) => r.id === id);
    if (!reservation) return;

    eventEl.classList.add("resizing");
    const startY = e.clientY;
    const startHeight = eventEl.offsetHeight;

    const onMouseMove = (moveEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const newHeight = Math.max(30, startHeight + deltaY);
      eventEl.style.height = `${newHeight}px`;
    };

    const onMouseUp = () => {
      eventEl.classList.remove("resizing");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);

      const finalHeight = eventEl.offsetHeight;
      const newDurationMinutes = Math.round(finalHeight);

      const [startHour, startMin] = reservation.startTime
        .split(":")
        .map(Number);
      const startTotalMinutes = startHour * 60 + startMin;
      const endTotalMinutes = startTotalMinutes + newDurationMinutes;

      const newEndHour = Math.floor(endTotalMinutes / 60);
      const newEndMin = endTotalMinutes % 60;

      if (
        newEndHour > CONFIG.END_HOUR ||
        (newEndHour === CONFIG.END_HOUR && newEndMin > 0)
      ) {
        this.toastView.show(
          "L'heure de fin dépasse les heures d'ouverture",
          "error"
        );
        this.renderCalendar();
        return;
      }

      if (
        newEndHour < startHour ||
        (newEndHour === startHour && newEndMin <= startMin)
      ) {
        this.toastView.show(
          "La durée doit être d'au moins 30 minutes",
          "error"
        );
        this.renderCalendar();
        return;
      }

      const newEndTime = `${String(newEndHour).padStart(2, "0")}:${String(
        newEndMin
      ).padStart(2, "0")}`;

      reservation.endTime = newEndTime;
      this.saveToStorage();
      this.renderCalendar();
      this.toastView.show("Durée modifiée avec succès", "success");
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  }

  handleSubmit(formData) {
    const validation = ValidationService.validateReservation(formData);

    if (!validation.isValid) {
      this.modalView.showErrors(validation.errors);
      return;
    }

    const weekDates = getWeekDates(this.currentWeekOffset);
    const selectedDate = weekDates[formData.day];

    if (!selectedDate) {
      this.toastView.show("Erreur: jour invalide", "error");
      return;
    }

    const reservationData = {
      id: this.editingId || generateId(),
      clientName: formData.clientName,
      day: formData.day,
      date: selectedDate.toISOString(),
      startTime: formData.startTime,
      endTime: formData.endTime,
      numberOfPeople: formData.numberOfPeople,
      type: formData.type,
      notes: formData.notes,
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

  addReservation(reservation) {
    this.reservations.push(reservation);
    this.saveToStorage();
  }

  updateReservation(updatedReservation) {
    const index = this.reservations.findIndex(
      (r) => r.id === updatedReservation.id
    );
    if (index !== -1) {
      this.reservations[index] = updatedReservation;
      this.saveToStorage();
    }
  }

  editReservation(id) {
    const reservation = this.reservations.find((r) => r.id === id);
    if (!reservation) return;

    this.editingId = id;
    this.modalView.open(true, reservation);
  }

  deleteReservation(id) {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette réservation ?")) {
      return;
    }

    this.reservations = this.reservations.filter((r) => r.id !== id);
    this.saveToStorage();
    this.renderCalendar();
    this.toastView.show("Réservation supprimée", "error");
  }

  handleSearch(query) {
    this.searchTerm = query.toLowerCase().trim();
    this.applySearchAndFilters();
  }

  applySearchAndFilters() {
    const events = document.querySelectorAll(".reservation-event");

    events.forEach((event) => {
      const searchData = event.dataset.search || "";
      const eventType = event.dataset.type;

      let showBySearch = true;
      let showByFilter = true;

      if (this.searchTerm) {
        showBySearch = searchData.includes(this.searchTerm);
      }

      if (this.activeFilters.length > 0) {
        showByFilter = this.activeFilters.includes(eventType);
      }

      if (showBySearch && showByFilter) {
        event.classList.remove("hidden");
      } else {
        event.classList.add("hidden");
      }
    });
  }

  goToToday() {
    this.currentWeekOffset = 0;
    this.renderCalendar();
  }

  changeWeek(offset) {
    this.currentWeekOffset += offset;
    this.renderCalendar();
  }

  navigateToDate(targetDate) {
    const today = new Date();
    const currentMonday = getMondayOfWeek(today);
    const targetMonday = getMondayOfWeek(targetDate);

    const diffTime = targetMonday - currentMonday;
    const diffWeeks = Math.round(diffTime / (7 * 24 * 60 * 60 * 1000));

    this.currentWeekOffset = diffWeeks;
    this.renderCalendar();
  }

  updateStatistics() {
    const weekDates = getWeekDates(this.currentWeekOffset);
    const weekReservations = this.reservations.filter((res) => {
      const resDate = new Date(res.date);
      return resDate >= weekDates[0] && resDate <= weekDates[6];
    });

    document.getElementById("totalReservations").textContent =
      weekReservations.length;

    const typeCount = {
      standard: 0,
      vip: 0,
      birthday: 0,
      group: 0,
      business: 0,
    };

    weekReservations.forEach((res) => {
      if (typeCount.hasOwnProperty(res.type)) {
        typeCount[res.type]++;
      }
    });

    document.getElementById("standardCount").textContent = typeCount.standard;
    document.getElementById("vipCount").textContent = typeCount.vip;
    document.getElementById("birthdayCount").textContent = typeCount.birthday;
    document.getElementById("groupCount").textContent = typeCount.group;
    document.getElementById("businessCount").textContent = typeCount.business;
  }

  saveToStorage() {
    const success = StorageService.save(this.reservations);
    if (!success) {
      this.toastView.show("Erreur lors de la sauvegarde", "error");
    }
  }
}
