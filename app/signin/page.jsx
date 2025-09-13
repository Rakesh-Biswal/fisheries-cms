"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthLayout } from "@/components/auth-layout"
import { Mail, Lock, Phone, ArrowRight, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { initializeApp } from "firebase/app"
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)

export default function EmployeeSignInPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isPhoneSignIn, setIsPhoneSignIn] = useState(false)
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    otp: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [recaptchaVerifier, setRecaptchaVerifier] = useState(null)
  const [confirmationResult, setConfirmationResult] = useState(null)

  useEffect(() => {
    if (isPhoneSignIn && typeof window !== "undefined") {
      const verifier = new RecaptchaVerifier(auth, "recaptcha-container-signin", {
        size: "invisible",
        callback: () => {
          console.log("reCAPTCHA solved")
        },
      })
      setRecaptchaVerifier(verifier)
    }

    return () => {
      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
      }
    }
  }, [isPhoneSignIn])

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateEmailPassword = () => {
    const newErrors = {}
    
    if (!formData.email) {
      newErrors.email = "Company email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validatePhone = () => {
    const newErrors = {}
    
    if (!formData.phone) {
      newErrors.phone = "Phone number is required"
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateOtp = () => {
    const newErrors = {}
    
    if (!formData.otp || formData.otp.length !== 6) {
      newErrors.otp = "Please enter a valid 6-digit OTP"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailPasswordSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateEmailPassword()) return

    setIsLoading(true)

    try {
      // Call employee sign-in API
      const response = await fetch("/api/employee/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Redirect to employee dashboard
        window.location.href = "/employee/dashboard"
      } else {
        setErrors({ submit: data.error || "Failed to sign in" })
      }
    } catch (error) {
      console.error("Sign-in error:", error)
      setErrors({ submit: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendOtp = async (e) => {
    e.preventDefault()
    
    if (!validatePhone()) return

    setIsLoading(true)

    try {
      const phoneNumber = `+91${formData.phone}`

      if (!recaptchaVerifier) {
        throw new Error("reCAPTCHA not initialized")
      }

      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier)
      setConfirmationResult(confirmation)
      setIsOtpSent(true)
      console.log("OTP sent successfully")
    } catch (error) {
      console.error("Error sending OTP:", error)
      setErrors({ phone: error.message || "Failed to send OTP. Please try again." })

      if (recaptchaVerifier) {
        recaptchaVerifier.clear()
        const newVerifier = new RecaptchaVerifier(auth, "recaptcha-container-signin", {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved")
          },
        })
        setRecaptchaVerifier(newVerifier)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyOtp = async (e) => {
    e.preventDefault()
    
    if (!validateOtp()) return

    setIsLoading(true)

    try {
      const result = await confirmationResult.confirm(formData.otp)
      console.log("Phone verified successfully:", result.user.uid)
      
      // Call employee phone sign-in API
      const response = await fetch("/api/employee/signin-phone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone: `+91${formData.phone}`,
          firebaseUid: result.user.uid,
        }),
      })

      const data = await response.json()

      if (data.success) {
        window.location.href = "/employee/dashboard"
      } else {
        setErrors({ submit: data.error || "Failed to sign in" })
      }
    } catch (error) {
      console.error("Error verifying OTP:", error)
      setErrors({ otp: "Invalid OTP. Please check and try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToPhone = () => {
    setIsOtpSent(false)
    setFormData((prev) => ({ ...prev, otp: "" }))
    setErrors({})
  }

  const handleBackToEmail = () => {
    setIsPhoneSignIn(false)
    setIsOtpSent(false)
    setErrors({})
  }

  return (
    <AuthLayout
      title="Employee Sign In"
      titleOdia="କର୍ମଚାରୀ ସାଇନ୍ ଇନ୍"
      subtitle={isPhoneSignIn 
        ? (isOtpSent ? "Enter the OTP sent to your phone" : "Sign in with your phone number") 
        : "Sign in to access your employee dashboard"
      }
    >
      {/* reCAPTCHA container */}
      <div id="recaptcha-container-signin"></div>

      {!isPhoneSignIn ? (
        /* Email/Password Form */
        <form onSubmit={handleEmailPasswordSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Company Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Company Email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 h-12 text-base ${errors.email ? "border-destructive" : ""}`}
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pl-10 pr-10 h-12 text-base ${errors.password ? "border-destructive" : ""}`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 text-base" 
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Signing In...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                Sign In
                <ArrowRight className="h-5 w-5" />
              </div>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button 
            type="button" 
            variant="outline" 
            className="w-full h-11"
            onClick={() => setIsPhoneSignIn(true)}
          >
            <Phone className="h-4 w-4 mr-2" />
            Sign in with Phone
          </Button>

          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}
        </form>
      ) : (
        /* Phone Sign-in Form */
        <form onSubmit={isOtpSent ? handleVerifyOtp : handleSendOtp} className="space-y-6">
          {!isOtpSent ? (
            /* Phone Input */
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <div className="absolute left-10 top-3 text-sm text-muted-foreground">
                  +91
                </div>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="   Enter Your Phone Number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value.replace(/\D/g, ""))}
                  className={`pl-16 h-12 text-base ${errors.phone ? "border-destructive" : ""}`}
                  maxLength={10}
                />
              </div>
              {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
              <p className="text-xs text-muted-foreground">
                We'll send an OTP to verify your phone number
              </p>
            </div>
          ) : (
            /* OTP Input */
            <>
              <div className="text-center mb-4">
                <p className="text-sm text-muted-foreground">
                  OTP sent to <strong>+91{formData.phone}</strong>
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Enter OTP
                </Label>
                <Input
                  id="otp"
                  type="text"
                  value={formData.otp}
                  onChange={(e) => handleInputChange("otp", e.target.value.replace(/\D/g, ""))}
                  className={`text-center text-lg tracking-widest h-12 ${errors.otp ? "border-destructive" : ""}`}
                  maxLength={6}
                />
                {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
              </div>

              <button
                type="button"
                onClick={handleBackToPhone}
                className="text-sm text-primary hover:underline"
              >
                ← Change phone number
              </button>
            </>
          )}

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 h-11"
              onClick={isOtpSent ? handleBackToPhone : handleBackToEmail}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-11" 
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {isOtpSent ? "Verifying..." : "Sending..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {isOtpSent ? "Verify OTP" : "Send OTP"}
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>
          </div>

          {errors.submit && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{errors.submit}</p>
            </div>
          )}
        </form>
      )}

      {/* Support Link */}
      <div className="text-center mt-6">
        <p className="text-sm text-muted-foreground">
          Having trouble signing in?{" "}
          <Link href="/employee/support" className="text-primary hover:underline font-medium">
            Contact IT Support
          </Link>
        </p>
      </div>

      {/* Trust Badge */}
      <div className="mt-8 p-4 bg-secondary/50 rounded-lg text-center">
        <p className="text-xs text-muted-foreground">
          🔒 Secure employee portal. All data is encrypted and protected.
        </p>
      </div>
    </AuthLayout>
  )
}