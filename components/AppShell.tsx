"use client"

import { useState } from "react"
import { Sidebar } from "./Sidebar"

export function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <main className="flex-1 overflow-y-auto p-6">
        {children}
      </main>
    </div>
  )
}