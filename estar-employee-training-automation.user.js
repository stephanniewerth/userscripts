// ==UserScript==
// @name         Web Based Employee Training by Estar GmbH - Automatisiert
// @namespace    http://tampermonkey.net/
// @version      1.1
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
        'Die Vertriebsabteilung möchte alle Kunden per E-Mail über ein neues Produkt informieren. Was muss sie dabei beachten?': [
            'Sie setzt alle E-Mail-Adressen in das "BCC"-Feld.',
        ],
        'Folgender Fall: Ein Kollege aus dem Nachbarbüro, mit dem Sie ein sehr gutes Arbeitsverhältnis haben, fragt Sie nach der privaten Telefonnummer eines gemeinsamen Arbeitskollegen. Wie würden Sie handeln?': [
            'Ich bitte den Kollegen, dass er selbst nach der Rufnummer fragt.',
        ],
        'Sie verlassen während der Pause Ihren Arbeitsplatz. Wie sichern Sie Ihren Arbeitsplatz, damit kein Datenmissbrauch stattfinden kann?': [
            'Ich sperre den PC, sodass der PC erst mit Eingabe des Passwortes wieder bedient werden kann.',
            'Ich schließe, wenn möglich, meine Tür ab.',
        ],
        'Welche der folgenden Datenverarbeitungen sind korrekt?': [
            'Ich erhalte eine Anfrage per E-Mail. Da ich hierzu keine Auskunft geben kann, leite ich diese E-Mail an den Sachbearbeiter weiter, der diese beantworten kann.',
            'Ein Interessent teilt mir seine Post-Adresse mit, damit ich ihm dorthin ein Angebot zusenden kann.',
        ],
        'Welche Rechte stehen Ihnen zu, wenn Ihre Daten verarbeitet wurden?': [
            'Ich habe ein Auskunftsrecht bei der Stelle, die meine Daten verarbeitet hat.',
            'Ich kann veranlassen, dass meine Daten, die unrechtmäßig verarbeitet wurden, gelöscht werden.',
        ],

        // Erste Hilfe v8.8
        'Folgender Fall: Eine Ihnen fremde Person ruft auf Ihrem Firmenanschluss an und fragt nach dem Gesundheitszustand eines Arbeitskollegen, der im Krankenhaus liegt. Welche Handlungsweise wäre für Sie die Richtige?': [
            'Ich bitte den Anrufer um Verständnis, dass ich darüber keine Auskunft geben kann.',
        ],
        'Sie finden eine leblose Person. Was müssen Sie tun, wenn nach maximal 10 Sekunden keine Lebenszeichen vorhanden sind?': [
            'Ich setze einen Notruf ab und beginne unverzüglich mit der Wiederbelebung.',
        ],
        'Wann ist eine Atemspende wirksam?': [
            'Wenn sich der Brustkorb/Oberbauch bei der Beatmung hebt.',
        ],
        'Wann ist eine Herzdruckmassage an einer leblosen Person durchzuführen?': [
            'Bei der Person ist keine normale Atmung vorhanden bzw. es bestehen Zweifel, dass eine normale Atmung vorhanden ist UND sie reagiert nicht auf Ansprache und Anfassen (vorsichtiges Rütteln an den Schultern).',
        ],
        'Wann wird die stabile Seitenlage angewendet?': [
            'Die stabile Seitenlage wird bei Verunglückten im bewusstlosen Zustand, die aber über eine ausreichende Atmung verfügen, angewendet.'
        ],
        'Was wissen Sie über das Thema Schock?': [
            'Manche Anzeichen für einen Schock können auch mit einem Schlaganfall oder Herzinfarkt verwechselt werden.',
            'Anzeichen für einen Schock sind z. B. Angst, blasse Haut und Frieren.',
            'Eine starke Blutung kann zum Schock führen.',
            'Ein Schock kann zum Tod führen.',
        ],
        'Wer ist zur Leistung von Erster Hilfe verpflichtet?': [
            'Jeder, da dies sonst den Tatbestand der unterlassenen Hilfeleistung erfüllt.',
        ],
        'Wie lautet der richtige Rhythmus bei der Herz-Lungen-Wiederbelebung?': [
            '30 Herzdruckmassagen zu 2 Mal Beatmen.',
        ],

        // Verwaltungsarbeitsplatz v1.0
        'Die meisten Unfälle im Verwaltungsbereich ereignen sich durch Stolpern, Ausrutschen und Stürzen. Welche Aussagen sind richtig?': [
            'Verkehrs- und Fluchtwege dürfen nicht als Lagerfläche genutzt werden.',
            'Ich halte Fluchttüren immer frei.',
            'Im Notfall benutze ich Treppenhäuser, statt den Aufzug.',
        ],
        'Was ist beim Thema Flucht- und Rettungswege / Sammelstelle zu beachten?': [
            'Die Vorgesetzten bzw. Sammelplatzverantwortlichen informieren nach der Vollzähligkeitsprüfung über das weitere Vorgehen.',
            'In den Flucht- und Rettungswegeplänen finde ich die Kennzeichnung der Sammelplätze.',
            'Bei einer Evakuierung verlasse ich das Gebäude über den kürzesten Weg (Fluchtwege) und begebe mich dann zum Sammelplatz.',
            'Den Verlauf der Flucht- und Rettungswege erkenne ich anhand der grün beleuchteten Rettungszeichen.',
        ],
        'Was sollten Sie beim Einstellen Ihres Bürostuhls beachten?': [
            'Ober- und Unterarme bilden einen Winkel von rund 90°, wenn die Unterarme eine waagerechte Linie zur Tastatur bilden.',
            'Ober- und Unterschenkel bilden einen Winkel von rund 90°, wenn die Füße ganzflächig auf dem Boden stehen.',
        ],
        'Welche Bedeutung hat dieses Zeichen?': [
            'Sammelstelle für den Notfall',
        ],
        'Wie oft können Sie die Angebotsvorsorge in Anspruch nehmen?': [
            'Einmal in 3 Jahren.',
        ],
        'Wie sieht gesundheitsschonendes Heben und Tragen aus?': [
            'Last in aufrechter Haltung tragen.',
            'Große und längere Last am besten zu zweit anheben und tragen.',
            'Last möglichst nahe am Körper tragen, damit die Wirbelsäule nicht überlastet wird.',
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
