"use client"

import { useLanguage } from "@/contexts/LanguageContext"
import { useInvitation } from "@/contexts/InvitationContext"

export type TranslationKey =
  | "loading"
  | "ourSpecialDay"
  | "countingMoments"
  | "joinUsAt"
  | "date"
  | "time"
  | "location"
  | "rsvpTitle"
  | "rsvpDescription"
  | "rsvpButton"
  | "rsvpFormName"
  | "rsvpFormGuests"
  | "rsvpFormSubmit"
  | "rsvpSuccess"
  | "rsvpError"
  | "venueMapTitle"
  | "venueMapLoading"
  | "venueMapError"
  | "days"
  | "hours"
  | "minutes"
  | "seconds"
  | "writeUsMessage"
  | "writeUsDescription"
  | "yourName"
  | "yourMessage"
  | "clearDrawing"
  | "undo"
  | "sendMessage"
  | "messageSent"
  | "messageError"
  | "footerMessage"
  | "sendingMessage"
  | "drawnMessage"
  | "writtenMessage"
  | "writeYourMessage"
  | "color"
  | "width"
  | "colorBlack"
  | "colorRed"
  | "colorBlue"
  | "colorGreen"
  | "colorPurple"
  | "colorOrange"
  | "widthThin"
  | "widthMedium"
  | "widthThick"
  | "widthBold"
  | "current"
  | "size"

const baseTranslations: Record<
  TranslationKey,
  { en: string; ar: string }
> = {
  loading: { en: "Loading invitation...", ar: "جاري تحميل الدعوة..." },
  ourSpecialDay: { en: "Our Special Day", ar: "يومنا الخاص" },
  countingMoments: {
    en: "Counting every moment to celebrate with you",
    ar: "نعد كل لحظة للاحتفال معكم",
  },
  joinUsAt: { en: "Join Us At", ar: "نلتقي في" },
  date: { en: "", ar: "" },
  time: { en: "", ar: "" },
  location: { en: "", ar: "" },
  rsvpTitle: { en: "Will You Join Us?", ar: "هل ستنضم إلينا؟" },
  rsvpDescription: {
    en: "We would be honored to have you celebrate with us on our special day",
    ar: "سيكون لنا الشرف بوجودكم معنا في يومنا الخاص",
  },
  rsvpButton: { en: "RSVP Now", ar: "تأكيد الحضور" },
  rsvpFormName: { en: "Your Name", ar: "الاسم" },
  rsvpFormGuests: { en: "Number of Guests", ar: "عدد الضيوف" },
  rsvpFormSubmit: { en: "Submit", ar: "إرسال" },
  rsvpSuccess: { en: "Thank you for your RSVP!", ar: "شكراً لتأكيد حضوركم!" },
  rsvpError: { en: "Please fill in all fields", ar: "الرجاء ملء جميع الحقول" },
  venueMapTitle: { en: "Venue Location", ar: "موقع القاعة" },
  venueMapLoading: { en: "Loading map...", ar: "جاري تحميل الخريطة..." },
  venueMapError: { en: "Failed to load map", ar: "فشل تحميل الخريطة" },
  days: { en: "Days", ar: "أيام" },
  hours: { en: "Hours", ar: "ساعات" },
  minutes: { en: "Minutes", ar: "دقائق" },
  seconds: { en: "Seconds", ar: "ثواني" },
  writeUsMessage: { en: "Write Us a Message", ar: "اكتبوا لنا رسالة" },
  writeUsDescription: {
    en: "Leave us a note or message",
    ar: "اتركوا لنا رسالة ",
  },
  yourName: { en: "Your Name", ar: "اسمك" },
  yourMessage: { en: "Your Message", ar: "رسالتك" },
  clearDrawing: { en: "Clear", ar: "مسح" },
  undo: { en: "Undo", ar: "تراجع" },
  sendMessage: { en: "Send Message", ar: "إرسال الرسالة" },
  messageSent: {
    en: "Message sent successfully!",
    ar: "تم إرسال الرسالة بنجاح!",
  },
  messageError: {
    en: "Please enter your name and write a message",
    ar: "الرجاء إدخال الاسم وكتابة رسالة",
  },
  footerMessage: {
    en: "We can't wait to celebrate with you",
    ar: "لا يمكننا الانتظار للاحتفال معكم",
  },
  sendingMessage: {
    en: "Sending your message...",
    ar: "جاري إرسال رسالتك...",
  },
  drawnMessage: { en: "Drawn Message", ar: "رسالة مرسومة" },
  writtenMessage: { en: "Written Message", ar: "رسالة مكتوبة" },
  writeYourMessage: {
    en: "Write your message here...",
    ar: "اكتب رسالتك هنا...",
  },
  color: { en: "Color", ar: "اللون" },
  width: { en: "Width", ar: "السُمك" },
  colorBlack: { en: "Black", ar: "أسود" },
  colorRed: { en: "Red", ar: "أحمر" },
  colorBlue: { en: "Blue", ar: "أزرق" },
  colorGreen: { en: "Green", ar: "أخضر" },
  colorPurple: { en: "Purple", ar: "بنفسجي" },
  colorOrange: { en: "Orange", ar: "برتقالي" },
  widthThin: { en: "Thin", ar: "رفيع" },
  widthMedium: { en: "Medium", ar: "متوسط" },
  widthThick: { en: "Thick", ar: "سميك" },
  widthBold: { en: "Bold", ar: "عريض" },
  current: { en: "Current", ar: "الحالي" },
  size: { en: "Size", ar: "الحجم" },
}

export function useTranslation() {
  const { language } = useLanguage()
  const invitation = useInvitation()

  return function t(key: TranslationKey): string {
    const base = baseTranslations[key][language]
    if (key === "date" && invitation?.event_date) {
      return new Date(invitation.event_date + "T12:00:00").toLocaleDateString(
        language === "ar" ? "ar-EG" : "en-US",
        { year: "numeric", month: "long", day: "numeric" }
      )
    }
    if (key === "time" && invitation?.event_time) return invitation.event_time
    if (key === "location" && invitation?.venue)
      return invitation.venue_address
        ? `${invitation.venue}, ${invitation.venue_address}`
        : invitation.venue
    return base || ""
  }
}
