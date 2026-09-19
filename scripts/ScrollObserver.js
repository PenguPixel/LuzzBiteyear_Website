export function setupScrollObserver({
  sectionSelector = "section[id]",
  navLinksSelector = "#Navlinks a, .Navlinks a",
  activeClass = "active",
  rootMargin = "-25% 0px -55% 0px"
} = {}) {
  const sections = document.querySelectorAll(sectionSelector);
  const navLinks = document.querySelectorAll(navLinksSelector);

  const linkMap = new Map();

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && href.startsWith("#") && href.length > 1) {
      const targetId = href.substring(1).toLowerCase();
      linkMap.set(targetId, link);
    }
  });

  const observerOptions = {
    root: null, 
    rootMargin: rootMargin, 
    threshold: 0 
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const currentId = entry.target.id.toLowerCase();
        const activeLink = linkMap.get(currentId);

        if (activeLink) {
          navLinks.forEach((link) => link.classList.remove(activeClass));
          
          activeLink.classList.add(activeClass);
        }
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}