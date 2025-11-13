import GlobalCTA from './GlobalCTA'
import Link from 'next/link'
import Image from 'next/image'
import { PhoneIcon, EnvelopeIcon, GlobeAltIcon } from '@heroicons/react/24/outline'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <>
      <GlobalCTA />

      <footer className="relative mt-16 pb-6 max-w-[100vw] overflow-x-hidden">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {/* Brand */}
            <div className="rounded-2xl border border-white/70 bg-white/80 p-5 backdrop-blur-xl ring-1 ring-white/70 shadow-[0_2px_10px_rgba(2,6,23,0.04)]">
              <div className="-mt-0.5 mb-1">
                <Image
                  src="/logo.png"
                  alt="Maklernull"
                  width={120}
                  height={32}
                  className="h-auto w-auto max-w-[160px] object-contain"
                  priority
                />
              </div>
              <p className="mt-1 text-sm leading-relaxed text-slate-700">
                Maklernull unterstützt Sie beim Verkauf und bei der Vermietung Ihrer
                Immobilie – mit Inseraten auf führenden Portalen, Exposé-Erstellung,
                geprüften Anfragen und persönlicher Betreuung, ganz ohne Maklerprovision.
              </p>
            </div>

            {/* Navigation */}
            <div className="rounded-2xl border border-white/70 bg-white/80 p-5 backdrop-blur-xl ring-1 ring-white/70 shadow-[0_2px_10px_rgba(2,6,23,0.04)]">
              <h4 className="text-sm font-semibold text-slate-900">Navigation</h4>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li>
                  <Link href="/" className="text-slate-700 hover:text-slate-900">
                    Startseite
                  </Link>
                </li>
                <li>
                  <Link href="/funktionen" className="text-slate-700 hover:text-slate-900">
                    Leistungen
                  </Link>
                </li>
                <li>
                  <Link href="/preis" className="text-slate-700 hover:text-slate-900">
                    Preise &amp; Pakete
                  </Link>
                </li>
                <li>
                  <Link href="/docs" className="text-slate-700 hover:text-slate-900">
                    Hilfe &amp; Dokumentation
                  </Link>
                </li>
                <li>
                  <Link href="/support" className="text-slate-700 hover:text-slate-900">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            {/* Kontakt */}
            <div className="rounded-2xl border border-white/70 bg-white/80 p-5 backdrop-blur-xl ring-1 ring-white/70 shadow-[0_2px_10px_rgba(2,6,23,0.04)]">
              <h4 className="text-sm font-semibold text-slate-900">Kontakt</h4>
              <ul className="mt-2 space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2">
                  <PhoneIcon className="h-5 w-5 text-slate-400" />
                  <a
                    href="tel:+4950353169999"
                    className="hover:text-slate-900"
                  >
                    +49 5035 3169999
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <EnvelopeIcon className="h-5 w-5 text-slate-400" />
                  <a
                    href="mailto:hey@maklernull.de"
                    className="hover:text-slate-900"
                  >
                    hey@maklernull.de
                  </a>
                </li>
                <li className="flex items-center gap-2">
                  <GlobeAltIcon className="h-5 w-5 text-slate-400" />
                  <a
                    href="https://www.maklernull.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-slate-900"
                  >
                    www.maklernull.de
                  </a>
                </li>
              </ul>
            </div>

            {/* Rechtliches */}
            <div className="rounded-2xl border border-white/70 bg-white/80 p-5 backdrop-blur-xl ring-1 ring-white/70 shadow-[0_2px_10px_rgba(2,6,23,0.04)]">
              <h4 className="text-sm font-semibold text-slate-900">Rechtliches</h4>
              <ul className="mt-2 space-y-1.5 text-sm">
                <li>
                  <Link href="/impressum" className="text-slate-700 hover:text-slate-900">
                    Impressum
                  </Link>
                </li>
                <li>
                  <Link href="/datenschutz" className="text-slate-700 hover:text-slate-900">
                    Datenschutz
                  </Link>
                </li>
                <li>
                  <Link href="/agb" className="text-slate-700 hover:text-slate-900">
                    AGB
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-6 flex flex-col gap-2 rounded-2xl border border-white/70 bg-white/80 px-4 py-3.5 text-xs text-slate-500 shadow-[0_1px_6px_rgba(2,6,23,0.03)] backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:text-sm">
            <p>© {year} Maklernull. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
