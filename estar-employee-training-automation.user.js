// ==UserScript==
// @name         Web Based Employee Training by Estar GmbH - Automatisiert
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Durchläuft alle Hinweisbögen automatisch. Die richtigen Antworten zu den Fragen werden automatisch angehakt.
// @author       Stephan Niewerth
// @match        https://heise.estargmbh.de/admin/render.php*
// @icon         https://heise.estargmbh.de/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const qanda = {
        // Datenschutz v6.5
        'Folgender Fall: Ein Kollege aus dem Nachbarbüro, mit dem Sie ein sehr gutes Arbeitsverhältnis haben, fragt Sie nach der privaten Telefonnummer eines gemeinsamen Arbeitskollegen. Wie würden Sie handeln?': [
            'Ich bitte den Kollegen, dass er selbst nach der Rufnummer fragt.',
        ],

        // Erste Hilfe v8.8
        'Folgender Fall: Eine Ihnen fremde Person ruft auf Ihrem Firmenanschluss an und fragt nach dem Gesundheitszustand eines Arbeitskollegen, der im Krankenhaus liegt. Welche Handlungsweise wäre für Sie die Richtige?': [
            'Ich bitte den Anrufer um Verständnis, dass ich darüber keine Auskunft geben kann.',
        ],
        'Sie finden eine leblose Person. Was müssen Sie tun, wenn nach maximal 10 Sekunden keine Lebenszeichen vorhanden sind?': [
            'Ich setze einen Notruf ab und beginne unverzüglich mit der Wiederbelebung.',
        ],
        'Wann wird die stabile Seitenlage angewendet?': [
            'Die stabile Seitenlage wird bei Verunglückten im bewusstlosen Zustand, die aber über eine ausreichende Atmung verfügen, angewendet.'
        ],
        'Wann ist eine Atemspende wirksam?': [
            'Wenn sich der Brustkorb/Oberbauch bei der Beatmung hebt.',
        ],
        'Was wissen Sie über das Thema Schock?': [
            'Manche Anzeichen für einen Schock können auch mit einem Schlaganfall oder Herzinfarkt verwechselt werden.',
            'Anzeichen für einen Schock sind z. B. Angst, blasse Haut und Frieren.',
            'Eine starke Blutung kann zum Schock führen.',
            'Ein Schock kann zum Tod führen.',
        ],

        // Verwaltungsarbeitsplatz v1.0
        'Was sollten Sie beim Einstellen Ihres Bürostuhls beachten?': [
            'Ober- und Unterarme bilden einen Winkel von rund 90°, wenn die Unterarme eine waagerechte Linie zur Tastatur bilden.',
            'Ober- und Unterschenkel bilden einen Winkel von rund 90°, wenn die Füße ganzflächig auf dem Boden stehen.',
        ],
        'Die meisten Unfälle im Verwaltungsbereich ereignen sich durch Stolpern, Ausrutschen und Stürzen. Welche Aussagen sind richtig?': [
            'Verkehrs- und Fluchtwege dürfen nicht als Lagerfläche genutzt werden.',
            'Ich halte Fluchttüren immer frei.',
            'Im Notfall benutze ich Treppenhäuser, statt den Aufzug.',
        ],
        'Welche Bedeutung hat dieses Zeichen?': [
            'Sammelstelle für den Notfall',
        ],
        'Wie sieht gesundheitsschonendes Heben und Tragen aus?': [
            'Last in aufrechter Haltung tragen.',
            'Große und längere Last am besten zu zweit anheben und tragen.',
            'Last möglichst nahe am Körper tragen, damit die Wirbelsäule nicht überlastet wird.',
        ],
        'Was ist beim Thema Flucht- und Rettungswege / Sammelstelle zu beachten?': [
            'Die Vorgesetzten bzw. Sammelplatzverantwortlichen informieren nach der Vollzähligkeitsprüfung über das weitere Vorgehen.',
            'In den Flucht- und Rettungswegeplänen finde ich die Kennzeichnung der Sammelplätze.',
            'Bei einer Evakuierung verlasse ich das Gebäude über den kürzesten Weg (Fluchtwege) und begebe mich dann zum Sammelplatz.',
            'Den Verlauf der Flucht- und Rettungswege erkenne ich anhand der grün beleuchteten Rettungszeichen.',
        ],
        'Wie oft können Sie die Angebotsvorsorge in Anspruch nehmen?': [
            'Einmal in 3 Jahren.',
        ],
    };


    const fragebogenForm = document.querySelector('#fragebogenForm');
    if (fragebogenForm) {
        const potentialAnswers = document.getElementsByClassName('answerDescription');
        for (let i = 0; i < potentialAnswers.length; i++) {
            const potentialAnswerElement = potentialAnswers.item(i);
            Object.keys(qanda).forEach(function(question) {
                const answers = qanda[question];
                answers.forEach(function(answer) {
                    if (potentialAnswerElement.innerText == answer) {
                        const forName = potentialAnswerElement.getAttribute('for');
                        const checkbox = document.getElementById(forName);
                        console.log(checkbox);
                        checkbox.checked = true;
                    }
                });
            });
        }
    } else {
        const button = document.querySelector('button[title="weiter"]');
        button.removeAttribute('disabled');
        button.click();
    }
})();
