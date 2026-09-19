import { Narrator } from "./Narrator.js";
import { setupSectionObserver } from "./IntersectionObserver.js";

document.addEventListener("DOMContentLoaded", () => {
  const narrator = new Narrator({
    containerId: "narrator-widget",
    textElementId: "narrator-display-text",
    imageElementId: "narrator-avatar",
    autoHideDelay: 6000 
  });

  setupSectionObserver({
    targetSelector: "[data-narrator-msg]",
    threshold: 0.45, 
    onTrigger: (message, pose) => {
      narrator.speak(message, pose);
    }
  });
});