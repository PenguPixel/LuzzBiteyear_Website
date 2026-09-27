// Luzz Biteyear – navigation.js
// Nav öffnet/schließt per Hover (Maus) UND per Klick/Tap (Touch) – Hover allein
// reicht auf Tablets/Touchgeräten nicht zuverlässig aus.
// Pflicht-Interaktion: Trailer-Button startet das Video und blendet sich aus.

document.addEventListener("DOMContentLoaded", function () {
	var nav = document.getElementById("Navleiste");
	var navGriff = document.getElementById("nav_griff");
	var menueIcon = document.getElementById("Menueicon");
	var navBackdrop = document.getElementById("nav_backdrop");

	function navUmschalten() {
		// Öffnen/Schließen verändert die Seitenhöhe (Bilder mit festem
		// Seitenverhältnis werden schmaler/schmäler)
		// Ausgleich würde der Browser die Scroll-Position hart kappen, wenn
		// man weit unten war. Deshalb: relative Position merken und nach
		// dem Reflow wiederherstellen, statt hart nach oben zu springen.
		var maxVorher = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
		var verhaeltnis = window.scrollY / maxVorher;

		var offen = nav.classList.toggle("offen");
		document.body.classList.toggle("nav-offen", offen);
		if (navGriff) {
			navGriff.setAttribute("aria-expanded", offen ? "true" : "false");
			navGriff.textContent = offen ? "‹" : "›";
		}

		// Sicherheits-Reset: Die Nav-Leiste selbst ist bei Tablet ein eigener
		// scrollbarer Bereich (falls der Inhalt mit echten Schriften mal nicht
		// ganz reinpasst). Beim Öffnen IMMER von ganz oben zeigen, egal was
		// vorher an interner Scroll-Position hängen geblieben ist.
		if (offen) {
			nav.scrollTop = 0;
		}

		setTimeout(function () {
			var maxNachher = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
			window.scrollTo(0, verhaeltnis * maxNachher);
			if (offen) {
				nav.scrollTop = 0;
			}
		}, 450);
	}

	function navSchliessen() {
		var maxVorher = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
		var verhaeltnis = window.scrollY / maxVorher;

		nav.classList.remove("offen");
		document.body.classList.remove("nav-offen");
		if (navGriff) {
			navGriff.setAttribute("aria-expanded", "false");
			navGriff.textContent = "›";
		}

		setTimeout(function () {
			var maxNachher = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
			window.scrollTo(0, verhaeltnis * maxNachher);
		}, 450);
	}

	if (navGriff) {
		navGriff.addEventListener("click", navUmschalten);
	}

	if (menueIcon) {
		menueIcon.addEventListener("click", navUmschalten);
	}

	if (navBackdrop) {
		navBackdrop.addEventListener("click", navSchliessen);
	}

	// Zusätzliches Sicherheitsnetz für den Hover-Pfad (Maus): auch dort immer
	// von oben zeigen.
	nav.addEventListener("mouseenter", function () {
		nav.scrollTop = 0;
	});

	// Die Nav-Leiste selbst darf sich nie intern verschieben – sonst kann
	// normales Scrollen der Seite mit der Maus über der Sidebar (linker
	// Rand) versehentlich deren eigenen Inhalt verschieben, wodurch obere
	// Punkte wie Story/Galerie aus dem Blick geraten, bis man ganz nach
	// oben scrollt. Interner Scroll wird deshalb immer sofort zurückgesetzt.
	nav.addEventListener("scroll", function () {
		nav.scrollTop = 0;
	});

	// Beim Klick auf einen Sprung-Link (Story, Galerie, ...) läuft der native
	// Browser-Sprung gleichzeitig mit dem Schließen der Nav ab – da die Nav
	// beim Schließen die Bildgrößen ändert (Reflow), verschiebt sich die
	// Zielposition GENAU während der Browser dorthin scrollt, was wie ein
	// Zurückspringen aussieht. Deshalb: eigenen Sprung erst NACH dem Reflow
	// auslösen, den nativen Sprung currentTarget unterdrücken.
	var navSprungLinks = document.querySelectorAll("#Navlinks a[href^='#']");
	navSprungLinks.forEach(function (link) {
		link.addEventListener("click", function (e) {
			var ziel = document.querySelector(link.getAttribute("href"));
			e.preventDefault();

			nav.classList.remove("offen");
			document.body.classList.remove("nav-offen");
			if (navGriff) {
				navGriff.setAttribute("aria-expanded", "false");
				navGriff.textContent = "›";
			}

			setTimeout(function () {
				if (ziel) {
					ziel.scrollIntoView({ behavior: "smooth", block: "start" });
				}
			}, 450);
		});
	});

	var trailerButton = document.getElementById("btn_trailer");
	var trailerVideo = document.getElementById("trailer_video");

	if (trailerButton && trailerVideo) {
		trailerButton.addEventListener("click", function () {
			trailerVideo.play();
			trailerButton.style.display = "none";
		});
	}
});