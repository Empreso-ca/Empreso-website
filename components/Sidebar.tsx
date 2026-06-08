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
  PanelRightClose
} from "lucide-react"

import { Button } from "./ui/Button"

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

  const topNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/console/cv-builder", label: "CV Builder Agent", icon: FileText },
    { href: "/console/cv-builder/editor", label: "LaTeX CV Editor", icon: Code },
    { href: "/console/jobs", label: "Personalised Jobs", icon: DockIcon },
    { href: "/console/applications", label: "Your Applications", icon: List },
  ]

  const bottomNavItems = [
    { href: "/console/preferences", label: "Preferences", icon: SlidersHorizontal },
    { href: "/console/settings", label: "Settings", icon: Settings },
  ]


  return (
    <aside
      className={`flex h-full flex-col justify-between border-r p-3 transition-all duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <nav className="space-y-1 flex-1">
        {topNavItems.map(({ href, label, icon: Icon }) => {
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