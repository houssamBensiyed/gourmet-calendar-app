import { CONFIG, DAYS_OF_WEEK } from "../config/constants.js";
import { escapeHtml } from "../utils/domHelpers.js";
import { isSameDay } from "../utils/dateHelpers.js";

export class CalendarView {
  constructor() {
    this.daysHeader = document.getElementById("daysHeader");
    this.timeColumn = document.getElementById("timeColumn");
    this.calendarGrid = document.getElementById("calendarGrid");
    this.currentPeriod = document.getElementById("currentPeriod");
  }

  renderTimeColumn() {
    let html = "";
    for (let hour = CONFIG.START_HOUR; hour <= CONFIG.END_HOUR; hour++) {
      const displayHour = hour < 10 ? `0${hour}` : hour;
      html += `<div class="time-slot">${displayHour}:00</div>`;
    }
    this.timeColumn.innerHTML = html;
  }
}
