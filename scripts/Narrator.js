export class Narrator {
  constructor({ containerId, textElementId, imageElementId, autoHideDelay = 5000 }) {
    this.container = document.getElementById(containerId);
    this.textEl = document.getElementById(textElementId);
    this.imageEl = document.getElementById(imageElementId);
    this.autoHideDelay = autoHideDelay;
    this.hideTimeout = null;

    this.poses = {
      idle: "./scripts/assets/narrator_idle.webp",
      smirk: "./scripts/assets/narrator_smirk.webp",
      happy: "./scripts/assets/narrator_happy.webp"
    };

    this.initEvents();
  }

  initEvents() {
    if (!this.container) return;
    this.container.addEventListener("click", () => {
      this.hide();
    });
  }

  speak(message, pose = "idle") {
    if (!this.container || !this.textEl) return;

    // Text setzen
    this.textEl.textContent = message;

    // Pose wechseln, falls eine echte Grafik hinterlegt ist
    if (this.imageEl && this.poses[pose]) {
      this.imageEl.src = this.poses[pose];
    } else if (this.imageEl && this.poses.idle) {
      this.imageEl.src = this.poses.idle; // Fallback auf idle
    }

    // Sichtbar schalten
    this.container.classList.add("visible");

    // Bestehenden Timer zurücksetzen und neu anstoßen
    if (this.hideTimeout) clearTimeout(this.hideTimeout);
    this.hideTimeout = setTimeout(() => {
      this.hide();
    }, this.autoHideDelay);
  }

  hide() {
    if (!this.container) return;
    this.container.classList.remove("visible");
  }
}