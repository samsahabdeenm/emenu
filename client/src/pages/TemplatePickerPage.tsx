import { useState, useMemo } from 'react'
import { Check, Search, ChevronRight, ArrowLeft, Zap, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'

// ─── Template Data ────────────────────────────────────────────────────────────

export interface Template {
  id: string
  name: string
  type: string
  style: 'Light' | 'Dark'
  primary: string
  accent: string
  bg: string
  text: string
  cardBg: string
  border: string
  tagline: string
  emoji: string
  category: string
}

export const TEMPLATES: Template[] = [
  {
    id: '1', name: 'Classic', type: 'Restaurant', category: 'Restaurant',
    style: 'Light', primary: '#0f3b68', accent: '#0ea5a4',
    bg: '#ffffff', text: '#111827', cardBg: '#f9fafb', border: '#e5e7eb',
    tagline: 'Clean & professional', emoji: '🍽️',
  },
  {
    id: '2', name: 'Modern Dark', type: 'Cafe', category: 'Cafe',
    style: 'Dark', primary: '#0ea5a4', accent: '#e94560',
    bg: '#1a1a2e', text: '#f9fafb', cardBg: '#16213e', border: 'rgba(255,255,255,0.08)',
    tagline: 'Sleek & contemporary', emoji: '☕',
  },
  {
    id: '3', name: 'Fresh', type: 'Juice Shop', category: 'Juice Shop',
    style: 'Light', primary: '#059669', accent: '#10b981',
    bg: '#f0fdf4', text: '#111827', cardBg: '#dcfce7', border: '#bbf7d0',
    tagline: 'Fresh & vibrant', emoji: '🥤',
  },
  {
    id: '4', name: 'Minimal', type: 'Bakery', category: 'Bakery',
    style: 'Light', primary: '#7c3aed', accent: '#8b5cf6',
    bg: '#fafafa', text: '#111827', cardBg: '#f3f4f6', border: '#e5e7eb',
    tagline: 'Clean & minimal', emoji: '🍰',
  },
  {
    id: '5', name: 'Bold', type: 'Fast Food', category: 'Fast Food',
    style: 'Dark', primary: '#e11d48', accent: '#f59e0b',
    bg: '#1c1917', text: '#f9fafb', cardBg: '#292524', border: 'rgba(255,255,255,0.07)',
    tagline: 'Bold & energetic', emoji: '🍔',
  },
  {
    id: '6', name: 'Warm Spice', type: 'Indian Restaurant', category: 'Restaurant',
    style: 'Light', primary: '#b45309', accent: '#d97706',
    bg: '#fffbeb', text: '#111827', cardBg: '#fef3c7', border: '#fde68a',
    tagline: 'Warm & inviting', emoji: '🍛',
  },
  {
    id: '7', name: 'Royal', type: 'Fine Dining', category: 'Fine Dining',
    style: 'Dark', primary: '#7c3aed', accent: '#c084fc',
    bg: '#0f172a', text: '#f9fafb', cardBg: '#1e1b4b', border: 'rgba(255,255,255,0.07)',
    tagline: 'Elegant & luxurious', emoji: '👑',
  },
  {
    id: '8', name: 'Ocean', type: 'Seafood', category: 'Seafood',
    style: 'Light', primary: '#0369a1', accent: '#06b6d4',
    bg: '#f0f9ff', text: '#111827', cardBg: '#e0f2fe', border: '#bae6fd',
    tagline: 'Fresh & coastal', emoji: '🦞',
  },
  {
    id: '9', name: 'Garden', type: 'Vegan & Salads', category: 'Vegan',
    style: 'Light', primary: '#166534', accent: '#84cc16',
    bg: '#f7fee7', text: '#111827', cardBg: '#dcfce7', border: '#bbf7d0',
    tagline: 'Natural & wholesome', emoji: '🥗',
  },
  {
    id: '10', name: 'Ember', type: 'BBQ & Grill', category: 'Grill',
    style: 'Dark', primary: '#ea580c', accent: '#f97316',
    bg: '#1c1917', text: '#f9fafb', cardBg: '#292524', border: 'rgba(255,255,255,0.07)',
    tagline: 'Hot & smoky', emoji: '🔥',
  },
  {
    id: '11', name: 'Midnight', type: 'Bar & Lounge', category: 'Bar',
    style: 'Dark', primary: '#6366f1', accent: '#818cf8',
    bg: '#030712', text: '#f9fafb', cardBg: '#111827', border: 'rgba(255,255,255,0.07)',
    tagline: 'Moody & sophisticated', emoji: '🍸',
  },
  {
    id: '12', name: 'Blossom', type: 'Desserts & Sweets', category: 'Desserts',
    style: 'Light', primary: '#be185d', accent: '#f472b6',
    bg: '#fdf2f8', text: '#111827', cardBg: '#fce7f3', border: '#fbcfe8',
    tagline: 'Sweet & delightful', emoji: '🌸',
  },
  {
    id: '13', name: 'Earthy', type: 'Street Food', category: 'Street Food',
    style: 'Light', primary: '#92400e', accent: '#d97706',
    bg: '#fef9c3', text: '#111827', cardBg: '#fef3c7', border: '#fde68a',
    tagline: 'Rustic & homely', emoji: '🌮',
  },
  {
    id: '14', name: 'Steel', type: 'Modern Bistro', category: 'Bistro',
    style: 'Light', primary: '#1e293b', accent: '#64748b',
    bg: '#f8fafc', text: '#111827', cardBg: '#f1f5f9', border: '#e2e8f0',
    tagline: 'Sharp & corporate', emoji: '🍱',
  },
  {
    id: '15', name: 'Coral', type: 'Mediterranean', category: 'Mediterranean',
    style: 'Light', primary: '#c2410c', accent: '#fb923c',
    bg: '#fff7ed', text: '#111827', cardBg: '#ffedd5', border: '#fed7aa',
    tagline: 'Warm Mediterranean vibes', emoji: '🫒',
  },
]

// ─── Phone Mockup Preview ─────────────────────────────────────────────────────

const MOCK_ITEMS = [
  { name: 'Chicken Biryani', price: '₹200', veg: false, tag: 'Bestseller' },
  { name: 'Paneer Tikka', price: '₹160', veg: true, tag: null },
  { name: 'Dal Makhani', price: '₹130', veg: true, tag: 'Special' },
  { name: 'Butter Naan', price: '₹40', veg: true, tag: null },
]
const MOCK_CATS = ['Starters', 'Main Course', 'Breads', 'Desserts']

function PhonePreview({ template }: { template: Template }) {
  const isDark = template.style === 'Dark'

  return (
    <div className="relative select-none" style={{ width: 272 }}>
      {/* Glow behind phone */}
      <div
        className="absolute inset-0 rounded-[40px] blur-2xl opacity-30 -z-10 scale-95"
        style={{ background: template.primary }}
      />

      {/* Phone shell */}
      <div
        className="rounded-[40px] p-3 shadow-2xl border"
        style={{
          background: isDark ? '#1a1a1a' : '#2c2c2e',
          borderColor: isDark ? '#2d2d2d' : '#3a3a3c',
        }}
      >
        {/* Notch */}
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-b-2xl"
          style={{ width: 72, height: 22, background: isDark ? '#1a1a1a' : '#2c2c2e' }}
        />

        {/* Screen */}
        <div
          className="rounded-[32px] overflow-hidden"
          style={{ background: template.bg, minHeight: 540 }}
        >
          {/* Header */}
          <div style={{ background: template.primary, padding: '44px 14px 14px', textAlign: 'center' }}>
            <div
              className="mx-auto mb-2 flex items-center justify-center text-2xl"
              style={{
                width: 48, height: 48, borderRadius: '50%',
                background: 'rgba(255,255,255,0.18)',
              }}
            >
              {template.emoji}
            </div>
            <p style={{ color: '#fff', fontWeight: 800, fontSize: 13, margin: '0 0 2px' }}>Spice Garden</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 10, margin: '0 0 6px' }}>
              {template.type}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9 }}>📍 Chennai, TN</span>
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: 9 }}>⭐ 4.8</span>
            </div>
          </div>

          {/* Category tabs */}
          <div
            style={{
              display: 'flex', gap: 5, padding: '10px 10px 6px',
              overflowX: 'auto',
              borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#f0f0f0'}`,
              background: template.bg,
            }}
          >
            {MOCK_CATS.map((cat, i) => (
              <span
                key={cat}
                style={{
                  padding: '4px 10px',
                  borderRadius: 20,
                  fontSize: 9,
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  background: i === 0 ? template.accent : 'transparent',
                  color: i === 0 ? '#fff' : (isDark ? 'rgba(255,255,255,0.4)' : '#9ca3af'),
                  border: i === 0 ? 'none' : `1px solid ${template.border}`,
                }}
              >
                {cat}
              </span>
            ))}
          </div>

          {/* Items */}
          <div style={{ padding: '10px 10px 6px' }}>
            <p style={{
              fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: isDark ? 'rgba(255,255,255,0.35)' : '#9ca3af',
              marginBottom: 6,
            }}>
              Starters
            </p>
            {MOCK_ITEMS.slice(0, 3).map((item) => (
              <div
                key={item.name}
                style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                  padding: '8px 9px',
                  borderRadius: 9,
                  background: template.cardBg,
                  marginBottom: 5,
                  border: `1px solid ${template.border}`,
                }}
              >
                <div style={{ display: 'flex', gap: 7, flex: 1 }}>
                  <div style={{
                    width: 11, height: 11, flexShrink: 0, marginTop: 2,
                    borderRadius: 2,
                    border: `2px solid ${item.veg ? '#22c55e' : '#ef4444'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{
                      width: 4.5, height: 4.5, borderRadius: '50%',
                      background: item.veg ? '#22c55e' : '#ef4444',
                    }} />
                  </div>
                  <div>
                    <p style={{ color: template.text, fontSize: 10, fontWeight: 700, margin: '0 0 1px' }}>
                      {item.name}
                    </p>
                    {item.tag && (
                      <span style={{ color: '#f59e0b', fontSize: 8.5, fontWeight: 700 }}>
                        ★ {item.tag}
                      </span>
                    )}
                  </div>
                </div>
                <span style={{ color: template.accent, fontWeight: 800, fontSize: 11, flexShrink: 0 }}>
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            textAlign: 'center', padding: '6px 0 10px',
            color: isDark ? 'rgba(255,255,255,0.2)' : '#d1d5db',
            fontSize: 8.5,
          }}>
            ⬡ Powered by E-Menu
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Template Card (Right Panel) ──────────────────────────────────────────────

function TemplateCard({
  template,
  isSelected,
  onSelect,
}: {
  template: Template
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <button
      onClick={onSelect}
      className={clsx(
        'w-full flex items-center gap-3 px-4 py-3 text-left transition-all',
        isSelected
          ? 'bg-brand-teal/8 border-l-[3px] border-brand-teal'
          : 'border-l-[3px] border-transparent hover:bg-gray-50',
      )}
    >
      {/* Color swatch */}
      <div
        className="relative flex-shrink-0 rounded-xl overflow-hidden shadow-sm"
        style={{ width: 44, height: 58 }}
      >
        {/* Header strip */}
        <div style={{ height: '45%', background: template.primary }} />
        {/* Body */}
        <div className="p-1 space-y-0.5" style={{ background: template.bg, height: '55%' }}>
          {[1, 0.6, 0.4].map((opacity, i) => (
            <div
              key={i}
              className="rounded-sm"
              style={{
                height: 3,
                background: template.text,
                opacity: opacity * 0.25,
                width: `${[80, 60, 70][i]}%`,
              }}
            />
          ))}
        </div>
        {/* Accent dot */}
        <div
          className="absolute bottom-1.5 right-1.5 rounded-full"
          style={{ width: 8, height: 8, background: template.accent }}
        />
        {/* Selected checkmark */}
        {isSelected && (
          <div className="absolute inset-0 bg-brand-teal/20 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-brand-teal flex items-center justify-center shadow">
              <Check size={11} className="text-white" strokeWidth={3} />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className={clsx(
          'text-sm font-bold truncate',
          isSelected ? 'text-brand-teal' : 'text-gray-800',
        )}>
          {template.name}
        </p>
        <p className="text-xs text-gray-400 truncate">{template.type}</p>
        <span className={clsx(
          'inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded-md mt-1',
          template.style === 'Dark'
            ? 'bg-gray-800 text-gray-300'
            : 'bg-gray-100 text-gray-500',
        )}>
          {template.style}
        </span>
      </div>

      {isSelected && <ChevronRight size={14} className="text-brand-teal flex-shrink-0" />}
    </button>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function TemplatePickerPage() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState<Template>(TEMPLATES[0])
  const [search, setSearch] = useState('')

  const filtered = useMemo(
    () =>
      TEMPLATES.filter(
        (t) =>
          t.name.toLowerCase().includes(search.toLowerCase()) ||
          t.type.toLowerCase().includes(search.toLowerCase()) ||
          t.category.toLowerCase().includes(search.toLowerCase()),
      ),
    [search],
  )

  const handleUseTemplate = () => {
    // Store selected template and navigate to next step (menu editor)
    localStorage.setItem('emenu_selected_template', JSON.stringify(selected))
    navigate('/dashboard/menu-editor')
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* ── Main Preview Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h1 className="font-bold text-gray-900 text-base leading-tight">Choose a Template</h1>
              <p className="text-xs text-gray-400">Pick a design — you can change it anytime</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
            <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-[10px]">✓</span>
            <span className="text-gray-300">Details</span>
            <div className="w-6 h-px bg-gray-200" />
            <span className="w-5 h-5 rounded-full bg-brand-teal text-white flex items-center justify-center font-bold text-[10px]">2</span>
            <span className="text-brand-teal font-semibold">Template</span>
            <div className="w-6 h-px bg-gray-200" />
            <span className="w-5 h-5 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-bold text-[10px]">3</span>
            <span>Menu</span>
          </div>
        </div>

        {/* Preview area */}
        <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-6 py-8 px-4">
          {/* Template name badge */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{selected.emoji}</span>
            <div>
              <h2 className="font-extrabold text-gray-900 text-xl leading-tight">{selected.name}</h2>
              <p className="text-sm text-gray-400">{selected.type} · {selected.style} theme · {selected.tagline}</p>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="transition-all duration-300">
            <PhonePreview template={selected} />
          </div>

          {/* Color dots */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 font-medium">Colors</span>
            <div className="flex gap-2">
              <div
                className="w-5 h-5 rounded-full shadow-sm border border-white ring-2 ring-gray-200"
                style={{ background: selected.primary }}
                title="Primary"
              />
              <div
                className="w-5 h-5 rounded-full shadow-sm border border-white ring-2 ring-gray-200"
                style={{ background: selected.accent }}
                title="Accent"
              />
              <div
                className="w-5 h-5 rounded-full shadow-sm border border-gray-200 ring-2 ring-gray-200"
                style={{ background: selected.bg }}
                title="Background"
              />
            </div>
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{
                background: selected.style === 'Dark' ? '#1f2937' : '#f3f4f6',
                color: selected.style === 'Dark' ? '#9ca3af' : '#6b7280',
              }}
            >
              {selected.style}
            </span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="flex-shrink-0 px-6 py-4 bg-white border-t border-gray-100">
          <div className="flex items-center gap-4 max-w-sm mx-auto">
            <div className="flex-1">
              <p className="text-xs text-gray-500 leading-snug">
                <span className="font-semibold text-gray-700">{selected.name}</span> selected · You can change this later
              </p>
            </div>
            <button
              onClick={handleUseTemplate}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-teal text-white font-bold text-sm hover:bg-brand-teal-dark transition-all shadow-sm hover:shadow-md active:scale-95 flex-shrink-0"
            >
              <Zap size={14} />
              Use Template
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Right Panel ── */}
      <div className="w-72 xl:w-80 bg-white border-l border-gray-100 flex flex-col flex-shrink-0">
        {/* Panel header */}
        <div className="px-4 py-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-bold text-gray-800 text-sm">Templates</h3>
              <p className="text-xs text-gray-400">{TEMPLATES.length} available</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-brand-teal bg-brand-teal/8 px-2 py-1 rounded-lg font-semibold">
              <Check size={10} />
              {filtered.findIndex((t) => t.id === selected.id) + 1} of {filtered.length}
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-8 py-2 text-sm rounded-xl bg-gray-50 border border-gray-100 text-gray-700 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-teal/30 focus:border-brand-teal/50 transition"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>

        {/* Template list */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-300">
              <Search size={28} className="mb-2" />
              <p className="text-sm font-medium">No templates found</p>
              <button onClick={() => setSearch('')} className="text-xs text-brand-teal mt-1 hover:underline">
                Clear search
              </button>
            </div>
          ) : (
            filtered.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                isSelected={selected.id === template.id}
                onSelect={() => setSelected(template)}
              />
            ))
          )}
        </div>

        {/* Panel footer */}
        <div className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
          <p className="text-[10px] text-gray-300 text-center leading-relaxed">
            More templates available on Standard & Premium plans
          </p>
        </div>
      </div>
    </div>
  )
}
