// Luzz Biteyear – function.js
//
// Aufgaben dieser Datei:
// 1. Burger-Menü (Mobil) und Backdrop öffnen/schließen
// 2. Sanfte Sprungnavigation, ohne dass der Reflow die Zielposition verschiebt
// 3. Pflicht-Interaktion: Trailer-Button startet das Video und blendet sich aus
//
// Hinweis: Der Narrator läuft separat über ./scripts/Main.js.

//DOMContentLoaded: Warte, bis das HTML vollständig eingelesen ist, bevor irgendein Element gesucht wird. Ohne das würde JavaScript versuchen, z. B. den Burger-Button zu finden, bevor er im HTML überhaupt existiert – und nichts würde funktionieren.//

//4 Variabeln//
document.addEventListener("DOMContentLoaded", function () {
	var nav = document.getElementById("Navleiste");
	var menueIcon = document.getElementById("Menueicon");
	var navGriff = document.getElementById("nav_griff");
	var navBackdrop = document.getElementById("nav_backdrop");

	if (!nav) {
		return;
	}

	// ---------------------------------------------------------------
	// Navigation öffnen / schließen:
	
	// Wenn sich die Navigation öffnet oder schließt, ändert sich die Höhe der Seite (Bilder werden neu angeordnet). Ohne Gegenmaßnahme würde der Browser die Scroll-Position hart abschneiden, wenn man weit unten auf der Seite war – man würde ruckartig nach oben springen. Die beiden Funktionen positionMerken() und positionWiederherstellen() merken sich die relative Position (in Prozent der Seite) vor der Änderung und stellen sie danach wieder her.

	function positionMerken() {
		var maxVorher = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
		return window.scrollY / maxVorher;
	}

	function positionWiederherstellen(verhaeltnis) {
		setTimeout(function () {
			var maxNachher = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
			window.scrollTo(0, verhaeltnis * maxNachher);
		}, 450);
	}

	function navUmschalten() {
		var verhaeltnis = positionMerken();
	//classList.toggle("offen"): Fügt Navileiste die CSS-Klasse „offen“ hinzu, wenn sie noch nicht da ist – und entfernt sie wieder, wenn sie schon da ist(Schalter). 
	//Das CSS reagiert darauf: ohne die Klasse „offen“ ist die Navigation per display:none unsichtbar (Mobil) bzw. außerhalb des Bildschirms geschoben (Tablet); mit der Klasse wird sie sichtbar bzw. reingeschoben. 
	//JavaScript setzt hier nur die Klasse – wie die Navigation dann tatsächlich aussieht, entscheidet ausschließlich das CSS.
		var offen = nav.classList.toggle("offen");
		document.body.classList.toggle("nav-offen", offen);

		if (menueIcon) {
			menueIcon.setAttribute("aria-expanded", offen ? "true" : "false");
		}

		if (navGriff) {
			navGriff.setAttribute("aria-expanded", offen ? "true" : "false");
			navGriff.textContent = offen ? "‹" : "›";
		}

		// Sicherheits-Reset: Beim Öffnen immer von ganz oben zeigen.
		if (offen) {
			nav.scrollTop = 0;
		}

		positionWiederherstellen(verhaeltnis);
	}

	function navSchliessen() {
		if (!nav.classList.contains("offen")) {
			return;
		}

		var verhaeltnis = positionMerken();

		nav.classList.remove("offen");
		document.body.classList.remove("nav-offen");

		if (menueIcon) {
			menueIcon.setAttribute("aria-expanded", "false");
		}

		if (navGriff) {
			navGriff.setAttribute("aria-expanded", "false");
			navGriff.textContent = "›";
		}

		positionWiederherstellen(verhaeltnis);
	}
	//Da Burger-Icon kein Button ist, werden im Code role, tabindex und aria-* Attribute per JavaScript nachgerüstet, plus ein eigener keydown-Listener für Enter/Leertaste. Auch die Escape-Taste schließt die Navigation, egal wo man sich gerade befindet.
	if (menueIcon) {
		// Burger-Icon ist ein <div>: Tastaturbedienung nachrüsten.
		menueIcon.setAttribute("role", "button");
		menueIcon.setAttribute("tabindex", "0");
		menueIcon.setAttribute("aria-controls", "Navlinks");
		menueIcon.setAttribute("aria-expanded", "false");
		menueIcon.setAttribute("aria-label", "Navigation ein- oder ausklappen");

		menueIcon.addEventListener("click", navUmschalten);
	//	„addEventListener“ verbindet ein Element mit einer Aktion: Wenn hier draufgeklickt wird, führe diese Funktion aus. Burger-Icon und Tablet-Griff nutzen dieselbe navUmschalten()-Funktion (auf/zu abwechselnd), die abgedunkelte Fläche hinter der geöffneten Navigation schließt sie nur (navSchliessen())
	
	
	//Beim Klick auf „Story“, „Galerie“ usw. wird der normale Sprungverhalten des Browsers unterdrückt (e.preventDefault()) und stattdessen manuell zum Zielabschnitt gescrollt – aber erst, nachdem sich die Navigation geschlossen und die Seite neu angeordnet hat. Sonst würde man während des Scrollens durch die Höhenänderung leicht daneben landen.
		menueIcon.addEventListener("keydown", function (e) {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				navUmschalten();
			}
		});
	}

	if (navBackdrop) {
		navBackdrop.addEventListener("click", navSchliessen);
	}

	if (navGriff) {
		navGriff.addEventListener("click", navUmschalten);
	}

	// Escape schließt die offene Navigation.
	document.addEventListener("keydown", function (e) {
		if (e.key === "Escape") {
			navSchliessen();
		}
	});

	// Die Nav-Leiste selbst darf sich intern nicht verschieben – sonst kann
	// normales Scrollen über der Leiste deren eigenen Inhalt verschieben (KI-Hilfe).
	nav.addEventListener("scroll", function () {
		nav.scrollTop = 0;
	});

	// ---------------------------------------------------------------
	// Sprungnavigation
	// ---------------------------------------------------------------
	// Beim Klick auf Story, Galerie usw. läuft der native Browser-Sprung
	// gleichzeitig mit dem Schließen der Nav ab. Da sich dabei die
	// Bildgrößen ändern (Reflow), verschiebt sich die Zielposition genau
	// während des Scrollens. Deshalb: nativen Sprung unterdrücken und
	// erst nach dem Reflow selbst scrollen.

	var navSprungLinks = document.querySelectorAll("#Navlinks a[href^='#']");

	navSprungLinks.forEach(function (link) {
		link.addEventListener("click", function (e) {
			var ziel = document.querySelector(link.getAttribute("href"));
			e.preventDefault();

			nav.classList.remove("offen");
			document.body.classList.remove("nav-offen");

			if (menueIcon) {
				menueIcon.setAttribute("aria-expanded", "false");
			}

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

	// ---------------------------------------------------------------
	// Pflicht-Interaktion: Trailer
	// ---------------------------------------------------------------
		//trailerVideo.play() versucht, das Video abzuspielen. Das kann fehlschlagen (z. B. weil noch keine echte Videodatei eingebunden ist – aktuell nur der Platzhalter). Deshalb blendet sich der Button nur aus, wenn play() tatsächlich erfolgreich war, sonst bliebe der Nutzer bei einem kaputten Video ohne Möglichkeit, es nochmal zu versuchen.
	var trailerButton = document.getElementById("btn_trailer");
	var trailerVideo = document.getElementById("trailer_video");

	if (trailerButton && trailerVideo) {
		trailerButton.addEventListener("click", function () {
			var abspielen = trailerVideo.play();

			// Solange noch keine Videoquelle eingebunden ist, schlägt play()
			// fehl – der Button bleibt dann sichtbar statt zu verschwinden.
			if (abspielen && typeof abspielen.catch === "function") {
				abspielen
					.then(function () {
						trailerButton.style.display = "none";
					})
					.catch(function () {
						trailerButton.style.display = "";
					});
			} else {
				trailerButton.style.display = "none";
			}
		});
	}
});