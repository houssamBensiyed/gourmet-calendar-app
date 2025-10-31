export class FilterView {
  constructor(onApply) {
    this.onApply = onApply;
    this.filterToggle = document.getElementById("filterToggle");
    this.filterPanel = document.getElementById("filterPanel");
    this.filterClose = document.getElementById("filterClose");
    this.filterOverlay = document.getElementById("filterOverlay");
    this.filterAll = document.getElementById("filterAll");
    this.filterTypes = document.querySelectorAll(".filter-type");
    this.filterReset = document.getElementById("filterReset");
    this.filterApply = document.getElementById("filterApply");
    this.bindEvents();
  }

  bindEvents() {
    this.filterToggle.addEventListener("click", () => {
      this.toggle();
    });

    this.filterClose.addEventListener("click", () => {
      this.close();
    });

    if (this.filterOverlay) {
      this.filterOverlay.addEventListener("click", () => {
        this.close();
      });
    }

    this.filterAll.addEventListener("change", (e) => {
      const isChecked = e.target.checked;
      this.filterTypes.forEach((checkbox) => {
        checkbox.checked = isChecked;
      });
    });

    this.filterTypes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const allChecked = Array.from(this.filterTypes).every(
          (cb) => cb.checked
        );
        this.filterAll.checked = allChecked;
      });
    });

    this.filterReset.addEventListener("click", () => {
      this.reset();
    });

    this.filterApply.addEventListener("click", () => {
      this.apply();
    });
  }

  toggle() {
    const isOpen = this.filterPanel.classList.toggle("open");
    if (this.filterOverlay) {
      this.filterOverlay.classList.toggle("active");
    }
    this.filterToggle.setAttribute("aria-expanded", isOpen);
    this.filterPanel.setAttribute("aria-hidden", !isOpen);
  }

  close() {
    this.filterPanel.classList.remove("open");
    if (this.filterOverlay) {
      this.filterOverlay.classList.remove("active");
    }
    this.filterToggle.setAttribute("aria-expanded", "false");
    this.filterPanel.setAttribute("aria-hidden", "true");
  }

  reset() {
    this.filterAll.checked = true;
    this.filterTypes.forEach((cb) => (cb.checked = true));
    this.onApply(this.getActiveFilters());
  }

  apply() {
    this.onApply(this.getActiveFilters());
    this.close();
  }

  getActiveFilters() {
    return Array.from(this.filterTypes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);
  }

  isOpen() {
    return this.filterPanel.classList.contains("open");
  }
}
