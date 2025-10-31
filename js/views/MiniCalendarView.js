import { DAYS_MINI } from "../config/constants.js";
import { isSameDay } from "../utils/dateHelpers.js";

export class MiniCalendarView {
  constructor(onDateClick) {
    this.onDateClick = onDateClick;
    this.miniCalendarGrid = document.getElementById("miniCalendarGrid");
    this.miniMonthYear = document.getElementById("miniMonthYear");
    this.miniPrevMonth = document.getElementById("miniPrevMonth");
    this.miniNextMonth = document.getElementById("miniNextMonth");

    this.currentMonth = new Date().getMonth();
    this.currentYear = new Date().getFullYear();

    this.bindEvents();
  }

  bindEvents() {
    this.miniPrevMonth.addEventListener("click", () => {
      this.changeMonth(-1);
    });

    this.miniNextMonth.addEventListener("click", () => {
      this.changeMonth(1);
    });
  }

  changeMonth(offset) {
    this.currentMonth += offset;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    } else if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.render();
  }

  render() {
    const year = this.currentYear;
    const month = this.currentMonth;
    const date = new Date(year, month);

    this.miniMonthYear.textContent = date.toLocaleDateString("fr-FR", {
      month: "long",
      year: "numeric",
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const today = new Date();

    let html = "";

    DAYS_MINI.forEach((day) => {
      html += `<div class="mini-day-label">${day}</div>`;
    });

    for (let i = 0; i < startDay; i++) {
      const prevMonthDate = new Date(year, month, 0 - startDay + i + 1);
      html += `<div class="mini-day other-month">${prevMonthDate.getDate()}</div>`;
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const currentDate = new Date(year, month, day);
      const isToday = isSameDay(currentDate, today);
      const isWeekend =
        currentDate.getDay() === 0 || currentDate.getDay() === 6;
      const dateString = currentDate.toISOString();

      html += `<div class="mini-day ${isToday ? "today" : ""} ${
        isWeekend ? "weekend" : ""
      }" data-date="${dateString}">${day}</div>`;
    }

    this.miniCalendarGrid.innerHTML = html;

    document.querySelectorAll(".mini-day[data-date]").forEach((dayEl) => {
      if (!dayEl.classList.contains("other-month")) {
        dayEl.addEventListener("click", () => {
          const clickedDate = new Date(dayEl.dataset.date);
          this.onDateClick(clickedDate);
        });
      }
    });
  }

  init() {
    this.render();
  }
}
