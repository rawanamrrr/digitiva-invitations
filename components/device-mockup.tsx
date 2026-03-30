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
          <div className="relative w-full h-full bg-black rounded-[2.5rem] overflow-hidden">
            <video
              src="/Ahmed-sameha.mp4"
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
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
