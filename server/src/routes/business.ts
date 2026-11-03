import { Router, Response } from 'express'
import { requireAuth, AuthRequest } from '../middleware/auth'
import prisma from '../lib/prisma'

const router = Router()

// All business routes require auth
router.use(requireAuth)

// ─── GET /api/business/me ─────────────────────────────────────────────────────
// Returns the user's business + its first menu (with categories & products)
router.get('/me', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const business = await prisma.business.findFirst({
      where: { userId: req.userId },
      include: {
        menus: {
          take: 1,
          include: {
            categories: {
              orderBy: { order: 'asc' },
              include: {
                products: { orderBy: { order: 'asc' } },
              },
            },
            qrCode: true,
          },
        },
      },
    })
    res.json({ business: business || null })
  } catch (err) {
    console.error('GET /business/me:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// ─── POST /api/business ──────────────────────────────────────────────────────
// Create business + initial menu (called after onboarding step 1)
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, tagline, phone, whatsapp, location, address, logoBase64, instagram, facebook } = req.body
    if (!name) { res.status(400).json({ message: 'Business name is required' }); return }

    // Generate unique slug from name
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    let slug = baseSlug
    let attempt = 0
    while (await prisma.business.findUnique({ where: { slug } })) {
      attempt++
      slug = `${baseSlug}-${attempt}`
    }

    const business = await prisma.business.create({
      data: {
        userId: req.userId!,
        name,
        slug,
        tagline: tagline || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        instagram: instagram || null,
        facebook: facebook || null,
        location: location || null,
        address: address || null,
        logoUrl: logoBase64 || null,
      },
    })

    // Auto-create a default menu for this business
    const menuSlug = `menu-${slug}`
    const menu = await prisma.menu.create({
      data: {
        businessId: business.id,
        name: `${name} Menu`,
        slug: menuSlug,
      },
    })

    res.status(201).json({ business, menu })
  } catch (err) {
    console.error('POST /business:', err)
    res.status(500).json({ message: 'Failed to create business' })
  }
})

// ─── PUT /api/business/:id ────────────────────────────────────────────────────
// Update business details
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params
    // Ensure ownership
    const existing = await prisma.business.findFirst({ where: { id, userId: req.userId } })
    if (!existing) { res.status(404).json({ message: 'Business not found' }); return }

    const {
      name, tagline, description, phone, whatsapp,
      email, website, instagram, facebook,
      location, address, openingHours, logoBase64,
    } = req.body

    // If name changed, regenerate slug
    let slug = existing.slug
    if (name && name !== existing.name) {
      const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      slug = baseSlug
      let attempt = 0
      while (true) {
        const conflict = await prisma.business.findUnique({ where: { slug } })
        if (!conflict || conflict.id === id) break
        attempt++
        slug = `${baseSlug}-${attempt}`
      }
    }

    const updated = await prisma.business.update({
      where: { id },
      data: {
        ...(name && { name, slug }),
        ...(tagline !== undefined && { tagline }),
        ...(description !== undefined && { description }),
        ...(phone !== undefined && { phone }),
        ...(whatsapp !== undefined && { whatsapp }),
        ...(email !== undefined && { email }),
        ...(website !== undefined && { website }),
        ...(instagram !== undefined && { instagram }),
        ...(facebook !== undefined && { facebook }),
        ...(location !== undefined && { location }),
        ...(address !== undefined && { address }),
        ...(openingHours !== undefined && { openingHours }),
        ...(logoBase64 !== undefined && { logoUrl: logoBase64 || null }),
      },
    })

    res.json({ business: updated })
  } catch (err) {
    console.error('PUT /business/:id:', err)
    res.status(500).json({ message: 'Failed to update business' })
  }
})

export default router
