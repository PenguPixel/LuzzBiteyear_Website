
export function setupSectionObserver({ 
  targetSelector = "[data-barrator-msg]", 
  threshold = 0.1, 
  rootMargin = "0px 0px -20% 0px", 
  onTrigger }) 
  {
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
      threshold: threshold,
      rootMargin: rootMargin
    });

    sections.forEach((sec) => observer.observe(sec));
}