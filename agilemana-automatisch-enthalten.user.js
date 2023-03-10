// ==UserScript==
// @name         AgileMana - Automatisch enthalten
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Setzt beim Schätzen den Status automatisch auf den Status "Enthaltung".
// @author       Stephan Niewerth
// @match        https://agilemana.com/rooms/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agilemana.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const enthaltung = document.querySelector('[data-point="Enthaltung"]');

    setInterval(() => {
        if (enthaltung.classList.contains('btn-info') === false) {
            enthaltung.click();
        }
    }, Math.round(Math.random() * 10 + 5) * 1000);
})();
