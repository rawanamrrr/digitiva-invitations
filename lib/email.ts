import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const ADMIN_EMAIL = "digitivaa@gmail.com"

interface OrderDetails {
  brideName: string
  groomName: string
  eventType?: string | null
  eventDate: string
  eventTime: string
  venue: string
  packageName: string
  sections?: string[] | null
  extras?: string[] | null
  email?: string | null
  whatsapp?: string | null
  paymentMethod?: string | null
  orderCurrency: string
  orderTotal?: number | null
  discountCode?: string | null
  discountPercentage?: number | null
}

export async function sendOrderNotification(order: OrderDetails) {
  const sectionsText = order.sections?.length
    ? order.sections.join(", ")
    : "None"
  const extrasText = order.extras?.length
    ? order.extras.join(", ")
    : "None"

  const discountText = order.discountCode
    ? `${order.discountCode} (-${order.discountPercentage}%)`
    : "None"

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #fafafa; border-radius: 12px; overflow: hidden;">
      <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 32px 24px; text-align: center;">
        <h1 style="color: #e0c097; margin: 0; font-size: 24px; letter-spacing: 1px;">🎉 New Order Placed!</h1>
      </div>
      <div style="padding: 24px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px; width: 140px;">Couple</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-weight: 600;">${order.brideName} & ${order.groomName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Event Type</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${order.eventType || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Event Date</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${order.eventDate} at ${order.eventTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Venue</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${order.venue}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Package</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-weight: 600; text-transform: capitalize;">${order.packageName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Sections</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">${sectionsText}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Extras</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px;">${extrasText}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Payment Method</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; text-transform: capitalize;">${order.paymentMethod || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Total</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; font-weight: 700; font-size: 18px; color: #16213e;">${order.orderTotal ?? "N/A"} ${order.orderCurrency.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Discount</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${discountText}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Email</td>
            <td style="padding: 10px 12px; border-bottom: 1px solid #eee;">${order.email || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 10px 12px; color: #888; font-size: 13px;">WhatsApp</td>
            <td style="padding: 10px 12px;">${order.whatsapp || "N/A"}</td>
          </tr>
        </table>
      </div>
      <div style="padding: 16px 24px; background: #f0f0f0; text-align: center; font-size: 12px; color: #999;">
        Digitiva Invitations — Order Notification
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"Digitiva Orders" <${process.env.GMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: `🎊 New Order: ${order.brideName} & ${order.groomName} — ${order.packageName}`,
      html,
    })
  } catch (err) {
    // Log but don't throw — email failure shouldn't block the order
    console.error("Failed to send order notification email:", err)
  }
}
