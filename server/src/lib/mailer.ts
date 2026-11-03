import { Resend } from 'resend'

// Render blocks all outbound SMTP ports (25, 465, 587).
// Resend HTTP API uses HTTPS — works on all cloud providers including Render free tier.
// Set RESEND_API_KEY and FROM_EMAIL in Render environment variables.
const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@example.com'

export async function sendOTPEmail(to: string, name: string, otp: string): Promise<void> {
  // Dev mode: no API key configured → print OTP to server console
  if (!resendClient) {
    console.log(`\n╔══════════════════════════════╗`)
    console.log(`║   OTP for ${to.padEnd(20)} ║`)
    console.log(`║   Code: ${otp.padEnd(23)} ║`)
    console.log(`╚══════════════════════════════╝\n`)
    return
  }

  const { error } = await resendClient.emails.send({
    from: `E-Menu <${FROM_EMAIL}>`,
    to,
    subject: 'Your E-Menu OTP Code',
    html: `
      <div style="font-family:Inter,sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#f8fafc;border-radius:16px">
        <div style="background:linear-gradient(135deg,#0ea5a4,#0f3b68);padding:24px;border-radius:12px;text-align:center;margin-bottom:24px">
          <h1 style="color:#fff;font-size:1.5rem;margin:0;font-weight:900">E-Menu</h1>
        </div>
        <p style="color:#374151;font-size:1rem">Hi ${name},</p>
        <p style="color:#6b7280">Use this OTP to reset your password. It expires in 10 minutes.</p>
        <div style="background:#fff;border:2px dashed #0ea5a4;border-radius:12px;padding:24px;text-align:center;margin:24px 0">
          <p style="font-size:2.5rem;font-weight:900;letter-spacing:0.3em;color:#0f3b68;margin:0">${otp}</p>
        </div>
        <p style="color:#9ca3af;font-size:.8rem">If you didn't request this, ignore this email.</p>
      </div>
    `,
  })

  if (error) {
    throw new Error(`Resend error: ${error.message}`)
  }
}
