"use client"

import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 hover:bg-primary/10 transition-colors bg-transparent h-10 sm:h-9 px-3 sm:px-2 text-sm"
    >
      <Globe className="h-4 w-4" />
      <span className="text-xs sm:text-sm">{language === "en" ? "ଓଡ଼ିଆ" : "English"}</span>
    </Button>
  )
}
