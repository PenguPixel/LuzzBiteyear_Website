/**
 * Richtet den Observer für Sektionen mit Narrator-Triggern ein.
 * @param {Object} options
 * @param {string} options.targetSelector CSS-Selektor der Sektionen
 * @param {number} options.threshold Sichtbarkeits-Schwelle (0.0 bis 1.0)
 * @param {Function} options.onTrigger Callback(message, pose)
 */
export function setupSectionObserver({ targetSelector, threshold = 0.5, onTrigger }) {
  const sections = document.querySelectorAll(targetSelector);
  if (!sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const msg = entry.target.getAttribute("data-narrator-msg");
        const pose = entry.target.getAttribute("data-narrator-pose") || "idle";

        if (msg && onTrigger) {
          onTrigger(msg, pose);
        }
      }
    });
  }, {
    threshold: threshold
  });

  sections.forEach((sec) => observer.observe(sec));
}