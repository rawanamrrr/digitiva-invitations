"use client"

import { useState, useEffect } from "react"
import { X, User, Phone, ChevronDown } from "lucide-react"
import Image from "next/image"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

interface NewsletterPopupProps {
  delaySeconds?: number
  scrollThreshold?: number
}

const countryCodes = [
  { code: "+93", flag: "🇦🇫", country: "Afghanistan" },
  { code: "+355", flag: "🇦🇱", country: "Albania" },
  { code: "+213", flag: "🇩🇿", country: "Algeria" },
  { code: "+376", flag: "🇦🇩", country: "Andorra" },
  { code: "+244", flag: "🇦🇴", country: "Angola" },
  { code: "+54", flag: "🇦🇷", country: "Argentina" },
  { code: "+374", flag: "🇦🇲", country: "Armenia" },
  { code: "+61", flag: "🇦🇺", country: "Australia" },
  { code: "+43", flag: "🇦🇹", country: "Austria" },
  { code: "+994", flag: "🇦🇿", country: "Azerbaijan" },
  { code: "+973", flag: "🇧🇭", country: "Bahrain" },
  { code: "+880", flag: "🇧🇩", country: "Bangladesh" },
  { code: "+375", flag: "🇧🇾", country: "Belarus" },
  { code: "+32", flag: "🇧🇪", country: "Belgium" },
  { code: "+501", flag: "🇧🇿", country: "Belize" },
  { code: "+229", flag: "🇧🇯", country: "Benin" },
  { code: "+975", flag: "🇧🇹", country: "Bhutan" },
  { code: "+591", flag: "🇧🇴", country: "Bolivia" },
  { code: "+387", flag: "🇧🇦", country: "Bosnia" },
  { code: "+267", flag: "🇧🇼", country: "Botswana" },
  { code: "+55", flag: "🇧🇷", country: "Brazil" },
  { code: "+673", flag: "�🇳", country: "Brunei" },
  { code: "+359", flag: "🇧�🇬", country: "Bulgaria" },
  { code: "+226", flag: "🇧🇫", country: "Burkina Faso" },
  { code: "+257", flag: "🇧🇮", country: "Burundi" },
  { code: "+855", flag: "🇰🇭", country: "Cambodia" },
  { code: "+237", flag: "🇨🇲", country: "Cameroon" },
  { code: "+1", flag: "🇨🇦", country: "Canada" },
  { code: "+238", flag: "🇨🇻", country: "Cape Verde" },
  { code: "+236", flag: "🇨🇫", country: "Central African Republic" },
  { code: "+235", flag: "🇹🇩", country: "Chad" },
  { code: "+56", flag: "🇨🇱", country: "Chile" },
  { code: "+86", flag: "🇨🇳", country: "China" },
  { code: "+57", flag: "🇨🇴", country: "Colombia" },
  { code: "+269", flag: "🇰🇲", country: "Comoros" },
  { code: "+242", flag: "🇨🇬", country: "Congo" },
  { code: "+506", flag: "🇨🇷", country: "Costa Rica" },
  { code: "+385", flag: "🇭🇷", country: "Croatia" },
  { code: "+53", flag: "🇨🇺", country: "Cuba" },
  { code: "+357", flag: "🇨🇾", country: "Cyprus" },
  { code: "+420", flag: "🇨🇿", country: "Czech Republic" },
  { code: "+45", flag: "🇩�", country: "Denmark" },
  { code: "+253", flag: "🇩🇯", country: "Djibouti" },
  { code: "+593", flag: "🇪🇨", country: "Ecuador" },
  { code: "+20", flag: "🇪🇬", country: "Egypt" },
  { code: "+503", flag: "�🇸🇻", country: "El Salvador" },
  { code: "+240", flag: "🇬🇶", country: "Equatorial Guinea" },
  { code: "+291", flag: "🇪🇷", country: "Eritrea" },
  { code: "+372", flag: "🇪🇪", country: "Estonia" },
  { code: "+251", flag: "🇪🇹", country: "Ethiopia" },
  { code: "+679", flag: "🇫🇯", country: "Fiji" },
  { code: "+358", flag: "🇫🇮", country: "Finland" },
  { code: "+33", flag: "🇫🇷", country: "France" },
  { code: "+241", flag: "🇬🇦", country: "Gabon" },
  { code: "+220", flag: "🇬🇲", country: "Gambia" },
  { code: "+995", flag: "🇬🇪", country: "Georgia" },
  { code: "+49", flag: "🇩🇪", country: "Germany" },
  { code: "+233", flag: "🇬🇭", country: "Ghana" },
  { code: "+30", flag: "🇬🇷", country: "Greece" },
  { code: "+502", flag: "🇬🇹", country: "Guatemala" },
  { code: "+224", flag: "🇬🇳", country: "Guinea" },
  { code: "+245", flag: "🇬🇼", country: "Guinea-Bissau" },
  { code: "+592", flag: "🇬�", country: "Guyana" },
  { code: "+509", flag: "🇭🇹", country: "Haiti" },
  { code: "+504", flag: "🇭🇳", country: "Honduras" },
  { code: "+852", flag: "🇭🇰", country: "Hong Kong" },
  { code: "+36", flag: "🇭🇺", country: "Hungary" },
  { code: "+354", flag: "🇮🇸", country: "Iceland" },
  { code: "+91", flag: "🇮🇳", country: "India" },
  { code: "+62", flag: "🇮🇩", country: "Indonesia" },
  { code: "+98", flag: "🇮🇷", country: "Iran" },
  { code: "+964", flag: "🇮🇶", country: "Iraq" },
  { code: "+353", flag: "🇮🇪", country: "Ireland" },
  { code: "+972", flag: "🇮🇱", country: "Israel" },
  { code: "+39", flag: "🇮🇹", country: "Italy" },
  { code: "+225", flag: "🇨🇮", country: "Ivory Coast" },
  { code: "+81", flag: "🇯🇵", country: "Japan" },
  { code: "+962", flag: "🇯🇴", country: "Jordan" },
  { code: "+7", flag: "🇰🇿", country: "Kazakhstan" },
  { code: "+254", flag: "🇰🇪", country: "Kenya" },
  { code: "+965", flag: "🇰🇼", country: "Kuwait" },
  { code: "+996", flag: "🇰🇬", country: "Kyrgyzstan" },
  { code: "+856", flag: "🇱🇦", country: "Laos" },
  { code: "+371", flag: "🇱�", country: "Latvia" },
  { code: "+961", flag: "🇱🇧", country: "Lebanon" },
  { code: "+266", flag: "🇱🇸", country: "Lesotho" },
  { code: "+231", flag: "🇱🇷", country: "Liberia" },
  { code: "+218", flag: "🇱🇾", country: "Libya" },
  { code: "+423", flag: "🇱🇮", country: "Liechtenstein" },
  { code: "+370", flag: "🇱🇹", country: "Lithuania" },
  { code: "+352", flag: "🇱🇺", country: "Luxembourg" },
  { code: "+853", flag: "🇲🇴", country: "Macau" },
  { code: "+389", flag: "�🇰", country: "Macedonia" },
  { code: "+261", flag: "🇲🇬", country: "Madagascar" },
  { code: "+265", flag: "🇲🇼", country: "Malawi" },
  { code: "+60", flag: "🇲🇾", country: "Malaysia" },
  { code: "+960", flag: "🇲🇻", country: "Maldives" },
  { code: "+223", flag: "🇲🇱", country: "Mali" },
  { code: "+356", flag: "🇲🇹", country: "Malta" },
  { code: "+222", flag: "🇲🇷", country: "Mauritania" },
  { code: "+230", flag: "🇲🇺", country: "Mauritius" },
  { code: "+52", flag: "🇲🇽", country: "Mexico" },
  { code: "+373", flag: "🇲🇩", country: "Moldova" },
  { code: "+377", flag: "🇲🇨", country: "Monaco" },
  { code: "+976", flag: "🇲🇳", country: "Mongolia" },
  { code: "+382", flag: "🇲🇪", country: "Montenegro" },
  { code: "+212", flag: "🇲�🇦", country: "Morocco" },
  { code: "+258", flag: "🇲🇿", country: "Mozambique" },
  { code: "+95", flag: "🇲🇲", country: "Myanmar" },
  { code: "+264", flag: "🇳🇦", country: "Namibia" },
  { code: "+977", flag: "🇳🇵", country: "Nepal" },
  { code: "+31", flag: "🇳🇱", country: "Netherlands" },
  { code: "+64", flag: "🇳🇿", country: "New Zealand" },
  { code: "+505", flag: "�🇮", country: "Nicaragua" },
  { code: "+227", flag: "🇳🇪", country: "Niger" },
  { code: "+234", flag: "🇳🇬", country: "Nigeria" },
  { code: "+850", flag: "�🇰�", country: "North Korea" },
  { code: "+47", flag: "🇳🇴", country: "Norway" },
  { code: "+968", flag: "🇴🇲", country: "Oman" },
  { code: "+92", flag: "🇵🇰", country: "Pakistan" },
  { code: "+970", flag: "🇵🇸", country: "Palestine" },
  { code: "+507", flag: "🇵🇦", country: "Panama" },
  { code: "+675", flag: "🇵🇬", country: "Papua New Guinea" },
  { code: "+595", flag: "🇵🇾", country: "Paraguay" },
  { code: "+51", flag: "🇵🇪", country: "Peru" },
  { code: "+63", flag: "🇵🇭", country: "Philippines" },
  { code: "+48", flag: "🇵🇱", country: "Poland" },
  { code: "+351", flag: "🇵🇹", country: "Portugal" },
  { code: "+974", flag: "🇶🇦", country: "Qatar" },
  { code: "+40", flag: "🇷🇴", country: "Romania" },
  { code: "+7", flag: "🇷🇺", country: "Russia" },
  { code: "+250", flag: "🇷🇼", country: "Rwanda" },
  { code: "+966", flag: "🇸🇦", country: "Saudi Arabia" },
  { code: "+221", flag: "🇸🇳", country: "Senegal" },
  { code: "+381", flag: "��", country: "Serbia" },
  { code: "+248", flag: "🇸🇨", country: "Seychelles" },
  { code: "+232", flag: "🇸🇱", country: "Sierra Leone" },
  { code: "+65", flag: "🇸🇬", country: "Singapore" },
  { code: "+421", flag: "🇸🇰", country: "Slovakia" },
  { code: "+386", flag: "🇸🇮", country: "Slovenia" },
  { code: "+252", flag: "🇸🇴", country: "Somalia" },
  { code: "+27", flag: "🇿🇦", country: "South Africa" },
  { code: "+82", flag: "🇰🇷", country: "South Korea" },
  { code: "+211", flag: "🇸🇸", country: "South Sudan" },
  { code: "+34", flag: "🇪🇸", country: "Spain" },
  { code: "+94", flag: "🇱🇰", country: "Sri Lanka" },
  { code: "+249", flag: "🇸🇩", country: "Sudan" },
  { code: "+597", flag: "🇸🇷", country: "Suriname" },
  { code: "+268", flag: "�🇿", country: "Swaziland" },
  { code: "+46", flag: "🇸🇪", country: "Sweden" },
  { code: "+41", flag: "🇨�", country: "Switzerland" },
  { code: "+963", flag: "🇸🇾", country: "Syria" },
  { code: "+886", flag: "🇹🇼", country: "Taiwan" },
  { code: "+992", flag: "🇹🇯", country: "Tajikistan" },
  { code: "+255", flag: "🇹🇿", country: "Tanzania" },
  { code: "+66", flag: "🇹🇭", country: "Thailand" },
  { code: "+228", flag: "🇹�", country: "Togo" },
  { code: "+216", flag: "🇹🇳", country: "Tunisia" },
  { code: "+90", flag: "🇹🇷", country: "Turkey" },
  { code: "+993", flag: "🇹🇲", country: "Turkmenistan" },
  { code: "+256", flag: "🇺🇬", country: "Uganda" },
  { code: "+380", flag: "🇺🇦", country: "Ukraine" },
  { code: "+971", flag: "🇦🇪", country: "UAE" },
  { code: "+44", flag: "�🇧", country: "United Kingdom" },
  { code: "+1", flag: "🇺🇸", country: "United States" },
  { code: "+598", flag: "🇺🇾", country: "Uruguay" },
  { code: "+998", flag: "🇺🇿", country: "Uzbekistan" },
  { code: "+678", flag: "🇻🇺", country: "Vanuatu" },
  { code: "+58", flag: "🇻🇪", country: "Venezuela" },
  { code: "+84", flag: "🇻🇳", country: "Vietnam" },
  { code: "+967", flag: "🇾🇪", country: "Yemen" },
  { code: "+260", flag: "🇿🇲", country: "Zambia" },
  { code: "+263", flag: "🇿🇼", country: "Zimbabwe" },
]

export function NewsletterPopup({ 
  delaySeconds = 30, 
  scrollThreshold = 100 
}: NewsletterPopupProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [countryCode, setCountryCode] = useState(
    countryCodes.find(c => c.code === "+20") || countryCodes[0]
  )
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const [countrySearch, setCountrySearch] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const filteredCountries = countryCodes.filter(
    (country) =>
      country.country.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.includes(countrySearch)
  )

  useEffect(() => {
    const hasSubscribed = localStorage.getItem("newsletter_subscribed")
    if (hasSubscribed) return

    const handleScroll = () => {
      if (window.scrollY > scrollThreshold) {
        setHasScrolled(true)
      }
    }

    window.addEventListener("scroll", handleScroll)

    const timer = setTimeout(() => {
      if (hasScrolled) {
        setIsOpen(true)
      }
    }, delaySeconds * 1000)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(timer)
    }
  }, [hasScrolled, delaySeconds, scrollThreshold])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          phone: `${countryCode.code}${phone}` 
        }),
      })

      if (response.ok) {
        setIsSuccess(true)
        localStorage.setItem("newsletter_subscribed", "true")
        
        setTimeout(() => {
          setIsOpen(false)
        }, 2500)
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    sessionStorage.setItem("newsletter_dismissed", "true")
  }

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="sm:max-w-[420px] p-0 gap-0 border-0 shadow-2xl rounded-[28px] overflow-hidden"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <VisuallyHidden>
            <DialogTitle>Newsletter Subscription Success</DialogTitle>
          </VisuallyHidden>
          
          {/* Deep gradient background */}
          <div className="relative bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#115e59]">
            
            {/* Glassmorphism overlay with subtle gold border */}
            <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border-[1.5px] border-amber-400/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_60px_rgba(251,191,36,0.15)]">
              <div className="flex flex-col items-center justify-center py-12 px-8 text-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-teal-400/20 to-emerald-400/20 backdrop-blur-sm flex items-center justify-center mb-5 border border-amber-400/20 shadow-[0_0_30px_rgba(20,184,166,0.3)]">
                  <svg
                    className="w-10 h-10 text-amber-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ filter: 'drop-shadow(0 0 8px rgba(252, 211, 77, 0.6))' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-serif font-bold text-white mb-2" style={{ textShadow: '0 0 20px rgba(255,255,255,0.3)' }}>
                  Welcome Aboard!
                </h3>
                <p className="text-gray-200 text-sm">
                  Your journey to the perfect invitation begins now.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-[440px] p-0 gap-0 border-0 shadow-2xl rounded-[28px] overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <DialogTitle>Newsletter Subscription</DialogTitle>
        </VisuallyHidden>
        
        {/* Deep gradient background */}
        <div className="relative bg-gradient-to-br from-[#064e3b] via-[#0f766e] to-[#115e59]">
          
          {/* Glassmorphism overlay with subtle gold border */}
          <div className="relative backdrop-blur-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.03] border-[1.5px] border-amber-400/40 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_60px_rgba(251,191,36,0.15)]">
            
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute right-5 top-5 z-10 text-amber-200/60 hover:text-amber-100 transition-all duration-300 hover:rotate-90"
              aria-label="Close"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>

            <div className="px-8 pt-8 pb-8">
              {/* Logo */}
              <div className="flex justify-center mb-6">
                <Image
                  src="/logo.png"
                  alt="Digitiva"
                  width={120}
                  height={34}
                  className="h-auto w-[120px] opacity-95"
                  priority
                />
              </div>

              {/* Heading with elegant serif font */}
              <div className="text-center mb-7">
                <h2 
                  className="text-[28px] leading-[1.2] font-serif font-bold text-white mb-4 tracking-wide"
                  style={{ 
                    textShadow: '0 2px 20px rgba(255,255,255,0.15)',
                    fontFamily: 'Cormorant Garamond, serif'
                  }}
                >
                  UNLOCK YOUR DREAM
                  <br />
                  INVITATION!
                </h2>
                <p className="text-gray-200/90 text-[14px] leading-relaxed font-light">
                  Share your details to start crafting.
                  <br />
                  Your special moment deserves to shine.
                </p>
              </div>

              {/* Form with glass effect inputs */}
              <form onSubmit={handleSubmit} className="space-y-3.5">
                {/* Name Input with User Icon */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-emerald-200/70">
                    <User className="h-[17px] w-[17px]" strokeWidth={2} />
                  </div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full h-[52px] pl-[48px] pr-4 bg-white/[0.12] backdrop-blur-md border border-white/25 rounded-[14px] text-white text-[14px] placeholder:text-gray-300/50 focus:outline-none focus:border-amber-300/60 focus:bg-white/[0.16] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] transition-all duration-300"
                  />
                </div>

                {/* Phone Input with Phone Icon and Country Code Selector */}
                <div className="relative group">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-emerald-200/70">
                    <Phone className="h-[17px] w-[17px]" strokeWidth={2} />
                  </div>
                  
                  {/* Country Code Selector */}
                  <div className="absolute left-[44px] top-1/2 -translate-y-1/2 z-10">
                    <button
                      type="button"
                      onClick={() => {
                        setShowCountryDropdown(!showCountryDropdown)
                        setCountrySearch("")
                      }}
                      className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <span className="text-[16px] leading-none">{countryCode.flag}</span>
                      <span className="text-white/90 text-[13px] font-medium">{countryCode.code}</span>
                      <ChevronDown className="h-3 w-3 text-white/70" />
                    </button>
                    
                    {/* Dropdown */}
                    {showCountryDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-56 bg-[#064e3b]/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-xl z-20">
                        {/* Search Input */}
                        <div className="p-2 border-b border-white/10">
                          <input
                            type="text"
                            placeholder="Search country..."
                            value={countrySearch}
                            onChange={(e) => setCountrySearch(e.target.value)}
                            className="w-full px-3 py-1.5 bg-white/10 border border-white/20 rounded-lg text-white text-[13px] placeholder:text-gray-300/50 focus:outline-none focus:border-amber-300/60"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        
                        {/* Country List */}
                        <div className="max-h-60 overflow-y-auto">
                          {filteredCountries.length === 0 ? (
                            <div className="px-3 py-4 text-center text-gray-300 text-[12px]">
                              No countries found
                            </div>
                          ) : (
                            filteredCountries.map((country) => (
                              <button
                                key={country.code + country.country}
                                type="button"
                                onClick={() => {
                                  setCountryCode(country)
                                  setShowCountryDropdown(false)
                                  setCountrySearch("")
                                }}
                                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-white/10 transition-colors text-left"
                              >
                                <span className="text-[16px]">{country.flag}</span>
                                <span className="text-white text-[13px] font-medium min-w-[45px]">
                                  {country.code}
                                </span>
                                <span className="text-gray-300 text-[12px] truncate">
                                  {country.country}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <input
                    type="tel"
                    placeholder="XX XXX XXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    pattern="[0-9]{10}"
                    className="w-full h-[52px] pl-[130px] pr-4 bg-white/[0.12] backdrop-blur-md border border-white/25 rounded-[14px] text-white text-[14px] placeholder:text-gray-300/50 focus:outline-none focus:border-amber-300/60 focus:bg-white/[0.16] focus:shadow-[0_0_0_3px_rgba(251,191,36,0.1)] transition-all duration-300"
                  />
                </div>

                {/* Glossy CTA Button with gradient and glow */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-[52px] mt-5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-[14px] font-bold rounded-[14px] hover:from-teal-400 hover:to-emerald-400 focus:outline-none focus:ring-2 focus:ring-amber-300/50 focus:ring-offset-2 focus:ring-offset-transparent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_8px_32px_rgba(20,184,166,0.35)] hover:shadow-[0_8px_40px_rgba(20,184,166,0.5)] hover:scale-[1.01] active:scale-[0.99]"
                  style={{ 
                    letterSpacing: '0.08em',
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                  }}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      PROCESSING...
                    </span>
                  ) : (
                    "LET'S CELEBRATE!"
                  )}
                </button>
              </form>

              {/* Footer */}
              <p className="text-gray-300/60 text-[12px] text-center mt-5 leading-relaxed font-light">
                We value your privacy. Your details are safe with us.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
