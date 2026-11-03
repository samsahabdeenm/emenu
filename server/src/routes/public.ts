import { Router, Request, Response } from 'express'
import prisma from '../lib/prisma'

const router = Router()

// Day abbreviation for filtering
const DAY_ABBR = ['sun','mon','tue','wed','thu','fri','sat']

// ─── GET /api/public/menu/:slug ───────────────────────────────────────────────
// Customer-facing: returns full menu data for a business by slug
router.get('/menu/:slug', async (req: Request, res: Response): Promise<void> => {
  try {
    // Public menu is dynamic (template, menu items, availability). Never cache
    // an older rendered menu in the browser/proxy after a template change.
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Prefer client-supplied local date (passed from customer browser via ?localDate=YYYY-MM-DD)
    // so disabledDate always matches the restaurant timezone, not server UTC.
    const now = new Date()
    const serverDate = now.getFullYear() + '-' + String(now.getMonth()+1).padStart(2,'0') + '-' + String(now.getDate()).padStart(2,'0')
    const todayStr: string = (typeof req.query.localDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(req.query.localDate))
      ? req.query.localDate
      : serverDate

    // Bug fix: derive todayAbbr from todayStr (client date), NOT from server's new Date().getDay().
    // If client is IST (UTC+5:30) and server is UTC, the day-of-week could differ — e.g. client
    // sees Monday night while server still sees Sunday. Parsing todayStr keeps them in sync.
    const [y, m, d] = todayStr.split('-').map(Number)
    const todayAbbr = DAY_ABBR[new Date(y, m - 1, d).getDay()] // local midnight — day is always correct

    const business = await prisma.business.findUnique({
      where: { slug: req.params.slug },
      include: {
        menus: {
          where: { isPublished: true },
          take: 1,
          include: {
            categories: {
              orderBy: { order: 'asc' },
              include: {
                products: {
                  where: { isAvailable: true },
                  orderBy: { order: 'asc' },
                },
              },
            },
            qrCode: true,
          },
        },
      },
    })

    if (!business) { res.status(404).json({ message: 'Menu not found' }); return }

    // Check if menu exists but is unpublished (not the same as "closed today")
    const anyMenu = await prisma.menu.findFirst({ where: { businessId: business.id } })
    const menu = business.menus[0]  // only published menus

    if (!menu) {
      if (anyMenu) {
        // Menu exists but owner hasn't published it yet — show "coming soon" not "closed"
        res.status(200).json({
          comingSoon: true,
          business: { name: business.name, logoUrl: business.logoUrl, tagline: business.tagline },
        })
      } else {
        res.status(404).json({ message: 'Menu not found' })
      }
      return
    }

    if (menu.menuMode === 'UPLOAD') {
      res.json({
        business: {
          name: business.name,
          slug: business.slug,
          tagline: business.tagline,
          logoUrl: business.logoUrl,
          phone: business.phone,
          whatsapp: business.whatsapp,
          location: business.location,
          address: business.address,
          instagram: business.instagram,
          facebook: business.facebook,
          openingHours: business.openingHours,
        },
        menu: {
          id: menu.id,
          templateId: menu.templateId,
          todaysSpecialEnabled: menu.todaysSpecialEnabled,
          todaysSpecialTitle: menu.todaysSpecialTitle,
          todaysSpecialProductIds: menu.todaysSpecialProductIds,
          menuMode: 'UPLOAD',
          uploadedMenuImage: menu.uploadedMenuImage,
          uploadedMenuImages: menu.uploadedMenuImages || (menu.uploadedMenuImage ? [menu.uploadedMenuImage] : []),
          categories: [],
        },
      })
      return
    }

    res.json({
      business: {
        name: business.name,
        slug: business.slug,
        tagline: business.tagline,
        logoUrl: business.logoUrl,
        phone: business.phone,
        whatsapp: business.whatsapp,
        location: business.location,
        address: business.address,
        instagram: business.instagram,
        facebook: business.facebook,
        openingHours: business.openingHours,
      },
      menu: {
        id: menu.id,
        templateId: menu.templateId,
        todaysSpecialEnabled: menu.todaysSpecialEnabled,
        todaysSpecialTitle: menu.todaysSpecialTitle,
        todaysSpecialProductIds: menu.todaysSpecialProductIds,
        menuMode: menu.menuMode,
        uploadedMenuImage: menu.uploadedMenuImage,
        categories: menu.categories.map(cat => ({
          id: cat.id,
          name: cat.name,
          // Filter: if availableDays is empty → always available; else must include today
          products: cat.products
            .filter(p => p.disabledDate !== todayStr)
            .filter(p => !p.availableDays.length || p.availableDays.includes(todayAbbr))
            .map(p => ({
              id: p.id,
              name: p.name,
              description: p.description,
              price: p.price,
              imageUrl: p.imageUrl,
              isVeg: p.isVeg,
              isBestseller: p.isBestseller,
              isSpecial: p.isSpecial,
              highlightLabel: p.highlightLabel,
              tags: p.tags,
              availableDays: p.availableDays,
            })),
        })).filter(cat => cat.products.length > 0), // hide empty categories
      },
    })
  } catch (err) {
    console.error('GET /public/menu/:slug:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
