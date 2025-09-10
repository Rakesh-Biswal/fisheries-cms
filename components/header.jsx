"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LanguageToggle } from "./language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { Menu, X, Fish } from "lucide-react"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Fish className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            <span className="text-lg sm:text-xl font-bold text-foreground">
              <span className="hidden sm:inline">Fisheries Solution</span>
              <span className="sm:hidden">Fisheries</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("home")}
            </Link>
            <Link href="/explore" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("exploreSchemes")}
            </Link>
            <Link href="/about" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("aboutUs")}
            </Link>
            <Link href="/contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors">
              {t("contact")}
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <LanguageToggle />
            <Link href="/signin">
              <Button variant="outline" size="sm">
                {t("signIn")}
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">{t("getStarted")}</Button>
            </Link>
          </div>

          <button
            className="lg:hidden p-2 -mr-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t animate-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col space-y-1">
              <Link
                href="/"
                className="px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("home")}
              </Link>
              <Link
                href="/explore"
                className="px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("exploreSchemes")}
              </Link>
              <Link
                href="/about"
                className="px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("aboutUs")}
              </Link>
              <Link
                href="/contact"
                className="px-3 py-3 text-base font-medium text-foreground hover:text-primary hover:bg-muted rounded-md transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {t("contact")}
              </Link>

              <div className="flex flex-col space-y-3 pt-4 px-3">
                <LanguageToggle />
                <Link href="/signin" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full h-12 text-base bg-transparent">
                    {t("signIn")}
                  </Button>
                </Link>
                <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full h-12 text-base">{t("getStarted")}</Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
