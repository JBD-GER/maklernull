// src/app/(public)/agb/page.tsx

export const metadata = {
  title: 'AGB – Maklernull',
  description:
    'Allgemeine Geschäftsbedingungen (AGB) für die Nutzung des Inseratsservices von Maklernull – keine Maklertätigkeit, keine Erfolgs- oder Haftungsübernahme für Vermarktungserfolg.',
}

export default function AGBPage() {
  return (
    <section className="py-20 px-6 text-text-700">
      <div className="mx-auto max-w-3xl space-y-12">
        <h1 className="text-4xl font-bold text-primary">
          Allgemeine Geschäftsbedingungen (AGB)
        </h1>

        {/* 1. Geltungsbereich */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">1. Geltungsbereich</h2>
          <p>
            Diese Allgemeinen Geschäftsbedingungen (AGB) regeln die Nutzung des
            Inseratsservices „Maklernull“ durch private und gewerbliche Nutzer
            (nachfolgend „Nutzer“). Anbieter des Services ist die Novax Digital
            GmbH (nachfolgend „Anbieter“). Abweichende Geschäftsbedingungen des
            Nutzers finden keine Anwendung, es sei denn, der Anbieter stimmt
            deren Geltung ausdrücklich schriftlich zu.
          </p>
        </div>

        {/* 2. Anbieter und Vertragsparteien */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            2. Anbieter und Vertragsparteien
          </h2>
          <p>
            Vertragspartner des Nutzers ist ausschließlich die Novax Digital
            GmbH als Betreiber von Maklernull. Vertragsbeziehungen hinsichtlich
            eines Kauf-, Miet- oder sonstigen Nutzungsvertrags über eine
            Immobilie kommen ausschließlich zwischen dem Nutzer (z.&nbsp;B.
            Eigentümer) und den jeweiligen Interessenten zustande. Der Anbieter
            wird in diesem Zusammenhang nicht Vertragspartner und ist nicht
            an diesen Verträgen beteiligt.
          </p>
        </div>

        {/* 3. Leistungsgegenstand (Inseratsservice) */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            3. Leistungsgegenstand (Inseratsservice)
          </h2>
          <p>
            Der Anbieter stellt dem Nutzer einen Service zur Verfügung, der ihn
            bei der Erstellung, Aufbereitung und Veröffentlichung von
            Immobilieninseraten auf Drittplattformen (z.&nbsp;B.
            Immobilienscout24, Immowelt, Immonet, Kleinanzeigen) unterstützt.
            Je nach gebuchtem Paket umfasst dies insbesondere:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>Erstellung und/oder Überarbeitung eines Exposés,</li>
            <li>
              Übermittlung der vom Nutzer bereitgestellten Daten und Medien an
              ausgewählte Immobilienportale,
            </li>
            <li>
              technische Weiterleitung von Kontaktanfragen der Portale an den
              Nutzer per E-Mail,
            </li>
            <li>
              optionale Zusatzleistungen wie z.&nbsp;B. Terminkoordinierung,
              Dokumentenprüfung oder Unterstützung bei Texten.
            </li>
          </ul>
          <p>
            Der Anbieter ist nicht Betreiber der genannten Drittportale und hat
            keinen Einfluss auf deren Verfügbarkeit, Darstellung, Reichweite,
            Ranking oder Funktionsumfang.
          </p>
        </div>

        {/* 4. Keine Maklertätigkeit / kein Maklervertrag */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            4. Keine Maklertätigkeit / kein Maklervertrag
          </h2>
          <p>
            Der Anbieter führt <strong>keine Maklertätigkeit</strong> im Sinne
            von §&nbsp;34c Gewerbeordnung (GewO) aus. Insbesondere:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              Der Anbieter schuldet weder den Nachweis noch die Vermittlung
              eines konkreten Käufers oder Mieters.
            </li>
            <li>
              Es kommt kein Maklervertrag zwischen Nutzer und Anbieter zustande.
            </li>
            <li>
              Der Anbieter erhält keine erfolgsabhängige Provision auf den
              Abschluss von Kauf-, Miet- oder sonstigen Verträgen.
            </li>
          </ul>
          <p>
            Sämtliche Entgelte, die der Nutzer an den Anbieter zahlt, sind
            reine Serviceentgelte für die Unterstützung bei der Erstellung und
            Veröffentlichung von Inseraten sowie ggf. vereinbarte
            Zusatzleistungen –{' '}
            <strong>
              nicht für die Herbeiführung eines Vertragsabschlusses
            </strong>
            .
          </p>
        </div>

        {/* 5. Vertragsschluss und Pakete */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            5. Vertragsschluss und Pakete
          </h2>
          <p>
            Der Nutzer kann über die Webseite von Maklernull verschiedene
            einmalige Pakete für Verkauf oder Vermietung einer Immobilie
            buchen. Die auf der Webseite dargestellten Pakete stellen kein
            bindendes Angebot dar, sondern eine Aufforderung zur Abgabe eines
            Angebots durch den Nutzer.
          </p>
          <p>
            Mit Abschluss des Bestellvorgangs gibt der Nutzer ein verbindliches
            Angebot zum Abschluss eines Vertrags über das jeweilige Paket ab.
            Der Vertrag kommt zustande, sobald der Anbieter die Buchung
            ausdrücklich bestätigt (z.&nbsp;B. per E-Mail) oder mit der
            Leistungserbringung beginnt.
          </p>
          <p>
            Die Pakete sind einmalige Leistungen mit begrenzter Laufzeit (z.&nbsp;B.
            1–3 Monate). Eine automatische Verlängerung oder ein Abonnement
            findet nicht statt.
          </p>
        </div>

        {/* 6. Pflichten des Nutzers und Inhalte der Inserate */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            6. Pflichten des Nutzers und Inhalte der Inserate
          </h2>
          <p>
            Der Nutzer ist allein verantwortlich für die inhaltliche Richtigkeit,
            Vollständigkeit und Rechtmäßigkeit aller Angaben und Unterlagen, die
            er dem Anbieter zur Erstellung oder Veröffentlichung von Inseraten zur
            Verfügung stellt (z.&nbsp;B. Flächenangaben, Baujahr, Energiekennwerte,
            Miete, Kaufpreis, Bilder, Grundrisse, Dokumente).
          </p>
          <p>
            Der Nutzer versichert insbesondere, dass:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              er zur Vermarktung der Immobilie rechtlich berechtigt ist
              (z.&nbsp;B. als Eigentümer oder mit entsprechender Vollmacht),
            </li>
            <li>
              keine Rechte Dritter verletzt werden (z.&nbsp;B. Urheberrechte an
              Fotos, Markenrechte, Persönlichkeitsrechte),
            </li>
            <li>
              sämtliche gesetzlich vorgeschriebenen Pflichtangaben (z.&nbsp;B.
              energie- oder verbraucherrechtliche Informationspflichten) korrekt
              und vollständig sind,
            </li>
            <li>
              die Inserate keine rechtswidrigen, diskriminierenden oder
              irreführenden Inhalte enthalten.
            </li>
          </ul>
          <p>
            Der Nutzer stellt den Anbieter von sämtlichen Ansprüchen Dritter
            frei, die gegenüber dem Anbieter im Zusammenhang mit den vom Nutzer
            bereitgestellten Inhalten geltend gemacht werden, einschließlich
            angemessener Rechtsverfolgungskosten.
          </p>
        </div>

        {/* 7. Preise, Zahlungsbedingungen und Laufzeit */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            7. Preise, Zahlungsbedingungen und Laufzeit
          </h2>
          <p>
            Es gelten die jeweils zum Zeitpunkt der Buchung auf der Webseite
            ausgewiesenen Paketpreise. Alle Preise verstehen sich in Euro
            inklusive der gesetzlichen Mehrwertsteuer, sofern nicht ausdrücklich
            anders angegeben.
          </p>
          <p>
            Das Entgelt ist – sofern nicht anders vereinbart – vor
            Veröffentlichung des Inserats fällig. Die Zahlung erfolgt über die
            angebotenen Zahlungsmethoden. Ein Anspruch auf Rückerstattung des
            Paketpreises besteht nach Beginn der Leistungserbringung grundsätzlich
            nicht, insbesondere nicht bei ausbleibenden oder geringeren
            Anfragen als erwartet.
          </p>
          <p>
            Die Laufzeit des gebuchten Pakets ergibt sich aus der
            Paketbeschreibung. Nach Ablauf der vereinbarten Laufzeit endet der
            Vertrag automatisch, ohne dass es einer Kündigung bedarf.
          </p>
        </div>

        {/* 8. Verfügbarkeit, Drittportale und kein Erfolg */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            8. Verfügbarkeit, Drittportale und kein Erfolg
          </h2>
          <p>
            Der Anbieter schuldet ausschließlich die vereinbarten
            Serviceleistungen (z.&nbsp;B. Erstellung/Übermittlung des Inserats).
            Der Anbieter schuldet ausdrücklich{' '}
            <strong>keinen Erfolg</strong> im Sinne einer bestimmten Anzahl von
            Anfragen, Besichtigungen oder dem Abschluss eines Kauf- oder
            Mietvertrags.
          </p>
          <p>
            Für Ausfälle, Störungen, Sperrungen oder Änderungen der
            Drittportale (z.&nbsp;B. technische Probleme, Wartungsarbeiten,
            Anpassung von Kategorien oder Reichweite) übernimmt der Anbieter
            keine Haftung. Der Anbieter hat keinen Einfluss auf die
            Platzierung, Sichtbarkeit oder das Ranking der Inserate auf den
            Portalen.
          </p>
        </div>

        {/* 9. Haftung */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">9. Haftung</h2>
          <p>
            Der Anbieter haftet unbeschränkt für Schäden aus der Verletzung des
            Lebens, des Körpers oder der Gesundheit, die auf einer
            Pflichtverletzung des Anbieters, eines gesetzlichen Vertreters oder
            Erfüllungsgehilfen beruhen, sowie für Schäden, die durch Vorsatz oder
            grobe Fahrlässigkeit verursacht wurden.
          </p>
          <p>
            Bei leicht fahrlässiger Verletzung wesentlicher Vertragspflichten
            (Kardinalpflichten) ist die Haftung des Anbieters auf den
            vertragstypischen, vorhersehbaren Schaden begrenzt. Wesentliche
            Vertragspflichten sind solche, deren Erfüllung die ordnungsgemäße
            Durchführung des Vertrags überhaupt erst ermöglicht und auf deren
            Einhaltung der Nutzer regelmäßig vertrauen darf.
          </p>
          <p>
            Eine weitergehende Haftung für einfache Fahrlässigkeit ist
            ausgeschlossen. Der Anbieter haftet insbesondere nicht für:
          </p>
          <ul className="ml-5 list-disc space-y-1">
            <li>
              ausbleibende Kauf- oder Mietverträge, entgangenen Gewinn oder
              sonstige Vermögensschäden,
            </li>
            <li>
              Schäden aufgrund fehlerhafter, unvollständiger oder
              rechtswidriger Angaben des Nutzers,
            </li>
            <li>
              Störungen oder Ausfälle der Drittportale oder der dortigen
              Infrastruktur.
            </li>
          </ul>
        </div>

        {/* 10. Keine Rechts-, Steuer- oder Anlageberatung */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">
            10. Keine Rechts-, Steuer- oder Anlageberatung
          </h2>
          <p>
            Im Rahmen von Maklernull werden keinerlei individuelle Rechts-, Steuer-,
            Anlage- oder sonstige Beratungsleistungen erbracht. Hinweise, Texte,
            Formulierungsvorschläge oder Dokumente, die der Anbieter bereitstellt,
            dienen ausschließlich der allgemeinen Unterstützung und ersetzen
            keine Beratung durch Rechtsanwälte, Steuerberater oder andere
            Berufsgruppen.
          </p>
          <p>
            Der Nutzer ist selbst dafür verantwortlich, bei Bedarf
            eigenständige rechtliche, steuerliche oder finanzielle Beratung in
            Anspruch zu nehmen.
          </p>
        </div>

        {/* 11. Datenschutz */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">11. Datenschutz</h2>
          <p>
            Der Umgang mit personenbezogenen Daten richtet sich nach der auf
            der Webseite bereitgestellten Datenschutzerklärung. Diese ist
            nicht Bestandteil dieser AGB, ergänzt diese jedoch in Bezug auf die
            Datenverarbeitung. Der Nutzer ist verpflichtet, die
            Datenschutzerklärung zur Kenntnis zu nehmen.
          </p>
        </div>

        {/* 12. Schlussbestimmungen */}
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">12. Schlussbestimmungen</h2>
          <p>
            Es gilt das Recht der Bundesrepublik Deutschland unter Ausschluss
            des UN-Kaufrechts. Ist der Nutzer Kaufmann, eine juristische Person
            des öffentlichen Rechts oder ein öffentlich-rechtliches
            Sondervermögen, ist ausschließlicher Gerichtsstand für alle
            Streitigkeiten aus und im Zusammenhang mit diesem Vertrag der Sitz
            des Anbieters (derzeit Hannover).
          </p>
          <p>
            Sollten einzelne Bestimmungen dieser AGB ganz oder teilweise
            unwirksam sein oder werden, bleibt die Wirksamkeit der übrigen
            Bestimmungen unberührt. Anstelle der unwirksamen Bestimmung gilt
            diejenige wirksame Regelung als vereinbart, die dem wirtschaftlichen
            Zweck der unwirksamen Bestimmung am nächsten kommt.
          </p>
        </div>
      </div>
    </section>
  )
}
