import { CONFIG, DAYS_OF_WEEK } from "../config/constants.js";
import { escapeHtml } from "../utils/domHelpers.js";
import { isSameDay, formatDateRange } from "../utils/dateHelpers.js";

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

  renderDaysHeader(weekDates) {
    const today = new Date();
    let html = "";

    weekDates.forEach((date, index) => {
      const isToday = isSameDay(date, today);
      const isWeekend = index >= 5;
      html += `
        <div class="day-header-cell ${isToday ? "today" : ""} ${
        isWeekend ? "weekend" : ""
      }">
          <div class="day-header-name">${DAYS_OF_WEEK[index]}</div>
          <div class="day-header-date">${date.getDate()}</div>
        </div>
      `;
    });

    this.daysHeader.innerHTML = html;
  }

  updatePeriodDisplay(weekDates) {
    const start = weekDates[0];
    this.currentPeriod.textContent = formatDateRange(start);
  }

  renderGrid(weekDates, reservations) {
    let html = "";

    weekDates.forEach((date, dayIndex) => {
      const isWeekend = dayIndex >= 5;
      html += `<div class="day-column ${
        isWeekend ? "weekend" : ""
      }" data-day="${dayIndex}">`;

      for (let hour = CONFIG.START_HOUR; hour <= CONFIG.END_HOUR; hour++) {
        const top = (hour - CONFIG.START_HOUR) * 60;
        html += `<div class="hour-line" style="top: ${top}px;"></div>`;
      }

      html += this.renderReservationsForDay(dayIndex, date, reservations);
      html += `</div>`;
    });

    this.calendarGrid.innerHTML = html;
  }

  renderReservationsForDay(dayIndex, date, reservations) {
    const dayReservations = reservations.filter((res) => {
      const resDate = new Date(res.date);
      return isSameDay(resDate, date);
    });

    let html = "";

    dayReservations.forEach((res) => {
      const position = this.calculateEventPosition(res.startTime, res.endTime);
      html += `
        <div class="reservation-event" 
             data-id="${res.id}"
             data-type="${res.type}"
             data-client="${escapeHtml(res.clientName).toLowerCase()}"
             data-search="${escapeHtml(
               res.clientName + " " + res.type + " " + (res.notes || "")
             ).toLowerCase()}"
             draggable="true"
             style="top: ${position.top}px; height: ${position.height}px;">
            <div class="event-time">${res.startTime} - ${res.endTime}</div>
            <div class="event-client">${escapeHtml(res.clientName)}</div>
            <div class="event-people">${res.numberOfPeople} pers.</div>
            <div class="resize-handle resize-handle-bottom"></div>
        </div>
      `;
    });

    return html;
  }

  calculateEventPosition(startTime, endTime) {
    const [startHour, startMin] = startTime.split(":").map(Number);
    const [endHour, endMin] = endTime.split(":").map(Number);
    const startMinutes = (startHour - CONFIG.START_HOUR) * 60 + startMin;
    const endMinutes = (endHour - CONFIG.START_HOUR) * 60 + endMin;
    const duration = endMinutes - startMinutes;
    return {
      top: startMinutes,
      height: Math.max(duration, 30),
    };
  }
}
