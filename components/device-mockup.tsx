"use client"

import Image from "next/image"

interface DeviceMockupProps {
  type: "phone" | "laptop"
}

export function DeviceMockup({ type }: DeviceMockupProps) {
  if (type === "phone") {
    return (
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-[3.5rem] blur-2xl scale-105" />
        <div className="relative w-[260px] h-[540px] sm:w-[280px] sm:h-[580px] lg:w-[320px] lg:h-[660px] bg-foreground rounded-[3rem] p-3 shadow-2xl shadow-foreground/30">
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-32 h-6 sm:h-7 bg-foreground rounded-b-2xl z-10" />

          {/* Screen */}
          <div className="relative w-full h-full bg-card rounded-[2.5rem] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-rose-light to-rose-pale">
              {/* Envelope flap design - updated colors */}
              <div className="absolute top-0 left-0 right-0 h-36 sm:h-40">
                <svg viewBox="0 0 320 160" className="w-full h-full" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="flapGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#be4678" />
                      <stop offset="100%" stopColor="#8b3a5c" />
                    </linearGradient>
                  </defs>
                  <polygon points="0,0 160,120 320,0 320,160 0,160" fill="url(#flapGradient)" />
                  <polygon points="0,0 160,100 320,0" fill="#c95a87" />
                </svg>
              </div>

              {/* Floral decoration */}
              <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2">
                <Image
                  src="/elegant-blue-floral-arrangement-watercolor.jpg"
                  alt="Floral decoration"
                  width={180}
                  height={100}
                  className="opacity-90"
                />
              </div>

              {/* Invitation card */}
              <div className="absolute top-40 sm:top-44 left-3 sm:left-4 right-3 sm:right-4 bottom-3 sm:bottom-4 bg-white/95 rounded-xl shadow-xl p-4 sm:p-6 flex flex-col items-center justify-center text-center">
                <p className="text-[10px] sm:text-xs text-primary tracking-widest uppercase mb-2">Save the Date</p>
                <h3 className="font-script text-3xl sm:text-4xl text-primary mb-1">Omar</h3>
                <p className="text-[10px] sm:text-xs text-primary/70 tracking-wider">&</p>
                <h3 className="font-script text-3xl sm:text-4xl text-primary mb-3 sm:mb-4">Farah</h3>
                <p className="text-xs sm:text-sm text-primary/80 uppercase tracking-wider">Are Getting Married!</p>
                <div className="mt-3 sm:mt-4 bg-primary text-primary-foreground px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-lg">
                  <p className="text-xl sm:text-2xl font-serif">6th</p>
                  <p className="text-[10px] sm:text-xs uppercase tracking-wider">August</p>
                </div>

                {/* Wax seal */}
                <div className="absolute top-28 sm:top-32 right-3 sm:right-4 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-gold to-gold-dark rounded-full shadow-lg flex items-center justify-center">
                  <span className="text-white text-base sm:text-lg font-script">D</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute inset-0 bg-primary/15 rounded-2xl blur-2xl scale-105" />
      {/* Laptop frame */}
      <div className="relative w-[480px] lg:w-[500px] h-[300px] lg:h-[320px] bg-foreground rounded-t-xl p-2 shadow-2xl shadow-foreground/30">
        {/* Camera */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground/50 rounded-full" />

        {/* Screen - updated with rose theme */}
        <div className="relative w-full h-full bg-gradient-to-br from-primary to-rose-deep rounded-lg overflow-hidden">
          {/* Postcard style invitation */}
          <div className="absolute inset-3 lg:inset-4 bg-white rounded-lg shadow-inner flex">
            {/* Left side - stamps */}
            <div className="w-1/3 p-3 lg:p-4 border-r border-dashed border-primary/20 flex flex-col gap-2">
              <div className="w-14 lg:w-16 h-16 lg:h-20 border-2 border-primary p-1 rounded">
                <Image
                  src="/vintage-flower-stamp-magnolia.jpg"
                  alt="Stamp"
                  width={55}
                  height={70}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
              <div className="w-10 lg:w-12 h-12 lg:h-14 border-2 border-primary p-1 rounded">
                <Image
                  src="/vintage-botanical-stamp.jpg"
                  alt="Stamp"
                  width={40}
                  height={50}
                  className="w-full h-full object-cover rounded-sm"
                />
              </div>
              {/* Postmark */}
              <div className="mt-2 text-[7px] lg:text-[8px] text-primary/50 rotate-[-15deg]">
                <div className="border border-primary/30 rounded-full px-2 py-1">SAVE THE DATE</div>
              </div>
            </div>

            {/* Right side - message */}
            <div className="flex-1 p-3 lg:p-4 flex flex-col justify-center">
              <p className="font-script text-xl lg:text-2xl text-primary">You're Invited!</p>
              <p className="text-[10px] lg:text-xs text-muted-foreground mt-2 leading-relaxed">
                Join us for a beautiful celebration of love and togetherness.
              </p>
              <div className="mt-3 lg:mt-4 text-[10px] lg:text-xs text-primary">
                <p className="font-semibold">Emma & James</p>
                <p className="text-muted-foreground">June 15, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Laptop base */}
      <div className="relative w-[520px] lg:w-[540px] h-4 bg-foreground/90 rounded-b-lg mx-auto">
        <div className="w-20 h-1 bg-foreground/70 rounded-full mx-auto mt-1" />
      </div>
    </div>
  )
}
