import { Narrator } from "./Narrator.js";
import { setupSectionObserver } from "./IntersectionObserver.js";
import { setupScrollObserver } from "./ScrollObserver.js";

document.addEventListener("DOMContentLoaded", () => {
  const narrator = new Narrator({
    containerId: "narrator-widget",
    textElementId: "narrator-display-text",
    imageElementId: "narrator-avatar",
    autoHideDelay: 3000 
  });

  setupSectionObserver({
    targetSelector: "[data-narrator-msg]",
    threshold: 0.15, 
    rootMargin: "0px 0px -15% 0px",
    onTrigger: (message, pose) => {
      narrator.speak(message, pose);
    }
  });

  setupScrollObserver({
    sectionSelector: "section[id]",
    navLinksSelector: "#Navlinks a, .Navlinks a",
    activeClass: "active",
    rootMargin: "-25% 0px -55% 0px"
  });
});