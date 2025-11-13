// src/app/(public)/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

/* ----------------------------- Site Constants ----------------------------- */
const SITE_NAME = 'Maklernull'
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://www.maklernull.de'

// Primärfarbe in deinem Stil (wie der "Startseite"-Chip)
const PRIMARY = '#0a1b40'
// Glow-Blau
const DEEP_BLUE_GLARE = 'rgba(10,27,64,0.25)'

/* --------------------------------- SEO ----------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Immobilie verkaufen & vermieten ohne Makler – Maklernull.de',
    template: '%s | Maklernull.de',
  },
  description:
    'Immobilie verkaufen & vermieten ohne Makler: einmal inserieren, auf allen wichtigen Immobilienportalen gleichzeitig veröffentlichen. Kein Abo, keine Provision, persönliche Betreuung.',
  keywords: [
    'Immobilie verkaufen ohne Makler',
    'Immobilie vermieten ohne Makler',
    'Immobilie inserieren ohne Makler',
    'auf allen Portalen inserieren',
    'ImmobilienScout24 ohne Makler',
    'ImmoWelt ohne Makler',
    'eBay Kleinanzeigen Immobilie',
    'Maklernull',
  ],
  category: 'real_estate',
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Immobilie verkaufen & vermieten ohne Makler – Maklernull.de',
    description:
      'Ein Preis für alle Portale, kein Abo, keine Maklerprovision: Maklernull.de veröffentlicht Ihr Inserat auf den wichtigsten Immobilienportalen in Deutschland.',
    images: [
      {
        url: `${SITE_URL}/og/og-home.jpg`,
        width: 1200,
        height: 630,
        alt: 'Maklernull.de – Immobilie ohne Makler auf allen Portalen inserieren',
      },
    ],
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Immobilie verkaufen & vermieten ohne Makler – Maklernull.de',
    description:
      'Einmal Inserat anlegen – wir übernehmen die Veröffentlichung auf allen Portalen. Kein Abo, kein Maklervertrag.',
    images: [`${SITE_URL}/og/og-home.jpg`],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
}

/* ----------------------------- JSON-LD Schema ----------------------------- */
function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'Maklernull.de',
        url: SITE_URL,
        logo: `${SITE_URL}/favi.png`,
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        url: SITE_URL,
        name: 'Maklernull.de',
        publisher: { '@id': `${SITE_URL}#organization` },
        inLanguage: 'de-DE',
      },
      {
        '@type': 'Service',
        '@id': `${SITE_URL}#service`,
        name: 'Immobilien-Inserat auf allen Portalen ohne Makler',
        provider: { '@id': `${SITE_URL}#organization` },
        areaServed: {
          '@type': 'Country',
          name: 'Deutschland',
        },
        description:
          'Mit Maklernull.de inserieren Eigentümer ihre Immobilie ohne Makler gleichzeitig auf verschiedenen Immobilienportalen – mit persönlicher Betreuung, ohne Abo.',
        offers: [
          {
            '@type': 'Offer',
            price: '249.00',
            priceCurrency: 'EUR',
            description: 'Verkaufspaket ab 249 € inkl. MwSt.',
          },
          {
            '@type': 'Offer',
            price: '199.00',
            priceCurrency: 'EUR',
            description: 'Vermietungspaket ab 199 € inkl. MwSt.',
          },
        ],
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/* ------------------------ Portal Animation Card -------------------------- */
function PortalAnimationCard() {
  const DEEP_BLUE_GLARE = 'rgba(10,27,64,.25)'

  return (
    <div className="w-full mx-auto max-w-md lg:max-w-xl">
      <div
        className="relative overflow-hidden rounded-[32px] border px-4 py-6 shadow-[0_30px_120px_rgba(15,23,42,0.9)] sm:px-6 sm:py-7"
        style={{
          borderColor: 'rgba(148,163,253,0.25)',
          background: `radial-gradient(circle at top, ${DEEP_BLUE_GLARE}, rgba(15,23,42,1))`,
        }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute -top-32 right-[-60px] h-52 w-52 rounded-full opacity-40"
          style={{
            background:
              'radial-gradient(circle, rgba(10,27,64,0.7), transparent)',
          }}
        />

        {/* Hub oben (liegt jetzt VOR den Linien) */}
        <div
          className="relative z-10 mx-auto max-w-[360px] rounded-full px-7 py-3.5 text-center shadow-[0_0_40px_rgba(10,27,64,0.9)]"
          style={{
            border: '1px solid rgba(148,163,253,0.7)',
            background:
              'radial-gradient(circle at top, rgba(10,27,64,0.9), rgba(15,23,42,1))',
          }}
        >
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-100/80">
            Ihr Inserat
          </div>
          <div className="text-base font-semibold text-white sm:text-lg">
            Maklernull.de
          </div>
          <p className="mt-1 text-[11px] text-slate-100/80">
            Einmal anlegen – wir verteilen Ihr Inserat auf alle angebundenen
            Portale.
          </p>
        </div>

        {/* Linien + Logos (eine Ebene dahinter) */}
        <div className="relative z-0 mx-auto mt-6 flex max-w-md flex-col items-center">
          <div className="portal-lines-wrapper grid w-full max-w-md grid-cols-1 gap-6 sm:max-w-none sm:grid-cols-3">
            {/* Scout */}
            <div className="portal-col">
              <div className="portal-line" />
              <div className="portal-logo-card">
                <div className="portal-logo-inner">
                  <Image
                    src="/immobilienscout.png"
                    alt="ImmobilienScout24"
                    width={120}
                    height={32}
                    className="portal-logo-img"
                    priority
                  />
                </div>
              </div>
              <p className="mt-1 text-center text-[11px] text-slate-300">
                ImmobilienScout24
              </p>
            </div>

            {/* ImmoWelt */}
            <div className="portal-col">
              <div className="portal-line" />
              <div className="portal-logo-card">
                <div className="portal-logo-inner">
                  <Image
                    src="/Immowelt.png"
                    alt="ImmoWelt"
                    width={120}
                    height={32}
                    className="portal-logo-img"
                  />
                </div>
              </div>
              <p className="mt-1 text-center text-[11px] text-slate-300">
                ImmoWelt
              </p>
            </div>

            {/* Kleinanzeigen */}
            <div className="portal-col">
              <div className="portal-line" />
              <div className="portal-logo-card">
                <div className="portal-logo-inner">
                  <Image
                    src="/kleinanzeigen.png"
                    alt="eBay Kleinanzeigen"
                    width={120}
                    height={32}
                    className="portal-logo-img translate-y-[-1px]"
                  />
                </div>
              </div>
              <p className="mt-1 text-center text-[11px] text-slate-300">
                eBay Kleinanzeigen
              </p>
            </div>
          </div>
        </div>

        <style>{`
          .portal-col {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .portal-lines-wrapper {
            margin-top: 4px;
          }

          .portal-line {
            position: relative;
            width: 2px;
            height: 110px;
            margin-top: -40px;
            overflow: hidden;
            border-radius: 999px;
            background: linear-gradient(
              to bottom,
              rgba(15,23,42,1),
              rgba(10,27,64,0.9),
              rgba(15,23,42,1)
            );
          }

          .portal-line::before {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(
              to top,
              rgba(10,27,64,0),
              rgba(191,219,254,1),
              rgba(10,27,64,0)
            );
            transform: translateY(100%);
            animation: portalPulse 2.3s linear infinite;
          }

          @keyframes portalPulse {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }
            20% {
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            100% {
              transform: translateY(-100%);
              opacity: 0;
            }
          }

          .portal-logo-card {
            border-radius: 999px;
            background: radial-gradient(circle at top, #020617, #000);
            padding: 2px;
            box-shadow:
              0 10px 26px rgba(15,23,42,0.9),
              0 0 0 1px rgba(15,23,42,1);
          }

          .portal-logo-inner {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 999px;
            background: #ffffff;
            padding: 5px 12px;
            width: 130px;
            height: 42px;
          }

          .portal-logo-img {
            height: 24px;
            width: auto;
          }

          @media (max-width: 640px) {
            .portal-line {
              height: 80px;
              margin-top: -34px;
            }

            .portal-logo-inner {
              width: 185px;
              height: 60px;
              padding: 10px 20px;
            }

            .portal-logo-img {
              height: 32px;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .portal-line::before {
              animation: none;
              opacity: 0.3;
            }
          }
        `}</style>
      </div>
    </div>
  )
}


/* ---------------------------------- Page ---------------------------------- */

export default function HomePage() {
  return (
    <>
      <JsonLd />

      {/* HERO --------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top,_#020617_0,_#020617_40%,_#020617_100%)] text-slate-50">
        {/* Farbflächen */}
        <div
          className="absolute inset-0 opacity-80 mix-blend-screen"
          style={{
            backgroundImage:
              'radial-gradient(circle_at_-10%_-10%, rgba(10,27,64,0.45), transparent), radial-gradient(circle_at_110%_-20%, rgba(10,27,64,0.35), transparent)',
          }}
        />

        <div className="relative mx-auto max-w-6xl px-6 pt-14 pb-16 lg:pb-20">
          {/* Badge */}
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-950/80 px-3 py-1 text-[10px] font-medium text-slate-200 ring-1 ring-slate-800/80 backdrop-blur">
            <span className="grid h-5 w-5 place-content-center rounded-full bg-slate-900 text-[9px] font-semibold">
              MN
            </span>
            <span>Immobilie inserieren ohne Makler</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline">
              Ein Preis für alle Portale – kein Abo
            </span>
          </div>

          {/* Content */}
          <div className="mt-8 max-w-3xl">
            <h1 className="text-[30px] font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-[42px]">
              Immobilie verkaufen &amp; vermieten
              <span className="block text-slate-200">
                auf allen Portalen, ganz ohne Makler.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-slate-100/90 sm:text-base">
              Einmal Inserat erfassen – wir kümmern uns um die Veröffentlichung
              auf allen angebundenen Immobilienportalen. Kein Makler, kein Abo,
              keine versteckten Kosten. Sie behalten die volle Kontrolle über
              Verkauf oder Vermietung.
            </p>

            {/* Preise */}
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-slate-200">
              <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 ring-1 ring-slate-700/80">
                Verkauf ab{' '}
                <strong className="ml-1 font-semibold">249 €</strong> inkl.
                MwSt.
              </span>
              <span className="inline-flex items-center rounded-full bg-slate-900/80 px-3 py-1 ring-1 ring-slate-700/80">
                Vermietung ab{' '}
                <strong className="ml-1 font-semibold">199 €</strong> inkl.
                MwSt.
              </span>
            </div>

            {/* CTAs */}
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/preise"
                className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_16px_60px_rgba(0,0,0,0.8)] transition hover:shadow-[0_18px_70px_rgba(0,0,0,1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                style={{ backgroundColor: PRIMARY }}
              >
                Preise erkunden
                <span className="ml-1.5 text-xs">↗</span>
              </Link>
              <Link
                href="/registrieren"
                className="inline-flex items-center justify-center rounded-full border border-slate-500/80 bg-slate-900/70 px-6 py-3 text-sm font-semibold text-slate-100 backdrop-blur transition hover:bg-slate-900 hover:border-slate-300"
              >
                Kostenloses Konto erstellen
              </Link>
            </div>

            {/* kleine Bullets */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-slate-300">
              <span>Kein Abo, keine Vertragsverlängerung</span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span>Kosten erst bei Veröffentlichung</span>
              <span className="hidden sm:inline text-slate-600">•</span>
              <span>Persönliche Betreuung &amp; Terminkoordination</span>
            </div>

            {/* Logos */}
            <div className="mt-8">
              <p className="mb-3 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                Wir veröffentlichen auf bekannten Portalen wie:
              </p>

              {/* mobil: drei Logos in einer Reihe, ab sm: etwas größer */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Scout */}
                <div className="rounded-full bg-white px-3 py-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.7)] ring-1 ring-slate-200">
                  <div className="flex h-8 w-[92px] items-center justify-center sm:h-10 sm:w-[150px]">
                    <Image
                      src="/immobilienscout.png"
                      alt="ImmobilienScout24"
                      width={140}
                      height={40}
                      className="h-5 w-auto sm:h-6"
                    />
                  </div>
                </div>

                {/* ImmoWelt */}
                <div className="rounded-full bg-white px-3 py-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.7)] ring-1 ring-slate-200">
                  <div className="flex h-8 w-[92px] items-center justify-center sm:h-10 sm:w-[150px]">
                    <Image
                      src="/Immowelt.png"
                      alt="ImmoWelt"
                      width={140}
                      height={40}
                      className="h-5 w-auto sm:h-6"
                    />
                  </div>
                </div>

                {/* Kleinanzeigen */}
                <div className="rounded-full bg-white px-3 py-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.7)] ring-1 ring-slate-200">
                  <div className="flex h-8 w-[92px] items-center justify-center sm:h-10 sm:w-[150px]">
                    <Image
                      src="/kleinanzeigen.png"
                      alt="eBay Kleinanzeigen"
                      width={140}
                      height={40}
                      className="h-5 w-auto sm:h-6 translate-y-[-2px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ANIMATION-ABSCHNITT ----------------------------------------------- */}
      <section className=" py-16 text-slate-900">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:gap-16">
          {/* Text links */}
          <div className="max-w-xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
              <span
                className="rounded-full px-2 py-0.5 text-white"
                style={{ backgroundColor: PRIMARY }}
              >
                Portale
              </span>
              <span>Ein Inserat, mehrere Plattformen</span>
            </div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Ihr Inserat – verteilt auf alle relevanten Immobilienportale.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-600">
              Sie pflegen Ihr Inserat einmal bei Maklernull ein – wir kümmern
              uns um die technische Übertragung zu ImmobilienScout24, ImmoWelt
              und eBay Kleinanzeigen. Sie sparen sich Mehrfach-Anlagen,
              unterschiedliche Masken und behalten trotzdem alle Fäden in der
              Hand.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              <li>• Einheitliche Darstellung Ihrer Immobilie auf allen Portalen.</li>
              <li>• Anfragen laufen zentral bei Maklernull ein – kein Portal-Chaos.</li>
              <li>• Kein Maklervertrag, keine Provision, klare Paketpreise.</li>
            </ul>
          </div>

          {/* Animation rechts */}
          <div className="flex-1">
            <PortalAnimationCard />
          </div>
        </div>
      </section>

      {/* ABLAUF ------------------------------------------------------------- */}
      <section className=" py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full  px-3 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
            <span
              className="rounded-full px-2 py-0.5 text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              Ablauf
            </span>
            <span>Von der Kontoeinrichtung bis zur Veröffentlichung</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Klarer Ablauf – Sie behalten jederzeit die Kontrolle.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            Unser Ablauf ist bewusst schlank gehalten: Sie legen Ihr Konto an,
            erfassen die Immobilie in Ruhe und wählen das passende Paket. Wir
            prüfen alles und kümmern uns um die Veröffentlichung auf den
            Portalen.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-4">
            {[
              {
                step: 1,
                title: 'Kostenloses Konto erstellen',
                text: 'Mit wenigen Angaben richten Sie Ihr Konto bei Maklernull ein – unverbindlich und jederzeit löschbar.',
              },
              {
                step: 2,
                title: 'Immobilie inserieren',
                text: 'Sie erfassen alle wichtigen Daten, Bilder und den gewünschten Preis einmalig in Ihrem Zugang.',
              },
              {
                step: 3,
                title: 'Paket auswählen',
                text: 'Sie wählen das passende Verkaufs- oder Vermietungspaket. Erst hier fallen Kosten an.',
              },
              {
                step: 4,
                title: 'Prüfung & Veröffentlichung',
                text: 'Wir prüfen die Angaben, stellen Rückfragen bei Bedarf und veröffentlichen Ihr Inserat auf allen Portalen.',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="flex flex-col rounded-2xl border border-slate-100 bg-white p-5 shadow-sm ring-1 ring-white"
              >
                <div
                  className="mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: PRIMARY }}
                >
                  {item.step}
                </div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{item.text}</p>
              </div>
            ))}
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Gut zu wissen: Bis zur Paketwahl bleiben Sie komplett kostenlos und
            können Ihre Angaben jederzeit speichern und später fortsetzen.
          </p>
        </div>
      </section>

      {/* KOSTENLOS-BIS-VERÖFFENTLICHUNG ------------------------------------ */}
<section className=" py-16">
  <div className="mx-auto max-w-6xl px-6">
    <div className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm sm:p-9">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 sm:text-2xl">
            Kostenfrei bis zur Veröffentlichung.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Sie können Ihr Inserat in Ruhe vorbereiten, zwischenspeichern und bei Bedarf
            anpassen. Erst wenn Sie das Paket auswählen und die Veröffentlichung auslösen,
            entstehen Kosten.
          </p>
        </div>

        {/* Buttons rechts */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end sm:gap-3">
          <Link
            href="/registrieren"
            className="inline-flex items-center justify-center rounded-full px-7 py-3 text-[13px] font-semibold text-white shadow-sm whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
            style={{ backgroundColor: PRIMARY }}
          >
            Jetzt kostenloses Konto erstellen
          </Link>
          <Link
            href="/preise"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-7 py-3 text-[13px] font-semibold text-slate-900 whitespace-nowrap"
          >
            Preise erkunden
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>

{/* BEWERTUNGEN -------------------------------------------------------- */}
<section id="bewertungen" className=" py-16">
  <div className="mx-auto max-w-6xl px-6">
    {/* Header */}
    <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-600 ring-1 ring-slate-200">
          <span
            className="rounded-full px-2 py-0.5 text-white"
            style={{ backgroundColor: PRIMARY }}
          >
            Feedback
          </span>
          <span>Erste Rückmeldungen aus der Betaphase</span>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Die ersten Bewertungen von Eigentümer:innen,
          die unsere Betaphase genutzt haben.
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Alle Rückmeldungen stammen von realen Nutzerinnen und Nutzern,
          die ihre Immobilie in der Betaphase mit Maklernull vorbereitet
          oder veröffentlicht haben – ohne Maklervertrag, ohne Abo.
        </p>
      </div>

      <p className="text-xs text-slate-500">
        Aus Datenschutzgründen nennen wir keine Namen – die Zitate sind
        sinngemäß wiedergegeben.
      </p>
    </div>

    {/* Grid 1–2–3 Spalten (mobil → desktop) */}
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {[
        {
          id: 1,
          tag: 'Wohnungsverkauf',
          title: '„Inserat einmal angelegt, Rest lief im Hintergrund.“',
          text:
            'Ich konnte alle Unterlagen in Ruhe hochladen und musste mich danach kaum noch kümmern. Die Abstimmung mit den Portalen lief über Maklernull – für mich war nur wichtig, Anfragen zu bestätigen.',
          meta: 'Eigentümer:in · Etagenwohnung · Großstadtlage',
          stars: 5,
        },
        {
          id: 2,
          tag: 'Vermietung',
          title: '„Keine Nachrichtenflut mehr aus drei Portalen.“',
          text:
            'Früher habe ich parallel bei mehreren Plattformen inseriert und alles einzeln beantworten müssen. Jetzt kommen die Anfragen gebündelt an einem Ort an und sind besser filterbar.',
          meta: 'Vermieter:in · 3-Zimmer-Wohnung',
          stars: 5,
        },
        {
          id: 3,
          tag: 'Erstverkauf ohne Makler',
          title: '„Gut erklärt, trotz wenig Erfahrung mit Immobilien.“',
          text:
            'Es war mein erster Verkauf und ich wollte keinen Maklervertrag unterschreiben. Die Oberfläche war verständlich, und bei Fragen gab es schnelle Rückmeldungen vom Support.',
          meta: 'Privatperson · Hausverkauf',
          stars: 4.5,
        },
        {
          id: 4,
          tag: 'Zeitersparnis',
          title: '„Texte & Bilder einmal gepflegt statt dreimal kopiert.“',
          text:
            'Besonders hilfreich fand ich, dass Beschreibungstext und Bilder nur einmal eingetragen werden mussten. Die Veröffentlichung auf den Portalen hat dann Maklernull übernommen.',
          meta: 'Mehrfachvermieter:in · mehrere Einheiten',
          stars: 5,
        },
        {
          id: 5,
          tag: 'Kostenkontrolle',
          title: '„Ich wusste schon vorab genau, was es kostet.“',
          text:
            'Keine Paketfallen, keine Verlängerungen – der Preis war von Beginn an klar. Für mich war wichtig, dass ich jederzeit abbrechen kann, solange noch nicht veröffentlicht wurde.',
          meta: 'Eigentümer:in · Reihenhaus',
          stars: 4.5,
        },
        {
          id: 6,
          tag: 'Betaphase',
          title: '„Betazugang genutzt und direkt echte Interessenten gehabt.“',
          text:
            'Obwohl es noch die Betaphase war, kamen schnell qualifizierte Anfragen. Besonders positiv: Anfragen von reinen Maklerakquise-Profilen wurden bereits vorgefiltert.',
          meta: 'Eigentümer:in · Neubauwohnung',
          stars: 5,
        },
      ].map((r) => (
        <article
          key={r.id}
          className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          {/* Sterne + Tag */}
          <div>
            <div className="mb-2 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, i) => {
                  const full = r.stars >= i + 1
                  const half = !full && r.stars > i && r.stars < i + 1
                  return (
                    <span key={i} className="text-sm">
                      {full ? '★' : half ? '☆' : '☆'}
                    </span>
                  )
                })}
                <span className="ml-1 text-[11px] text-slate-400">
                  {r.stars.toString().replace('.', ',')}/5
                </span>
              </div>
              <span
                className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold text-slate-50"
                style={{ backgroundColor: PRIMARY }}
              >
                {r.tag}
              </span>
            </div>

            <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-900">
              {r.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {r.text}
            </p>
          </div>

          <p className="mt-4 text-[11px] text-slate-400">{r.meta}</p>
        </article>
      ))}
    </div>
  </div>
</section>



      {/* VORTEILE ----------------------------------------------------------- */}
      <section className=" py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold text-slate-700 ring-1 ring-slate-200">
            <span
              className="rounded-full px-2 py-0.5 text-white"
              style={{ backgroundColor: PRIMARY }}
            >
              Vorteile
            </span>
            <span>Warum Eigentümer Maklernull nutzen</span>
          </div>

          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Ihre Vorteile mit Maklernull.de
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600">
            Unser Service verbindet die Reichweite der großen Portale mit der
            Unabhängigkeit eines Verkaufs ohne Makler. Sie entscheiden selbst,
            wem Sie antworten – wir bereiten alles vor.
          </p>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Übernahme der Kommunikation
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Keine lästigen Anfragen von Maklern oder unseriösen
                Interessenten. Wir übernehmen den Erstkontakt und prüfen
                Anfragen sorgfältig vor.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Deutlich weniger Zeitaufwand
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Da wir Anfragen vorsortieren und bündeln, konzentrieren Sie sich
                nur auf ernsthafte Interessenten und Besichtigungen – nicht auf
                E-Mail-Chaos.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                Ein Preis, kein Abo, keine Provision
              </h3>
              <p className="mt-2 text-sm text-slate-600">
                Sie zahlen einmal für Ihr Paket und profitieren von der
                gebündelten Reichweite – ohne laufende Gebühren und ohne
                Maklervertrag.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ ---------------------------------------------------------------- */}
      <section className=" py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Wichtige Fragen &amp; schnelle Antworten.
          </h2>
          <p className="mt-2 max-w-3xl text-sm text-slate-600">
            Hier finden Sie eine Übersicht der wichtigsten Fragen. Weitere
            Details zu Paketen und Leistungen erklären wir auf der Preis-Seite.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              {
                q: 'Sind es wirklich echte Anfragen?',
                a: 'Ja. Wir filtern offensichtliche Spam-Anfragen und Maklerwerbung heraus. Sie erhalten nur Anfragen von Interessenten, die sich für Ihre Immobilie gemeldet haben.',
              },
              {
                q: 'Erhalte ich alle Anfragen?',
                a: 'Sie behalten die volle Kontrolle: Alle freigegebenen Anfragen werden in Ihrem Zugang dokumentiert. Sie entscheiden selbst, wem Sie antworten und wen Sie einladen.',
              },
              {
                q: 'Wie lange dauert die Veröffentlichung?',
                a: 'Nach Paketauswahl und erfolgreicher Prüfung wird Ihr Inserat in der Regel innerhalb kurzer Zeit auf den Portalen veröffentlicht – abhängig von den Freigabezeiten der Portale.',
              },
              {
                q: 'Gibt es wirklich kein Abo?',
                a: 'Ja. Sie buchen einmalig ein Paket für Verkauf oder Vermietung. Es gibt keine automatische Vertragsverlängerung und keine versteckten Folgekosten.',
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-2xl border border-slate-100 bg-white p-0 shadow-sm open:shadow-md transition"
              >
                <summary className="cursor-pointer list-none rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 text-slate-400">?</span>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900">
                        {item.q}
                      </div>
                      <div className="mt-1 hidden text-sm text-slate-600 group-open:block">
                        {item.a}
                      </div>
                    </div>
                  </div>
                </summary>
                <div className="px-5 pb-5 pt-0 text-sm text-slate-600 sm:hidden">
                  {item.a}
                </div>
              </details>
            ))}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-slate-600">
            Wenn Sie sich unsicher sind, ob Maklernull zu Ihrer Situation passt,
            können Sie jederzeit unverbindlich ein Konto anlegen und den Ablauf
            testen – ohne Kosten bis zur Veröffentlichung Ihres Inserats.
          </p>
        </div>
      </section>
    </>
  )
}
