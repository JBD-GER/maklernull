// src/app/(public)/preis/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckIcon } from '@heroicons/react/24/outline'
import PriceTabs from './PriceTabs'

/* ----------------------------- Site/SEO ----------------------------- */
const SITE_NAME = 'Maklernull'
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://maklernull.de'
const PRIMARY = '#0a1b40'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Preise & Pakete – Maklernull',
    template: '%s | Maklernull',
  },
  description:
    'Maklernull bietet einmalige Pakete für Verkauf und Vermietung: Inserierung auf führenden Portalen, Exposé-Erstellung, Kontaktanfragen und persönliche Betreuung – ohne Abo, ohne Verlängerung.',
  alternates: { canonical: `${SITE_URL}/preis` },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/preis`,
    siteName: SITE_NAME,
    title: 'Preise & Pakete – Maklernull',
    description:
      'Einmalige Pakete für Verkauf & Vermietung Ihrer Immobilie. Inserierung auf mehreren Portalen, Kontaktanfragen, Prüfung und persönliche Unterstützung – ohne Abo, ohne Verlängerung.',
    images: [
      {
        url: `${SITE_URL}/og/og-price.jpg`,
        width: 1200,
        height: 630,
        alt: 'Preise & Pakete – Maklernull',
      },
    ],
    locale: 'de_DE',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preise & Pakete – Maklernull',
    description:
      'Verkauf oder Vermietung: Wählen Sie das Paket, das zu Ihnen passt – mit Inserierung auf Portalen, Exposé und Kontaktanfragen-Verwaltung.',
    images: [`${SITE_URL}/og/og-price.jpg`],
  },
  robots: { index: true, follow: true },
}

/* ----------------------------- JSON-LD ------------------------------ */
function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Maklernull – Inseratsservice für Immobilien',
    url: `${SITE_URL}/preis`,
    image: `${SITE_URL}/og/og-price.jpg`,
    description:
      'Maklernull unterstützt private Eigentümer beim Verkauf und der Vermietung von Immobilien – mit Inserierung auf mehreren Portalen, Exposé-Erstellung, Kontaktanfragen und persönlicher Betreuung.',
    areaServed: 'DE',
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  }
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

/* ----------------------------- Hilfsdaten ------------------------------ */

const laufzeitenVerkauf = [
  { name: 'VK-Basis', one: '249 €', two: '299 €', three: '349 €' },
  { name: 'VK-Premium', one: '399 €', two: '499 €', three: '599 €' },
  { name: 'VK-Top', one: '299 €', two: '349 €', three: '399 €' },
]

const laufzeitenVermietung = [
  { name: 'VM-Basis', one: '199 €', two: '249 €', three: '299 €' },
  { name: 'VM-Premium', one: '349 €', two: '449 €', three: '549 €' },
  { name: 'VM-Top', one: '249 €', two: '299 €', three: '349 €' },
]

const leistungsMerkmale = [
  {
    title: 'Inserierung auf allen vier Portalen',
    text: 'Wir inserieren auf Immobilienscout24, Immowelt, Immonet und eBay Kleinanzeigen, die wir für die leistungsstärksten Portale halten.',
  },
  {
    title: 'Erstellung eines Exposés',
    text: 'Wir stellen Ihnen ein individuelles und hochwertiges Exposé zur Verfügung, das Sie jederzeit vorlegen und nutzen können.',
  },
  {
    title: 'Autom. Anfragenweiterleitung',
    text: 'Zunächst erhalten Sie alle Weiterleitungen samt der uns bekannten Kontaktdaten der Anfrage per E-Mail. Anschließend sind Sie gefragt.',
  },
  {
    title: 'Aktiver Kundensupport',
    text: 'Benötigen Sie Hilfe? Sie können uns Mo.–Fr. von 09:00 bis 18:00 Uhr unter 05035 3169999 erreichen. Wir freuen uns auf Sie.',
  },
  {
    title: 'KI-erstellte Texte (Beta)',
    text: 'Bei uns müssen Sie keine eigenen Texte erstellen. Wir übernehmen das für Sie und können diese auch nachträglich korrigieren.',
  },
  {
    title: 'Prüfung Baufinanzierung (Verkauf)',
    text: 'Gemäß § 34i Abs. 1 GewO sind wir offizielle Immobiliendarlehensvermittler und überprüfen kostenlos die finanzielle Machbarkeit des Käufers.',
  },
  {
    title: 'Geprüfte Anfragen',
    text: 'Jede Anfrage wird von uns händisch geprüft. Nach korrekter Beantwortung der Fragen leiten wir sie per E-Mail an Sie weiter.',
  },
  {
    title: 'Terminkoordinierung',
    text: 'Möchten Sie die geprüfte Anfrage persönlich kennenlernen? Wir koordinieren gerne einen Termin für eine Besichtigung.',
  },
  {
    title: 'Individuelle Fragen für Anfragen',
    text: 'Sie können uns individuelle Fragen nennen, die Ihnen besonders wichtig sind. Wir nehmen diese in den Anfrageprozess auf.',
  },
  {
    title: 'Dokumentenprüfung',
    text: 'Wir prüfen alle Dokumente von Ihnen und denen des Käufers/Mieters. Nutzen Sie dafür bequem unsere Seite zum Hochladen von Dokumenten.',
  },
  {
    title: 'Immobilienbewertung (Verkauf)',
    text: 'Mit unseren branchenspezifischen Kenntnissen und Tools ermitteln wir einen Kaufpreis, der zum aktuellen Markt passt.',
  },
  {
    title: 'Aktualisierung der Anzeige',
    text: 'Sie können uns jederzeit Änderungswünsche mitteilen – z. B. Preisreduzierungen. Wir passen die Anzeigen für Sie an.',
  },
  {
    title: 'Persönlicher Ansprechpartner',
    text: 'Wir weisen Ihnen einen Profi mit direkter Durchwahl zu, um eine schnelle Kommunikation und Betreuung zu gewährleisten.',
  },
  {
    title: 'Anzeigenoptimierung',
    text: 'Wir erstellen Ihr Inserat, als wäre es von einem Immobilienmakler. Alle Inhalte werden auf eine schnelle Vermarktung ausgerichtet.',
  },
]

const vermietungsErgaenzung = [
  {
    title: 'Digitale Mietvertragserstellung',
    text: 'Sie erhalten Zugang zu einem Mietvertragstool, das Ihnen beim Abschluss hilft und den Prozess strukturiert.',
  },
  {
    title: 'Mietpreisprüfung',
    text: 'Wir überprüfen Ihren vorgeschlagenen Mietpreis anhand des aktuellen Marktes, um zu günstige Vermietungen zu vermeiden.',
  },
]

const faqs = [
  {
    q: 'Kann ich mein Paket vor der Veröffentlichung stornieren?',
    a: 'Ja. Die Berechnung des individuellen Paketpreises erfolgt erst kurz vor der Veröffentlichung. Wenn Sie vorher stornieren, wird keine Gebühr berechnet.',
  },
  {
    q: 'Ist eine Kündigung innerhalb der Laufzeit möglich?',
    a: 'Da es sich um einmalige Pakete mit fester Laufzeit handelt, gibt es keine klassische Kündigung. Nach Ablauf der gewählten Dauer endet das Paket automatisch.',
  },
  {
    q: 'Wie erfolgt die Bezahlung?',
    a: 'Die Bezahlung erfolgt bequem nach individueller Preisberechnung, bevor Ihre Immobilie veröffentlicht wird. Details klären wir transparent im Prozess.',
  },
  {
    q: 'Welche Fragen stellen Sie bei der Prüfung?',
    a: 'Wir stellen gezielte Fragen zu Bonität, Motivation und Rahmenbedingungen (z. B. Einzugstermin), um die Anfrage für Sie bestmöglich vorzuqualifizieren.',
  },
]

/* ----------------------------- Page ------------------------------ */

export default function PricePage() {
  return (
    <>
      <JsonLd />

      {/* Animations-Utilities */}
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes floatSlow {
              0% { transform: translate3d(0,0,0) scale(1); opacity:.55 }
              50%{ transform: translate3d(12px,10px,0) scale(1.02); opacity:.65 }
              100%{ transform: translate3d(0,0,0) scale(1); opacity:.55 }
            }
            @keyframes floatSlow2 {
              0% { transform: translate3d(0,0,0) scale(1); opacity:.45 }
              50%{ transform: translate3d(-14px,8px,0) scale(1.03); opacity:.6 }
              100%{ transform: translate3d(0,0,0) scale(1); opacity:.45 }
            }
          `,
        }}
      />

      <div className="space-y-20">
        {/* HERO + TABS */}
        <section className="relative">
          {/* weicher Hintergrund */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[-28vh] -z-10 h-[130vh] w-[180vw] -translate-x-1/2"
            style={{
              background:
                'radial-gradient(1200px 480px at 50% 0%, rgba(10,27,64,0.06), transparent),' +
                'radial-gradient(900px 420px at 12% 10%, rgba(10,27,64,0.04), transparent),' +
                'radial-gradient(900px 420px at 88% 8%, rgba(10,27,64,0.04), transparent)',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-[-10vw] top-[-2vh] -z-10 h-[38rem] w-[38rem] rounded-full"
            style={{
              background:
                'radial-gradient(closest-side, rgba(10,27,64,.18), rgba(10,27,64,0))',
              filter: 'blur(26px)',
              animation: 'floatSlow 11s ease-in-out infinite',
            }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-[-8vw] top-[4vh] -z-10 h-[42rem] w-[42rem] rounded-full"
            style={{
              background:
                'radial-gradient(closest-side, rgba(10,27,64,.16), rgba(10,27,64,0))',
              filter: 'blur(28px)',
              animation: 'floatSlow2 13s ease-in-out infinite',
            }}
          />

          <div className="relative mx-auto max-w-6xl px-6 pt-10 pb-8 sm:pt-14 sm:pb-12">
            <div className="rounded-3xl border border-white/70 bg-white/82 p-8 text-center shadow-[0_20px_50px_rgba(2,6,23,0.06),0_2px_10px_rgba(2,6,23,0.04)] backdrop-blur-2xl ring-1 ring-white/70 sm:p-12">
              {/* Badge */}
              <div className="mx-auto mb-3 inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white/92 px-3 py-1 text-[11px] font-semibold text-slate-900 ring-1 ring-white/80 backdrop-blur">
                <span
                  className="rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-white"
                  style={{ backgroundColor: PRIMARY }}
                >
                  Verkauf & Vermietung
                </span>
                <span>Einmalige Pakete – kein Abo, keine Verlängerung</span>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                Preise & Pakete für Ihre Immobilie.
              </h1>
              <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-slate-700">
                Wählen Sie, ob Sie verkaufen oder vermieten möchten – und entscheiden Sie
                sich anschließend für das Paket, das am besten zu Ihrer Situation passt.
                Alle Pakete sind einmalig, inklusive Mehrwertsteuer und ohne automatische
                Verlängerung.
              </p>

              <p className="mt-3 text-[11px] text-slate-500">
                Dauer je nach Paket: in der Regel <strong>1–3 Monate</strong>. Danach
                endet das Paket automatisch.
              </p>
            </div>

            {/* TABS + KARTEN */}
            <div className="mt-8">
              <PriceTabs />
            </div>
          </div>

          <div className="h-6" />
        </section>

        {/* Alle Preise auf einen Blick */}
        <section id="preise-uebersicht" className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_18px_50px_rgba(2,6,23,0.06)] backdrop-blur-xl ring-1 ring-white/70 sm:p-8">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-slate-900">
              Alle Preise auf einen Blick
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
              Wir sind uns bewusst, dass unsere Preise im Vergleich zu direkten
              Marktteilnehmern höher sein können. Dafür bieten wir Ihnen ein deutlich
              umfangreicheres Serviceniveau und einen intensiveren persönlichen Kontakt.
              Alle Preise verstehen sich <strong>inklusive Mehrwertsteuer</strong>.
            </p>

            {/* Verkauf */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Verkauf
              </h3>
              <div className="mt-2 overflow-hidden rounded-2xl border border-white/70 bg-white/90 text-sm text-slate-800 ring-1 ring-white/70">
                <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/80 px-4 py-2 font-semibold">
                  <span>Paket</span>
                  <span>1 Monat</span>
                  <span>2 Monate</span>
                  <span>3 Monate</span>
                </div>
                {laufzeitenVerkauf.map((p) => (
                  <div
                    key={p.name}
                    className="grid grid-cols-4 border-t border-slate-100 px-4 py-2"
                  >
                    <span className="font-medium text-slate-900">{p.name}</span>
                    <span>{p.one}</span>
                    <span>{p.two}</span>
                    <span>{p.three}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Vermietung */}
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Vermietung
              </h3>
              <div className="mt-2 overflow-hidden rounded-2xl border border-white/70 bg-white/90 text-sm text-slate-800 ring-1 ring-white/70">
                <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/80 px-4 py-2 font-semibold">
                  <span>Paket</span>
                  <span>1 Monat</span>
                  <span>2 Monate</span>
                  <span>3 Monate</span>
                </div>
                {laufzeitenVermietung.map((p) => (
                  <div
                    key={p.name}
                    className="grid grid-cols-4 border-t border-slate-100 px-4 py-2"
                  >
                    <span className="font-medium text-slate-900">{p.name}</span>
                    <span>{p.one}</span>
                    <span>{p.two}</span>
                    <span>{p.three}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Im Formular können Sie eine fixierte Laufzeit festlegen. Nach Ablauf dieser
              Zeit müssen Sie das Paket erneut buchen, wenn Sie die Immobilie weiter
              inserieren möchten.
            </p>
          </div>
        </section>

        {/* ALLE LEISTUNGEN IN EINER BOX */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-3xl border border-white/70 bg-white/82 p-6 shadow-[0_18px_50px_rgba(2,6,23,0.08)] backdrop-blur-xl ring-1 ring-white/70 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-slate-900">
                  Leistungen im Detail
                </h2>
                <p className="mt-1 text-xs text-slate-600">
                  Hier sehen Sie alle Leistungen, die – je nach Paket – beim Verkauf oder
                  bei der Vermietung Ihrer Immobilie enthalten sind.
                </p>
              </div>
              <span className="inline-flex items-center justify-center rounded-full border border-white/70 bg-white/90 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-700 ring-1 ring-white/70">
                Transparente Leistungsübersicht
              </span>
            </div>

            {/* Allgemeine Leistungen */}
            <div className="mt-5">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Leistungen für Verkauf & Vermietung
              </div>
              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                {leistungsMerkmale.map((item) => (
                  <div
                    key={item.title}
                    className="flex h-full flex-col rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.05)]"
                  >
                    <div
                      className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

            {/* Spezielle Vermietungs-Leistungen */}
            <div className="mt-2">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Zusätzliche Leistungen bei Vermietung
                </div>
                <span className="rounded-full bg-slate-900 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                  Vermietung
                </span>
              </div>

              <div className="mt-3 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                {vermietungsErgaenzung.map((item) => (
                  <div
                    key={item.title}
                    className="flex h-full flex-col rounded-2xl border border-white/80 bg-white/95 p-4 shadow-[0_10px_26px_rgba(15,23,42,0.05)]"
                  >
                    <div
                      className="mb-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-white"
                      style={{ backgroundColor: PRIMARY }}
                    >
                      <CheckIcon className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-700">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-slate-50/80 p-4 text-xs text-slate-700 ring-1 ring-white/80">
                <p>
                  Sie haben Fragen, welche Leistungen für Ihre Vermietung sinnvoll sind?
                  Rufen Sie uns gerne an unter{' '}
                  <a
                    href="tel:+4950353169999"
                    className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2"
                  >
                    05035 3169999
                  </a>{' '}
                  oder schreiben Sie uns.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Häufigste Fragen zu den Paketen
          </h2>
          <p className="mt-2 text-sm text-slate-700">
            Sie finden Ihre Frage nicht? Kontaktieren Sie uns gerne unter{' '}
            <a
              href="tel:+4950353169999"
              className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-2"
            >
              05035 3169999
            </a>
            .
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-white/70 bg-white/82 backdrop-blur-xl ring-1 ring-white/70 open:shadow-[0_10px_34px_rgba(2,6,23,0.07)]"
              >
                <summary className="cursor-pointer list-none rounded-2xl p-5 text-left">
                  <div className="text-base font-medium text-slate-900">{f.q}</div>
                  <div className="mt-1 hidden text-sm text-slate-700 group-open:block">
                    {f.a}
                  </div>
                </summary>
                <div className="px-5 pb-5 pt-0 text-sm text-slate-700 sm:hidden">
                  {f.a}
                </div>
              </details>
            ))}
          </div>

          <p className="mt-8 text-sm leading-relaxed text-slate-600">
            Wenn Sie unsicher sind, welches Paket oder welche Laufzeit für Ihre
            Immobilie sinnvoll ist, sprechen Sie uns gerne an. Gemeinsam finden wir die
            Variante, die zu Ihrer Situation passt.
          </p>
        </section>
      </div>
    </>
  )
}
