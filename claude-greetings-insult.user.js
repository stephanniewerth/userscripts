// ==UserScript==
// @name         Claude.ai Begrüßung → Beleidigungen
// @namespace    https://claude.ai/
// @version      1.2
// @description  Ersetzt die Begrüßung auf claude.ai durch tageszeitabhängigen Gruß + zufällige Beleidigung
// @match        https://claude.ai/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  const SELECTOR = '.text-balance > span:nth-child(2)';

  const GREETINGS = {
    morning: [   // 05–10 Uhr
      'Guten Morgen',
      'Moin',
      'Na, auch schon wach',
      'Schönen Morgen',
      'Aufgestanden, wie ich sehe',
    ],
    noon: [      // 11–13 Uhr
      'Mahlzeit',
      'Guten Tag',
      'Schönen Vormittag',
      'Hunger?',
      'Mittagspause schon vorbei',
    ],
    afternoon: [ // 14–17 Uhr
      'Guten Tag',
      'Schönen Nachmittag',
      'Mahlzeit',
      'Na, Kaffeetief',
      'Immer noch da',
    ],
    evening: [   // 18–21 Uhr
      'Guten Abend',
      'Schönen Feierabend',
      'Na, Feierabend',
      'Noch am Arbeiten',
      'Abend',
    ],
    night: [     // 22–04 Uhr
      'Gute Nacht',
      'Nachtschicht, was',
      'Immer noch wach',
      'Solltest du nicht schlafen',
      'Mitten in der Nacht',
    ],
  };

  const INSULTS = [
    'du Totalausfall',
    'du Verschwendung von Sauerstoff',
    'du wandelnde Fehlkonfiguration',
    'du Schande für jede Tastatur',
    'du Geschenk an die Inkompetenz',
    'du Hirnakrobat ohne Netz',
    'du Paradebeispiel für Fehlentscheidungen',
    'du lebendiger Beweis gegen Evolution',
    'du Katastrophe mit Netzteil',
    'du Stack Overflow Copy-Paste-Genie',
    'du Fachkraft für Chaos',
    'du Nullpointer mit Selbstvertrauen',
    'du Produktivitätsloch',
    'du wandelnder Hotfix auf Produktion',
    'du Legacy-Code in Menschengestalt',
    'du Freitagnachmittag-Deployer',
    'du Mensch gewordener 500er-Fehler',
    'du Bug, der sich für ein Feature hält',
    'du Kollege, den keiner im Code-Review will',
    'du Grund, warum wir Backups haben',
    'du Dunning-Kruger-Paradebeispiel',
    'du rm -rf auf zwei Beinen',
  ];

  const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function timeOfDay() {
    const h = new Date().getHours();
    if (h >= 5 && h <= 10) return 'morning';
    if (h >= 11 && h <= 13) return 'noon';
    if (h >= 14 && h <= 17) return 'afternoon';
    if (h >= 18 && h <= 21) return 'evening';
    return 'night';
  }

  // Einmal pro Seitenaufruf würfeln -> kein Flackern durch Re-Renders
  const text = `${rand(GREETINGS[timeOfDay()])}, ${rand(INSULTS)}`;

  let scheduled = false;

  function replace() {
    scheduled = false;
    const els = document.querySelectorAll(SELECTOR);
    if (!els.length) return;

    observer.disconnect(); // eigene Änderungen nicht selbst beobachten

    els.forEach((el) => {
      const node = [...el.childNodes].find((n) => n.nodeType === Node.TEXT_NODE);
      if (node) {
        if (node.nodeValue !== text) node.nodeValue = text;
      } else if (el.textContent !== text) {
        el.textContent = text;
      }
    });

    observe();
  }

  function schedule() {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(replace);
  }

  const observer = new MutationObserver(schedule);
  function observe() {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  }

  observe();
  replace();
})();
