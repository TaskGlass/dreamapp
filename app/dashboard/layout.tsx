"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  HomeIcon,
  BookIcon,
  CalendarIcon,
  SettingsIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
  BrainIcon,
  SparklesIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  if (!user) {
    return <div className="p-8 text-center">Loading...</div>
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Glow blobs - fixed position */}
      <div className="glow-blob glow-blob-1 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-2 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-3 animate-pulse-glow"></div>
      <div className="glow-blob glow-blob-4 animate-pulse-glow"></div>

      <header className="relative z-10 border-b border-dream-glass-border backdrop-blur-md bg-dream-card-bg sticky top-0">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-dream-purple mr-2" />
                <span className="text-xl font-bold gradient-text">DreamSage</span>
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-white hover:bg-white/10">
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-dream-dark-blue border-dream-glass-border p-0">
                  <div className="flex flex-col h-full">
                    <div className="p-4 border-b border-dream-glass-border flex items-center justify-between">
                      <div className="flex items-center">
                        <SparklesIcon className="h-5 w-5 text-dream-purple mr-2" />
                        <span className="text-xl font-bold gradient-text">DreamSage</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-white hover:bg-white/10"
                      >
                        <XIcon className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="p-4 flex-1">
                      <nav className="space-y-1">
                        <MobileNavItem
                          href="/dashboard"
                          icon={<HomeIcon className="h-5 w-5" />}
                          label="Dashboard"
                          active={pathname === "/dashboard"}
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <MobileNavItem
                          href="/dashboard/interpret"
                          icon={<PlusIcon className="h-5 w-5" />}
                          label="New Interpretation"
                          active={pathname === "/dashboard/interpret"}
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <MobileNavItem
                          href="/dashboard/dreams"
                          icon={<BookIcon className="h-5 w-5" />}
                          label="Dream Journal"
                          active={pathname === "/dashboard/dreams"}
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <MobileNavItem
                          href="/dashboard/calendar"
                          icon={<CalendarIcon className="h-5 w-5" />}
                          label="Calendar"
                          active={pathname === "/dashboard/calendar"}
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <MobileNavItem
                          href="/dashboard/insights"
                          icon={<BrainIcon className="h-5 w-5" />}
                          label="Insights"
                          active={pathname === "/dashboard/insights"}
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                        <MobileNavItem
                          href="/dashboard/settings"
                          icon={<SettingsIcon className="h-5 w-5" />}
                          label="Settings"
                          active={pathname === "/dashboard/settings"}
                          onClick={() => setIsMobileMenuOpen(false)}
                        />
                      </nav>
                    </div>

                    <div className="p-4 border-t border-dream-glass-border">
                      <div className="flex items-center mb-4">
                        <div className="w-8 h-8 rounded-full bg-dream-purple/20 flex items-center justify-center mr-2">
                          <UserIcon className="h-4 w-4 text-dream-purple" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-white hover:bg-white/10"
                        onClick={handleLogout}
                      >
                        <LogOutIcon className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>

              <div className="hidden md:flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => router.push("/dashboard/interpret")}
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  New Interpretation
                </Button>

                <div className="h-6 border-r border-dream-glass-border mx-1"></div>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                  onClick={() => router.push("/dashboard/settings")}
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  {user.name}
                </Button>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={handleLogout}>
                  <LogOutIcon className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden md:flex flex-col w-64 border-r border-dream-glass-border bg-dream-card-bg backdrop-blur-md relative z-10">
          <div className="p-4">
            <nav className="space-y-1">
              <NavItem
                href="/dashboard"
                icon={<HomeIcon className="h-5 w-5" />}
                label="Dashboard"
                active={pathname === "/dashboard"}
              />
              <NavItem
                href="/dashboard/interpret"
                icon={<PlusIcon className="h-5 w-5" />}
                label="New Interpretation"
                active={pathname === "/dashboard/interpret"}
              />
              <NavItem
                href="/dashboard/dreams"
                icon={<BookIcon className="h-5 w-5" />}
                label="Dream Journal"
                active={pathname === "/dashboard/dreams"}
              />
              <NavItem
                href="/dashboard/calendar"
                icon={<CalendarIcon className="h-5 w-5" />}
                label="Calendar"
                active={pathname === "/dashboard/calendar"}
              />
              <NavItem
                href="/dashboard/insights"
                icon={<BrainIcon className="h-5 w-5" />}
                label="Insights"
                active={pathname === "/dashboard/insights"}
              />
              <NavItem
                href="/dashboard/settings"
                icon={<SettingsIcon className="h-5 w-5" />}
                label="Settings"
                active={pathname === "/dashboard/settings"}
              />
            </nav>
          </div>

          <div className="mt-auto p-4 border-t border-dream-glass-border">
            <div className="glass-card p-4">
              <h4 className="font-medium text-dream-purple mb-2">Dream Tip</h4>
              <p className="text-sm text-gray-300">
                Keep a notepad by your bed to record dreams immediately upon waking for the most accurate recall.
              </p>
            </div>

            {!user.isSubscribed && (
              <div className="mt-4 glass-card p-4 border-dream-purple">
                <h4 className="font-medium text-dream-purple mb-2">Free Plan</h4>
                <p className="text-sm text-gray-300 mb-2">You have 1 dream interpretation per day.</p>
                <Button size="sm" className="w-full glass-button-primary" onClick={() => router.push("/")}>
                  Upgrade Plan
                </Button>
              </div>
            )}
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  )
}

function NavItem({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        active ? "bg-dream-purple/20 text-white" : "text-gray-300 hover:bg-dream-purple/10 hover:text-white"
      }`}
    >
      <span className={`mr-3 ${active ? "text-dream-purple" : "text-gray-400"}`}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}

function MobileNavItem({ href, icon, label, active, onClick }) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 rounded-md transition-colors ${
        active ? "bg-dream-purple/20 text-white" : "text-gray-300 hover:bg-dream-purple/10 hover:text-white"
      }`}
      onClick={onClick}
    >
      <span className={`mr-3 ${active ? "text-dream-purple" : "text-gray-400"}`}>{icon}</span>
      <span>{label}</span>
    </Link>
  )
}
