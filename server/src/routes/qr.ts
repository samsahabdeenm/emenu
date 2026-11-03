import { Router, Response } from 'express'
import QRCode from 'qrcode'
import { requireAuth, AuthRequest } from '../middleware/auth'
import prisma from '../lib/prisma'

const router = Router()
router.use(requireAuth)

const MENU_BASE_URL = process.env.MENU_BASE_URL || 'http://localhost:4000/menu'

// ─── GET /api/qr/:menuId ─────────────────────────────────────────────────────
router.get('/:menuId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menu = await prisma.menu.findFirst({
      where: { id: req.params.menuId, business: { userId: req.userId } },
      include: { qrCode: true },
    })
    if (!menu) { res.status(404).json({ message: 'Menu not found' }); return }

    if (!menu.qrCode) { res.json({ qrCode: null }); return }
    res.json({ qrCode: menu.qrCode })
  } catch (err) {
    res.status(500).json({ message: 'Server error' })
  }
})

// ─── POST /api/qr/:menuId/generate ───────────────────────────────────────────
router.post('/:menuId/generate', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const menu = await prisma.menu.findFirst({
      where: { id: req.params.menuId, business: { userId: req.userId } },
      include: { business: true, qrCode: true },
    })
    if (!menu) { res.status(404).json({ message: 'Menu not found' }); return }

    const publicUrl = `${MENU_BASE_URL}/${menu.business.slug}`

    // Generate QR as base64 PNG and SVG string
    const qrPng = await QRCode.toDataURL(publicUrl, {
      width: 400,
      margin: 2,
      color: { dark: '#0f3b68', light: '#ffffff' },
    })
    const qrSvg = await QRCode.toString(publicUrl, { type: 'svg', margin: 2 })

    let qrCode
    if (menu.qrCode) {
      qrCode = await prisma.qRCode.update({
        where: { menuId: menu.id },
        data: { publicUrl, qrPng, qrSvg },
      })
    } else {
      qrCode = await prisma.qRCode.create({
        data: { menuId: menu.id, publicUrl, qrPng, qrSvg },
      })
    }

    // Auto-publish menu when QR is generated
    await prisma.menu.update({
      where: { id: menu.id },
      data: { isPublished: true, publishedAt: menu.publishedAt || new Date() },
    })

    res.json({ qrCode, publicUrl })
  } catch (err) {
    console.error('QR generate error:', err)
    res.status(500).json({ message: 'Failed to generate QR code' })
  }
})

export default router
