import { CalendarController } from "./controllers/CalendarController.js";

let calendarController;

document.addEventListener("DOMContentLoaded", () => {
  calendarController = new CalendarController();
});

// Export for debugging in console
window.calendarController = calendarController;
