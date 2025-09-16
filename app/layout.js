import { Suspense } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/contexts/language-context"
import "./globals.css"

export default function RootLayout({ children }) {
  // Inline Tailwind spinner, small & inline to avoid affecting layout
  const Spinner = () => (
    <div className="flex items-center justify-center py-4">
      <div className="flex space-x-2">
        <div className="w-3 h-3 bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full animate-bounce delay-0"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full animate-bounce delay-150"></div>
        <div className="w-3 h-3 bg-gradient-to-r from-indigo-600 to-blue-400 rounded-full animate-bounce delay-300"></div>
      </div>
    </div>
  )

  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={<Spinner />}>
          <LanguageProvider>{children}</LanguageProvider>
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
