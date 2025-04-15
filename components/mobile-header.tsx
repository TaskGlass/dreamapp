"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  SparklesIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  LogOutIcon,
  HomeIcon,
  BookIcon,
  CalendarIcon,
  BrainIcon,
  SettingsIcon,
  PlusIcon,
} from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"

export function MobileHeader() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    setIsOpen(false)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="relative z-10 py-4 border-b border-dream-glass-border backdrop-blur-md bg-dream-card-bg sticky top-0 md:hidden">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <SparklesIcon className="h-5 w-5 text-dream-purple mr-2" />
            <span className="text-xl font-bold gradient-text">DreamSage</span>
          </Link>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white hover:bg-white/10">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="bg-dream-dark-blue border-dream-glass-border p-0 w-[85vw] max-w-[300px]"
            >
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-dream-glass-border flex items-center justify-between">
                  <div className="flex items-center">
                    <SparklesIcon className="h-5 w-5 text-dream-purple mr-2" />
                    <span className="text-xl font-bold gradient-text">DreamSage</span>
                  </div>
                  <Button variant="ghost" size="icon" onClick={closeMenu} className="text-white hover:bg-white/10">
                    <XIcon className="h-5 w-5" />
                  </Button>
                </div>

                {user ? (
                  <>
                    <div className="p-4 border-b border-dream-glass-border">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-dream-purple/20 flex items-center justify-center mr-3">
                          <UserIcon className="h-5 w-5 text-dream-purple" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{user.name}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-2">
                      <div className="space-y-1">
                        <NavItem
                          href="/dashboard"
                          icon={<HomeIcon className="h-5 w-5" />}
                          label="Dashboard"
                          active={isActive("/dashboard")}
                          onClick={closeMenu}
                        />
                        <NavItem
                          href="/dashboard/interpret"
                          icon={<PlusIcon className="h-5 w-5" />}
                          label="New Interpretation"
                          active={isActive("/dashboard/interpret")}
                          onClick={closeMenu}
                        />
                        <NavItem
                          href="/dashboard/dreams"
                          icon={<BookIcon className="h-5 w-5" />}
                          label="Dream Journal"
                          active={isActive("/dashboard/dreams")}
                          onClick={closeMenu}
                        />
                        <NavItem
                          href="/dashboard/library"
                          icon={<BookIcon className="h-5 w-5" />}
                          label="Dream Library"
                          active={isActive("/dashboard/library")}
                          onClick={closeMenu}
                        />
                        <NavItem
                          href="/dashboard/calendar"
                          icon={<CalendarIcon className="h-5 w-5" />}
                          label="Calendar"
                          active={isActive("/dashboard/calendar")}
                          onClick={closeMenu}
                        />
                        <NavItem
                          href="/dashboard/insights"
                          icon={<BrainIcon className="h-5 w-5" />}
                          label="Insights"
                          active={isActive("/dashboard/insights")}
                          onClick={closeMenu}
                        />
                        <NavItem
                          href="/dashboard/settings"
                          icon={<SettingsIcon className="h-5 w-5" />}
                          label="Settings"
                          active={isActive("/dashboard/settings")}
                          onClick={closeMenu}
                        />
                      </div>
                    </nav>

                    <div className="p-4 border-t border-dream-glass-border">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-white/10 h-12"
                        onClick={handleSignOut}
                      >
                        <LogOutIcon className="h-5 w-5 mr-3" />
                        Sign Out
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="p-4 flex flex-col gap-2">
                    <Link href="/auth/login" onClick={closeMenu}>
                      <Button className="w-full glass-button h-12">Login</Button>
                    </Link>
                    <Link href="/auth/signup" onClick={closeMenu}>
                      <Button className="w-full glass-button-primary h-12">Sign Up</Button>
                    </Link>
                    <Link href="/interpret" onClick={closeMenu}>
                      <Button className="w-full glass-button h-12 mt-4">Try Free Interpretation</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function NavItem({ href, icon, label, active, onClick }) {
  return (
    <Link
      href={href}
      className={`mobile-nav-item ${
        active ? "bg-dream-purple/20 text-white" : "text-gray-300 hover:bg-dream-purple/10 hover:text-white"
      }`}
      onClick={onClick}
    >
      <span className={`mr-3 ${active ? "text-dream-purple" : "text-gray-400"}`}>{icon}</span>
      <span className="text-base">{label}</span>
    </Link>
  )
}
