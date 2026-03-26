"use client"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/template-translations"
import { MessageCircle } from "lucide-react"

export default function HandwrittenMessage() {
  const t = useTranslation()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [currentColor, setCurrentColor] = useState("#000000")
  const [currentWidth, setCurrentWidth] = useState(3)
  const [name, setName] = useState("")
  const [messageType, setMessageType] = useState<"drawn" | "written">("written")
  const [writtenText, setWrittenText] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [message, setMessage] = useState<{
    text: string
    type: "" | "success" | "error" | "info"
  }>({ text: "", type: "" })
  const [history, setHistory] = useState<string[]>([])
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null)
  const points = useRef<Array<{ x: number; y: number; pressure: number }>>([])
  const rafId = useRef<number | null>(null)
  const hasSavedToHistory = useRef(false)
  const canvasStateBeforeDrawing = useRef<ImageData | null>(null)
  const isProcessingStop = useRef(false)
  const penColors = [
    { color: "#000000", name: t("colorBlack") },
    { color: "#EF4444", name: t("colorRed") },
    { color: "#3B82F6", name: t("colorBlue") },
    { color: "#10B981", name: t("colorGreen") },
    { color: "#8B5CF6", name: t("colorPurple") },
    { color: "#F59E0B", name: t("colorOrange") },
  ]
  const penWidths = [
    { width: 2, name: t("widthThin") },
    { width: 3, name: t("widthMedium") },
    { width: 5, name: t("widthThick") },
    { width: 8, name: t("widthBold") },
  ]

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas?.parentElement) return
    const rect = canvas.parentElement.getBoundingClientRect()
    canvas.width = Math.min(1000, rect.width * 0.95)
    canvas.height = 600
    const context = canvas.getContext("2d")
    if (!context) return
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
    setCtx(context)
  }, [])

  useEffect(() => {
    if (ctx) {
      ctx.strokeStyle = currentColor
      ctx.lineWidth = currentWidth
    }
  }, [currentColor, currentWidth, ctx])

  const getCoords = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!canvasRef.current) return null
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const touch = "touches" in e ? e.touches[0] : null
    const clientX = touch ? touch.clientX : (e as React.MouseEvent).clientX
    const clientY = touch ? touch.clientY : (e as React.MouseEvent).clientY
    return {
      x: ((clientX - rect.left) * canvas.width) / rect.width,
      y: ((clientY - rect.top) * canvas.height) / rect.height,
    }
  }

  const drawLine = () => {
    if (!canvasRef.current || points.current.length < 2) return
    const context = canvasRef.current.getContext("2d")
    if (!context) return
    const pts = [...points.current]
    context.beginPath()
    context.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) {
      context.lineTo(pts[i].x, pts[i].y)
    }
    context.strokeStyle = currentColor
    context.lineWidth = currentWidth
    context.lineCap = "round"
    context.lineJoin = "round"
    context.stroke()
  }

  const startDrawing = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault()
    const coords = getCoords(e)
    if (!coords) return
    const c = canvasRef.current?.getContext("2d")
    if (c) canvasStateBeforeDrawing.current = c.getImageData(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    points.current = [{ ...coords, pressure: 0.5 }]
    hasSavedToHistory.current = false
    isProcessingStop.current = false
    const loop = () => {
      if (points.current.length >= 2) drawLine()
      rafId.current = requestAnimationFrame(loop)
    }
    rafId.current = requestAnimationFrame(loop)
  }

  const draw = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    e.preventDefault()
    const coords = getCoords(e)
    if (coords) points.current.push({ ...coords, pressure: 0.5 })
  }

  const stopDrawing = () => {
    if (isProcessingStop.current || !canvasRef.current) return
    isProcessingStop.current = true
    if (rafId.current) cancelAnimationFrame(rafId.current)
    rafId.current = null
    if (points.current.length < 2 && canvasStateBeforeDrawing.current) {
      canvasRef.current.getContext("2d")?.putImageData(canvasStateBeforeDrawing.current, 0, 0)
    }
    if (!hasSavedToHistory.current) {
      hasSavedToHistory.current = true
      setHistory((p) => [...p, canvasRef.current!.toDataURL()])
    }
    points.current = []
    isProcessingStop.current = false
  }

  const clearCanvas = () => {
    const c = canvasRef.current?.getContext("2d")
    if (c) {
      c.fillStyle = "white"
      c.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    }
    setHistory([])
  }

  const undo = () => {
    if (history.length === 0) return
    const img = new Image()
    img.onload = () => {
      const c = canvasRef.current?.getContext("2d")
      if (c) {
        c.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
        c.drawImage(img, 0, 0)
      }
    }
    img.src = history[history.length - 2] || ""
    setHistory((p) => p.slice(0, -1))
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      setMessage({ text: t("messageError"), type: "error" })
      return
    }
    if (messageType === "written" && !writtenText.trim()) {
      setMessage({ text: t("messageError"), type: "error" })
      return
    }
    setIsSending(true)
    setMessage({ text: t("sendingMessage"), type: "info" })
    try {
      const fd = new FormData()
      fd.append("name", name.trim())
      if (messageType === "drawn") {
        const blob = await new Promise<Blob | null>((r) =>
          canvasRef.current?.toBlob((b) => r(b), "image/png")
        )
        if (blob) fd.append("image", blob)
      } else {
        fd.append("message", writtenText)
      }
      const res = await fetch("/api/send-email", { method: "POST", body: fd })
      const data = await res.json()
      if (!res.ok || !data.success) throw new Error("Failed")
      setMessage({ text: t("messageSent"), type: "success" })
      if (messageType === "drawn") clearCanvas()
      else setWrittenText("")
      setName("")
    } catch {
      setMessage({ text: t("messageError"), type: "error" })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section
      id="message"
      className="py-16 px-4 md:py-20 bg-gradient-to-b from-transparent via-accent/5 to-transparent"
    >
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-16 bg-accent/40" />
            <MessageCircle className="w-8 h-8 text-accent" />
            <div className="h-px w-16 bg-accent/40" />
          </div>
          <h2 className="font-luxury text-5xl md:text-6xl text-foreground mb-6">
            {t("writeUsMessage")}
          </h2>
          <p className="font-luxury text-2xl italic text-muted-foreground mb-10">
            {t("writeUsDescription")}
          </p>
          <div className="bg-card/80 border border-accent/20 p-6 rounded-3xl shadow-2xl">
            <div className="flex gap-4 mb-6 justify-center">
              <button
                type="button"
                onClick={() => setMessageType("written")}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  messageType === "written"
                    ? "bg-accent text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t("writtenMessage")}
              </button>
              <button
                type="button"
                onClick={() => setMessageType("drawn")}
                className={`px-6 py-3 rounded-lg font-semibold ${
                  messageType === "drawn"
                    ? "bg-accent text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {t("drawnMessage")}
              </button>
            </div>
            {messageType === "written" ? (
              <textarea
                value={writtenText}
                onChange={(e) => setWrittenText(e.target.value)}
                placeholder={t("writeYourMessage")}
                rows={6}
                className="w-full px-4 py-3 border rounded-lg mb-4"
              />
            ) : (
              <>
                <div className="flex gap-2 justify-center mb-4">
                  {penColors.map((p) => (
                    <button
                      key={p.color}
                      type="button"
                      onClick={() => setCurrentColor(p.color)}
                      className={`w-8 h-8 rounded-full border-2 ${
                        currentColor === p.color ? "border-foreground" : ""
                      }`}
                      style={{ backgroundColor: p.color }}
                    />
                  ))}
                </div>
                <div
                  className="border rounded-lg mb-4 overflow-hidden"
                  style={{ touchAction: "none" }}
                >
                  <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full h-[400px] bg-white cursor-crosshair touch-none"
                    style={{ userSelect: "none" }}
                  />
                </div>
                <div className="flex gap-2 mb-4">
                  <button
                    type="button"
                    onClick={undo}
                    disabled={history.length === 0}
                    className="px-4 py-2 bg-muted rounded-lg"
                  >
                    {t("undo")}
                  </button>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="px-4 py-2 bg-muted rounded-lg"
                  >
                    {t("clearDrawing")}
                  </button>
                </div>
              </>
            )}
            <form onSubmit={sendMessage} className="space-y-4">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("yourName")}
                className="w-full px-4 py-3 border rounded-lg"
                required
              />
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-medium disabled:opacity-50"
              >
                {isSending ? t("sendingMessage") : t("sendMessage")}
              </button>
              {message.text && (
                <p
                  className={`text-center p-3 rounded ${
                    message.type === "error"
                      ? "bg-destructive/10 text-destructive"
                      : message.type === "success"
                        ? "bg-green-100 text-green-800"
                        : "bg-muted"
                  }`}
                >
                  {message.text}
                </p>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
