"use client"

import { useEffect, useState, useMemo, useCallback, memo } from "react"
import { useTranslation } from "@/lib/template-translations"

interface CountdownTimerProps {
  targetDate: Date
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const CountdownTimer = memo(function CountdownTimer({
  targetDate,
}: CountdownTimerProps) {
  const t = useTranslation()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })
  const targetTimestamp = useMemo(() => targetDate.getTime(), [targetDate])
  const calculateTimeLeft = useCallback(() => {
    const difference = targetTimestamp - Date.now()
    if (difference > 0) {
      setTimeLeft((prev) => {
        const next = {
          days: Math.floor(difference / 86400000),
          hours: Math.floor((difference / 3600000) % 24),
          minutes: Math.floor((difference / 60000) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        }
        if (
          prev.days !== next.days ||
          prev.hours !== next.hours ||
          prev.minutes !== next.minutes ||
          prev.seconds !== next.seconds
        )
          return next
        return prev
      })
    }
  }, [targetTimestamp])

  useEffect(() => {
    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [calculateTimeLeft])

  const units = [
    { key: "days" as const, value: timeLeft.days },
    { key: "hours" as const, value: timeLeft.hours },
    { key: "minutes" as const, value: timeLeft.minutes },
    { key: "seconds" as const, value: timeLeft.seconds },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {units.map((unit, i) => (
        <div key={unit.key} className="group relative">
          <div
            className="relative flex flex-col items-center justify-center p-8 md:p-10 bg-gradient-to-br from-card via-card/95 to-accent/10 backdrop-blur-sm border-2 border-accent/30 shadow-xl"
            style={{
              clipPath:
                "polygon(15% 0%, 85% 0%, 100% 15%, 100% 85%, 85% 100%, 15% 100%, 0% 85%, 0% 15%)",
            }}
          >
            <div className="text-6xl md:text-7xl lg:text-8xl font-serif text-accent font-bold tracking-tight drop-shadow-lg">
              {unit.value.toString().padStart(2, "0")}
            </div>
            <div className="text-xs md:text-sm text-muted-foreground mt-4 uppercase tracking-widest font-semibold border-t-2 border-accent/20 pt-3 w-full text-center">
              {t(unit.key)}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
})

export default CountdownTimer
