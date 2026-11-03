import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'
import dotenv from 'dotenv'
import path from 'path'

dotenv.config()

import authRouter from './routes/auth'
import businessRouter from './routes/business'
import menuRouter from './routes/menu'
import qrRouter from './routes/qr'
import publicRouter from './routes/public'

const app = express()
const PORT = process.env.PORT || 4000
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`

// Fix: Render (and most cloud providers) sit behind a reverse proxy.
// Without this, express-rate-limit throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
// and cannot correctly identify client IPs.
app.set('trust proxy', 1)

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(helmet({
  // Allow inline scripts in app.html (standalone single-file app)
  contentSecurityPolicy: false,
}))

// Same-origin architecture: Express serves app.html AND the API.
// CORS only matters for cross-origin callers. Allow APP_URL + localhost for dev.
app.use(cors({
  origin: (origin, cb) => {
    // Allow same-origin requests (no Origin header) + configured origins
    if (!origin) return cb(null, true)
    const allowed = [APP_URL, `http://localhost:${PORT}`, 'http://localhost:4000', 'https://zenventora.in', 'https://www.zenventora.in', 'https://emenu.zenventora.in', 'https://zenventora.github.io']
    cb(null, allowed.includes(origin))
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}))

app.use(express.json({ limit: '25mb' }))   // allow up to 15MB source images after base64 encoding
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// ─── Static: serve app.html ──────────────────────────────────────────────────
// Local dev  (ts-node): __dirname = server/src  → ../../ = Emenu/
// Production (Docker):  __dirname = dist/       → ../   = /app  (app.html copied here)
const staticRoot = process.env.NODE_ENV === 'production'
  ? path.join(__dirname, '../')
  : path.join(__dirname, '../../')

app.use(express.static(staticRoot, {
  index: 'app.html',
  extensions: ['html'],
}))

// Uploads (local dev only — in production use object storage)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth',     authRouter)
app.use('/api/business', businessRouter)
app.use('/api/menu',     menuRouter)
app.use('/api/qr',       qrRouter)
app.use('/api/public',   publicRouter)

// Health check — used by Render / UptimeRobot
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() })
})

// ─── Customer menu page (QR scan) ────────────────────────────────────────────
// /menu/:slug serves app.html — client-side renders the public menu
app.get('/menu/:slug', (_req, res) => {
  // app.html contains the public-menu renderer. Do not let a browser/CDN keep
  // yesterday's renderer after a template is changed.
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.sendFile(path.join(staticRoot, 'app.html'))
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 E-Menu → ${APP_URL}`)
  console.log(`📋 API    → ${APP_URL}/api`)
  console.log(`🌍 ENV    → ${process.env.NODE_ENV || 'development'}`)
})

export default app
