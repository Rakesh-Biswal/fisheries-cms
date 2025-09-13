"use client"

import { createContext, useContext, useState, useEffect } from "react"

const LanguageContext = createContext()

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

// Translation data
const translations = {
  en: {
    // Navigation
    home: "Home",
    exploreSchemes: "Explore Schemes",
    aboutUs: "About Us",
    contact: "Contact",
    signIn: "Sign In",
    getStarted: "Get Started",

    // Homepage
    heroTitle: "Your Complete Fisheries Business Solution",
    heroSubtitle:
      "Navigate government schemes, manage your fisheries business, and grow with confidence. We handle the paperwork, you focus on success.",
    exploreSchemes: "Explore Schemes",
    startYourJourney: "Start Your Journey",
    farmersHelped: "Farmers Helped",
    subsidiesSecured: "Subsidies Secured",
    activeSchemes: "Active Schemes",

    // Features
    schemeManagement: "Scheme Management",
    schemeManagementDesc: "Complete application and documentation support",
    businessGrowth: "Business Growth",
    businessGrowthDesc: "Strategic guidance for sustainable expansion",
    complianceSupport: "Compliance Support",
    complianceSupportDesc: "Stay compliant with all regulations",
    expertGuidance: "Expert Guidance",
    expertGuidanceDesc: "24/7 support from industry experts",

    // Scheme Overview
    availableSchemes: "Available Government Schemes",
    availableSchemesDesc: "Discover and apply for fisheries schemes tailored for your business needs",
    viewAllSchemes: "View All Schemes",
    viewDetails: "View Details",
    applyNow: "Apply Now",
    expired: "Expired",
    deadline: "Deadline",
    applicants: "Applicants",
    maxSubsidy: "Max Subsidy",

    // Authentication
    welcomeBack: "Welcome Back",
    joinCommunity: "Join Our Community",
    signInSubtitle: "Sign in to access your fisheries dashboard and manage your schemes",
    signUpSubtitle: "Create your account to access government schemes and grow your fisheries business",
    emailAddress: "Email Address",
    password: "Password",
    confirmPassword: "Confirm Password",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    district: "District",
    farmerType: "Farmer Type",
    rememberMe: "Remember me",
    forgotPassword: "Forgot password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    createAccount: "Create Account",
    signingIn: "Signing In...",
    creatingAccount: "Creating Account...",

    // Footer
    footerDesc:
      "Empowering Odisha's fisheries community with comprehensive business solutions and government scheme access.",
    quickLinks: "Quick Links",
    ourServices: "Our Services",
    contactInfo: "Contact Info",
    schemeApplication: "Scheme Application",
    businessConsultation: "Business Consultation",
    documentationSupport: "Documentation Support",
    complianceManagement: "Compliance Management",

    // Explore Page
    exploreTitle: "Explore Government Schemes",
    exploreSubtitle: "Discover and apply for fisheries schemes tailored for your business needs",
    searchPlaceholder: "Search schemes by name, category, or keywords...",
    filterSchemes: "Filter Schemes",
    clearAll: "Clear All",
    activeFilters: "Active filters:",
    schemesFound: "schemes found",
    showingResults: "Showing results based on your filters and search",
    noSchemesFound: "No schemes found",
    noSchemesDesc: "Try adjusting your filters or search terms to find relevant schemes.",
    resetFilters: "Reset Filters",

    // Status
    live: "Live",
    expiring: "Expiring",

    // Common
    or: "Or",
    loading: "Loading...",
    error: "Error",
    success: "Success",
  },
  od: {
    // Navigation
    home: "ଘର",
    exploreSchemes: "ଯୋଜନା ଅନ୍ବେଷଣ",
    aboutUs: "ଆମ ବିଷୟରେ",
    contact: "ଯୋଗାଯୋଗ",
    signIn: "ସାଇନ୍ ଇନ୍",
    getStarted: "ଆରମ୍ଭ କରନ୍ତୁ",

    // Homepage
    heroTitle: "ଆପଣଙ୍କ ସମ୍ପୂର୍ଣ୍ଣ ମତ୍ସ୍ୟ ବ୍ୟବସାୟ ସମାଧାନ",
    heroSubtitle:
      "ସରକାରୀ ଯୋଜନା ନେଭିଗେଟ୍ କରନ୍ତୁ, ଆପଣଙ୍କ ମତ୍ସ୍ୟ ବ୍ୟବସାୟ ପରିଚାଳନା କରନ୍ତୁ ଏବଂ ଆତ୍ମବିଶ୍ୱାସ ସହିତ ବୃଦ୍ଧି କରନ୍ତୁ। ଆମେ କାଗଜପତ୍ର ସମ୍ଭାଳୁ, ଆପଣ ସଫଳତା ଉପରେ ଧ୍ୟାନ ଦିଅନ୍ତୁ।",
    exploreSchemes: "ଯୋଜନା ଅନ୍ବେଷଣ",
    startYourJourney: "ଆପଣଙ୍କ ଯାତ୍ରା ଆରମ୍ଭ କରନ୍ତୁ",
    farmersHelped: "କୃଷକଙ୍କୁ ସାହାଯ୍ୟ",
    subsidiesSecured: "ସବସିଡି ସୁରକ୍ଷିତ",
    activeSchemes: "ସକ୍ରିୟ ଯୋଜନା",

    // Features
    schemeManagement: "ଯୋଜନା ପରିଚାଳନା",
    schemeManagementDesc: "ସମ୍ପୂର୍ଣ୍ଣ ଆବେଦନ ଏବଂ ଡକୁମେଣ୍ଟେସନ୍ ସହାୟତା",
    businessGrowth: "ବ୍ୟବସାୟ ବୃଦ୍ଧି",
    businessGrowthDesc: "ସ୍ଥାୟୀ ସମ୍ପ୍ରସାରଣ ପାଇଁ ରଣନୀତିକ ମାର୍ଗଦର୍ଶନ",
    complianceSupport: "ଅନୁପାଳନ ସହାୟତା",
    complianceSupportDesc: "ସମସ୍ତ ନିୟମାବଳୀ ସହିତ ଅନୁପାଳନ ରଖନ୍ତୁ",
    expertGuidance: "ବିଶେଷଜ୍ଞ ମାର୍ଗଦର୍ଶନ",
    expertGuidanceDesc: "ଇଣ୍ଡଷ୍ଟ୍ରି ବିଶେଷଜ୍ଞଙ୍କ ଠାରୁ ୨୪/୭ ସହାୟତା",

    // Scheme Overview
    availableSchemes: "ଉପଲବ୍ଧ ସରକାରୀ ଯୋଜନା",
    availableSchemesDesc: "ଆପଣଙ୍କ ବ୍ୟବସାୟ ଆବଶ୍ୟକତା ପାଇଁ ଉପଯୁକ୍ତ ମତ୍ସ୍ୟ ଯୋଜନା ଆବିଷ୍କାର ଏବଂ ଆବେଦନ କରନ୍ତୁ",
    viewAllSchemes: "ସମସ୍ତ ଯୋଜନା ଦେଖନ୍ତୁ",
    viewDetails: "ବିବରଣୀ ଦେଖନ୍ତୁ",
    applyNow: "ବର୍ତ୍ତମାନ ଆବେଦନ କରନ୍ତୁ",
    expired: "ମିଆଦ ଶେଷ",
    deadline: "ଶେଷ ତାରିଖ",
    applicants: "ଆବେଦନକାରୀ",
    maxSubsidy: "ସର୍ବାଧିକ ସବସିଡି",

    // Authentication
    welcomeBack: "ସ୍ୱାଗତମ୍",
    joinCommunity: "ଆମର ସମୁଦାୟରେ ଯୋଗ ଦିଅନ୍ତୁ",
    signInSubtitle: "ଆପଣଙ୍କ ମତ୍ସ୍ୟ ଡ୍ୟାସବୋର୍ଡ ଆକ୍ସେସ୍ କରିବା ଏବଂ ଆପଣଙ୍କ ଯୋଜନା ପରିଚାଳନା କରିବା ପାଇଁ ସାଇନ୍ ଇନ୍ କରନ୍ତୁ",
    signUpSubtitle: "ସରକାରୀ ଯୋଜନା ଆକ୍ସେସ୍ କରିବା ଏବଂ ଆପଣଙ୍କ ମତ୍ସ୍ୟ ବ୍ୟବସାୟ ବୃଦ୍ଧି କରିବା ପାଇଁ ଆପଣଙ୍କ ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ",
    emailAddress: "ଇମେଲ ଠିକଣା",
    password: "ପାସୱାର୍ଡ",
    confirmPassword: "ପାସୱାର୍ଡ ନିଶ୍ଚିତ କରନ୍ତୁ",
    fullName: "ପୂର୍ଣ୍ଣ ନାମ",
    phoneNumber: "ଫୋନ୍ ନମ୍ବର",
    district: "ଜିଲ୍ଲା",
    farmerType: "କୃଷକ ପ୍ରକାର",
    rememberMe: "ମୋତେ ମନେ ରଖ",
    forgotPassword: "ପାସୱାର୍ଡ ଭୁଲିଗଲେ?",
    dontHaveAccount: "ଖାତା ନାହିଁ?",
    alreadyHaveAccount: "ପୂର୍ବରୁ ଖାତା ଅଛି?",
    createAccount: "ଖାତା ସୃଷ୍ଟି କରନ୍ତୁ",
    signingIn: "ସାଇନ୍ ଇନ୍ ହେଉଛି...",
    creatingAccount: "ଖାତା ସୃଷ୍ଟି ହେଉଛି...",

    // Footer
    footerDesc: "ବ୍ୟାପକ ବ୍ୟବସାୟ ସମାଧାନ ଏବଂ ସରକାରୀ ଯୋଜନା ପ୍ରବେଶ ସହିତ ଓଡ଼ିଶାର ମତ୍ସ୍ୟଜୀବୀ ସମୁଦାୟକୁ ସଶକ୍ତ କରିବା।",
    quickLinks: "ଦ୍ରୁତ ଲିଙ୍କ",
    ourServices: "ଆମର ସେବା",
    contactInfo: "ଯୋଗାଯୋଗ ସୂଚନା",
    schemeApplication: "ଯୋଜନା ଆବେଦନ",
    businessConsultation: "ବ୍ୟବସାୟ ପରାମର୍ଶ",
    documentationSupport: "ଡକୁମେଣ୍ଟେସନ୍ ସହାୟତା",
    complianceManagement: "ଅନୁପାଳନ ପରିଚାଳନା",

    // Explore Page
    exploreTitle: "ସରକାରୀ ଯୋଜନା ଅନ୍ବେଷଣ କରନ୍ତୁ",
    exploreSubtitle: "ଆପଣଙ୍କ ବ୍ୟବସାୟ ଆବଶ୍ୟକତା ପାଇଁ ଉପଯୁକ୍ତ ମତ୍ସ୍ୟ ଯୋଜନା ଆବିଷ୍କାର ଏବଂ ଆବେଦନ କରନ୍ତୁ",
    searchPlaceholder: "ନାମ, ବର୍ଗ, କିମ୍ବା କୀୱାର୍ଡ ଦ୍ୱାରା ଯୋଜନା ଖୋଜନ୍ତୁ...",
    filterSchemes: "ଯୋଜନା ଫିଲ୍ଟର କରନ୍ତୁ",
    clearAll: "ସବୁ ସଫା କରନ୍ତୁ",
    activeFilters: "ସକ୍ରିୟ ଫିଲ୍ଟର:",
    schemesFound: "ଯୋଜନା ମିଳିଲା",
    showingResults: "ଆପଣଙ୍କ ଫିଲ୍ଟର ଏବଂ ସନ୍ଧାନ ଆଧାରରେ ଫଳାଫଳ ଦେଖାଯାଉଛି",
    noSchemesFound: "କୌଣସି ଯୋଜନା ମିଳିଲା ନାହିଁ",
    noSchemesDesc: "ପ୍ରାସଙ୍ଗିକ ଯୋଜନା ଖୋଜିବା ପାଇଁ ଆପଣଙ୍କ ଫିଲ୍ଟର କିମ୍ବା ସନ୍ଧାନ ଶବ୍ଦ ସଜାଡ଼ିବାକୁ ଚେଷ୍ଟା କରନ୍ତୁ।",
    resetFilters: "ଫିଲ୍ଟର ରିସେଟ୍ କରନ୍ତୁ",

    // Status
    live: "ସକ୍ରିୟ",
    expiring: "ମିଆଦ ଶେଷ ହେଉଛି",

    // Common
    or: "କିମ୍ବା",
    loading: "ଲୋଡ୍ ହେଉଛି...",
    error: "ତ୍ରୁଟି",
    success: "ସଫଳତା",
  },
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en")

  // Load saved language preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem("fisheries-language")
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "od")) {
      setLanguage(savedLanguage)
    }
  }, [])

  // Save language preference
  useEffect(() => {
    localStorage.setItem("fisheries-language", language)
  }, [language])

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "od" : "en"))
  }

  const t = (key) => {
    return translations[language][key] || key
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    t,
    isOdia: language === "od",
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
