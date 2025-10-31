export class SidebarView {
  constructor() {
    this.menuToggle = document.getElementById("menuToggle");
    this.sidebar = document.getElementById("sidebar");
    this.sidebarOverlay = document.getElementById("sidebarOverlay");
    this.bindEvents();
  }

  bindEvents() {
    this.menuToggle.addEventListener("click", () => {
      const isOpen = this.sidebar.classList.toggle("open");
      this.sidebarOverlay.classList.toggle("active");
      this.menuToggle.setAttribute("aria-expanded", isOpen);
    });

    this.sidebarOverlay.addEventListener("click", () => {
      this.close();
    });
  }

  close() {
    this.sidebar.classList.remove("open");
    this.sidebarOverlay.classList.remove("active");
    this.menuToggle.setAttribute("aria-expanded", "false");
  }

  isOpen() {
    return this.sidebar.classList.contains("open");
  }
}
