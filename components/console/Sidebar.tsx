"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  DockIcon,
  Home,
  List,
  FileText,
  Code,
  Settings,
  SlidersHorizontal,
  PanelLeftOpen,
  PanelRightClose,
  GroupIcon,
  Workflow,
  MousePointerClick 
} from "lucide-react"

interface SidebarProps {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

export function Sidebar({
  collapsed,
  setCollapsed,
}: SidebarProps) {
  const pathname = usePathname()

  const base =
    "flex items-center gap-3 px-4 py-2 rounded-md text-sm transition hover:bg-muted"

  const active = "bg-muted font-medium"

  const navigationSections = [
    {
      title: "Dashboard",
      items: [
        { href: "/console", label: "Home", icon: Home },
        { href: "/console/applications", label: "Your Applications", icon: List },
      ],
    },
    {
      title: "Tools",
      items: [
        { href: "/console/cv-builder", label: "CV Generator", icon: FileText },
        { href: "/console/cv-builder/editor", label: "LaTeX CV Editor", icon: Code },
        { href: "/console/jobs", label: "Personalised Jobs", icon: DockIcon },
        { href: "/console/smart-apply", label: "Smart Apply", icon: MousePointerClick  },
      ],
    },
  ]

  const bottomNavItems = [
    { href: "/console/profiles", label: "Profiles", icon: GroupIcon },
    { href: "/console/settings", label: "Settings", icon: Settings },
    { href: "/console/preferences", label: "Preferences", icon: SlidersHorizontal },
  ]


  return (
    <aside
      className={`flex h-full flex-col justify-between border-r p-3 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <nav className="flex-1 space-y-6">
        {navigationSections.map((section) => (
          <div key={section.title}>
            {!collapsed && (
              <p className="mb-2 px-4 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </p>
            )}

            <div className="space-y-1">
              {section.items.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href

                return (
                  <Link
                    key={href}
                    href={href}
                    className={`${base} ${isActive ? active : ""} ${
                      collapsed ? "justify-center px-2" : ""
                    }`}
                  >
                    <Icon size={18} />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-1">
        {bottomNavItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href

          return (
            <Link
              key={href}
              href={href}
              className={`${base} ${isActive ? active : ""} ${
                collapsed ? "justify-center px-2" : ""
              }`}
            >
              <Icon size={18} />
              {!collapsed && <span>{label}</span>}
            </Link>
          )
        })}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`${base} w-full ${
            collapsed ? "justify-center px-2" : ""
          }`}
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <>
              <PanelRightClose size={18} />
              <span>Collapse Menu</span>
            </>
          )}
        </button>

        {/* {!collapsed && <ThemeToggle />} */}
      </div>
    </aside>
  )
}