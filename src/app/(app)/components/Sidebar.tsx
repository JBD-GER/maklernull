// src/app/(app)/dashboard/Sidebar.tsx
'use client'

import { useEffect, useState, type ComponentType, type SVGProps } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { supabaseClient } from '@/lib/supabase-client'
import {
  HomeIcon,
  PencilSquareIcon,
  BuildingOffice2Icon,
  ChatBubbleLeftRightIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline'

type NavItem = {
  href: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  children?: NavItem[]
}

type SidebarProps = { userEmail: string }

function cls(...arr: Array<string | false | null | undefined>) {
  return arr.filter(Boolean).join(' ')
}

// Hauptnavigation für Eigentümer
const NAV_ITEMS: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: HomeIcon,
  },
  {
    href: '/dashboard/inserieren',
    label: 'Inserieren',
    icon: PencilSquareIcon,
  },
  {
    href: '/dashboard/inserate',
    label: 'Inserate',
    icon: BuildingOffice2Icon,
    children: [
      {
        href: '/dashboard/inserate',
        label: 'Übersicht',
        icon: BuildingOffice2Icon,
      },
      {
        href: '/dashboard/inserate/nachrichten',
        label: 'Nachrichten',
        icon: ChatBubbleLeftRightIcon,
      },
      {
        href: '/dashboard/inserate/termine',
        label: 'Termine',
        icon: CalendarDaysIcon,
      },
    ],
  },
  {
    href: '/dashboard/baufinanzierung',
    label: 'Baufinanzierung',
    icon: BanknotesIcon,
  },
  {
    href: '/dashboard/einstellung',
    label: 'Einstellung',
    icon: Cog6ToothIcon,
    children: [
      {
        href: '/dashboard/einstellung/',
        label: 'Konto',
        icon: Cog6ToothIcon,
      },
      {
        href: '/dashboard/einstellung/buchungen',
        label: 'Buchungen',
        icon: Cog6ToothIcon,
      },
    ],
  },
]

export default function Sidebar({ userEmail }: SidebarProps) {
  const router = useRouter()
  const supabase = supabaseClient()
  const pathname = usePathname()

  const [openGroup, setOpenGroup] = useState<string | null>(null)

  // Helper für aktive States
  const normalize = (p: string) => {
    if (!p) return '/'
    const n = p.replace(/\/+$/, '')
    return n.length ? n : '/'
  }
  const pathNow = normalize(pathname || '/')
  const isExact = (href: string) => pathNow === normalize(href)
  const isDescendant = (href: string) => {
    const base = normalize(href)
    if (base === '/') return pathNow !== '/'
    return pathNow.startsWith(base + '/')
  }

  // Beim Route-Wechsel passende Gruppe automatisch öffnen
  useEffect(() => {
    const group = NAV_ITEMS.find(
      (i) =>
        i.children &&
        (isExact(i.href) ||
          isDescendant(i.href) ||
          i.children!.some((c) => isExact(c.href) || isDescendant(c.href)))
    )
    setOpenGroup(group ? group.href : null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <div
      className="flex h-full flex-col bg-gradient-to-b from-slate-50/90 via-white/90 to-slate-50/80"
      style={{
        backgroundImage:
          'radial-gradient(900px 600px at -20% -10%, rgba(15,23,42,0.06), transparent), radial-gradient(800px 500px at 120% -40%, rgba(88,101,242,0.07), transparent)',
      }}
    >
      {/* Brand */}
      <div className="mb-3 px-4 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative rounded-2xl bg-white/70 px-2 py-1 shadow-sm ring-1 ring-white/60 backdrop-blur-xl">
              <Image
                src="/favi.png"
                alt="Maklernull.de"
                width={26}
                height={26}
                className="h-6 w-6 object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold tracking-tight text-slate-900">
                Maklernull.de
              </span>
              <span className="text-[10px] text-slate-500">
                Dein Vermarktungs-Dashboard
              </span>
            </div>
          </div>
        </div>

        <p className="mt-2 max-w-[220px] truncate text-[10px] text-slate-500">{userEmail}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 pb-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const hasChildren = !!item.children?.length

            if (!hasChildren) {
              const activeExact = isExact(item.href)
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cls(
                      'group flex items-center gap-3 rounded-2xl px-3 py-2 text-sm transition-all border border-transparent',
                      activeExact
                        ? 'bg-white/90 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.10)] ring-1 ring-slate-200'
                        : 'bg-white/0 text-slate-700 hover:bg-white/70 hover:shadow-[0_8px_26px_rgba(15,23,42,0.06)] hover:border-white/60'
                    )}
                  >
                    <Icon
                      className={cls(
                        'h-5 w-5 flex-shrink-0 transition-colors',
                        activeExact ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'
                      )}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              )
            }

            const groupIsOpen = openGroup === item.href
            const groupActive =
              isExact(item.href) ||
              isDescendant(item.href) ||
              item.children!.some((c) => isExact(c.href) || isDescendant(c.href))
            const GroupIcon = item.icon

            return (
              <li key={item.href}>
                <button
                  type="button"
                  onClick={() => setOpenGroup(groupIsOpen ? null : item.href)}
                  className={cls(
                    'w-full flex items-center justify-between rounded-2xl px-3 py-2 text-left text-sm transition-all border border-transparent',
                    groupActive
                      ? 'bg-white/90 text-slate-900 shadow-[0_10px_30px_rgba(15,23,42,0.10)] ring-1 ring-slate-200'
                      : 'bg-white/0 text-slate-700 hover:bg-white/70 hover:shadow-[0_8px_26px_rgba(15,23,42,0.06)] hover:border-white/60'
                  )}
                >
                  <span className="inline-flex items-center gap-3">
                    <GroupIcon
                      className={cls(
                        'h-5 w-5 flex-shrink-0 transition-colors',
                        groupActive ? 'text-slate-900' : 'text-slate-400'
                      )}
                    />
                    <span>{item.label}</span>
                  </span>
                  <svg
                    className={cls(
                      'h-4 w-4 flex-shrink-0 transition-transform',
                      groupIsOpen ? 'rotate-90 text-slate-900' : 'text-slate-400'
                    )}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div
                  className={cls(
                    'overflow-hidden pl-3',
                    groupIsOpen ? 'max-h-[900px] py-1' : 'max-h-0',
                    'transition-[max-height,padding] duration-300 ease-in-out'
                  )}
                >
                  {item.children!.map((child) => {
                    const childExact = isExact(child.href)
                    const ChildIcon = child.icon
                    return (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cls(
                          'group mt-1 mr-2 flex items-center gap-3 rounded-2xl px-3 py-2 text-sm border border-transparent',
                          childExact
                            ? 'bg-white/95 text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.10)] ring-1 ring-slate-200'
                            : 'text-slate-700 hover:bg-white/80 hover:shadow-[0_6px_20px_rgba(15,23,42,0.06)] hover:border-white/70'
                        )}
                      >
                        <ChildIcon
                          className={cls(
                            'h-4 w-4 flex-shrink-0',
                            childExact ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-700'
                          )}
                        />
                        <span className="truncate">{child.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer / Logout */}
      <div className="border-t border-white/70 bg-white/60 backdrop-blur-xl p-3 shadow-[0_-6px_18px_rgba(15,23,42,0.06)]">
        <button
          onClick={async () => {
            await supabase.auth.signOut()
            router.push('/login')
          }}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-[0_10px_30px_rgba(15,23,42,0.35)] transition hover:bg-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-white"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          Abmelden
        </button>
      </div>
    </div>
  )
}
