import { Fish } from "lucide-react"
import Link from "next/link"
import { LanguageToggle } from "./language-toggle"

export function AuthLayout({ children, title, subtitle, titleOdia }) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <Link href="/" className="flex items-center space-x-3 mb-8">
            <Fish className="h-12 w-12" />
            <span className="text-2xl font-bold">Fisheries Solution</span>
          </Link>

          <h1 className="text-4xl font-bold mb-4 text-balance">Empowering Odisha's Fisheries Community</h1>
          <p className="text-xl mb-6 text-pretty opacity-90">
            Join thousands of farmers who have transformed their fisheries business with government schemes and expert
            guidance.
          </p>
          <p className="text-lg opacity-80">
            <span className="font-semibold">ଓଡ଼ିଆରେ:</span> ସରକାରୀ ଯୋଜନା ଏବଂ ବିଶେଷଜ୍ଞ ମାର୍ଗଦର୍ଶନ ସହିତ ଆପଣଙ୍କ ମତ୍ସ୍ୟ ବ୍ୟବସାୟକୁ ରୂପାନ୍ତରିତ
            କରନ୍ତୁ
          </p>

          {/* Trust Indicators */}
          <div className="flex items-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold">500+</div>
              <div className="text-sm opacity-80">Farmers Helped</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">₹2Cr+</div>
              <div className="text-sm opacity-80">Subsidies Secured</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm opacity-80">Active Schemes</div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-32 h-32 bg-white/10 rounded-full"></div>
        <div className="absolute bottom-20 right-32 w-20 h-20 bg-white/5 rounded-full"></div>
        <div className="absolute top-1/2 right-10 w-16 h-16 bg-white/10 rounded-full"></div>
      </div>

      <div className="lg:hidden bg-gradient-to-r from-primary to-accent p-6 text-white text-center">
        <Link href="/" className="flex items-center justify-center space-x-2 mb-4">
          <Fish className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold">Fisheries Solution</span>
        </Link>
        <p className="text-sm opacity-90">Empowering Odisha's Fisheries Community</p>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-12 xl:px-16 py-8 lg:py-0 bg-background">
        <div className="w-full max-w-md mx-auto">
          <div className="flex justify-end mb-4 lg:mb-6">
            <LanguageToggle />
          </div>

          <div className="text-center mb-6 lg:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{title}</h2>
            {titleOdia && (
              <p className="text-base sm:text-lg text-muted-foreground mb-2">
                <span className="font-semibold text-primary">ଓଡ଼ିଆରେ:</span> {titleOdia}
              </p>
            )}
            <p className="text-sm sm:text-base text-muted-foreground">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  )
}
