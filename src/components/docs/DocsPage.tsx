import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ConnectKitButton } from 'connectkit'
import {
  Search,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Info,
  AlertTriangle,
  Lightbulb,
  Menu,
  X,
  Mail,
  Copy,
  Check,
} from 'lucide-react'
import { DOC_SECTIONS, DOC_ARTICLES, type DocArticle } from './docsData'
import { DocsQuickstart } from './DocsQuickstart'

// ── Brand Logo Mark & Wordmark ───────────────────────────────────────────────
function BrandLogo({ className = 'h-8 w-auto' }: { className?: string }) {
  return (
    <img
      src="/brand/fundora-logo-mark.png"
      alt=""
      className={`${className} object-contain shrink-0`}
      width={39}
      height={32}
      loading="eager"
    />
  )
}

function BrandWordmark({ className = 'h-5 sm:h-5.5 w-auto' }: { className?: string }) {
  return (
    <img
      src="/brand/fundora-logo-text.png"
      alt="Fundora"
      className={`${className} object-contain shrink-0`}
      height={22}
      loading="eager"
    />
  )
}

// ── Interactive Support Card ─────────────────────────────────────────────────
function DocsSupportCard() {
  const [copied, setCopied] = useState(false)
  const email = 'sytherrhere12@gmail.com'

  const handleCopy = () => {
    void navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div
      className="p-6 sm:p-8 rounded-3xl border shadow-xs my-6"
      style={{
        background: 'linear-gradient(135deg, rgba(235, 242, 247, 0.7) 0%, rgba(240, 253, 250, 0.7) 100%)',
        borderColor: 'var(--brand-border)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white border border-brand-border text-brand">
            <Mail size={12} />
            <span>Direct Support Desk</span>
          </div>
          <h3 className="font-jakarta font-bold text-xl text-midnight">
            Need Help or Have Questions?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
            Reach out directly for assistance with your grants, hackathons, milestone reviews, or platform feedback. We reply to all inquiries promptly.
          </p>
          <div className="pt-2 flex items-center gap-2">
            <span className="font-mono text-sm font-bold text-midnight bg-white/90 px-3 py-1.5 rounded-xl border border-border">
              {email}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white border border-border text-slate-700 hover:text-midnight hover:bg-slate-50 transition-all shadow-xs"
          >
            {copied ? (
              <>
                <Check size={14} className="text-teal" />
                <span className="text-teal font-bold">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy size={14} className="text-slate-500" />
                <span>Copy Email</span>
              </>
            )}
          </button>

          <a
            href={`mailto:${email}?subject=Fundora%20Support%20Request`}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-midnight text-white hover:bg-slate-800 transition-all shadow-xs"
          >
            <Mail size={14} />
            <span>Send Email</span>
          </a>
        </div>
      </div>
    </div>
  )
}

interface DocsPageProps {
  onNavigate: (view: string, mode?: 'demo' | 'live') => void
  initialArticleId?: string
}

export function DocsPage({ onNavigate, initialArticleId = 'overview' }: DocsPageProps) {
  // Read article from URL hash if present (e.g. #docs/quickstart or #quickstart)
  const [activeArticleId, setActiveArticleId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '')
      if (hash.startsWith('docs/')) {
        const slug = hash.replace('docs/', '')
        if (DOC_ARTICLES[slug]) return slug
      } else if (DOC_ARTICLES[hash]) {
        return hash
      }
    }
    return initialArticleId && DOC_ARTICLES[initialArticleId] ? initialArticleId : 'overview'
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Sync hash when article changes
  const selectArticle = (articleId: string) => {
    if (!DOC_ARTICLES[articleId]) return
    setActiveArticleId(articleId)
    setMobileMenuOpen(false)
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#docs/${articleId}`)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Active article data
  const currentArticle: DocArticle = DOC_ARTICLES[activeArticleId] || DOC_ARTICLES.overview

  // Flattened article order for Next / Prev navigation
  const flattenedArticles = useMemo(() => {
    const list: DocArticle[] = []
    DOC_SECTIONS.forEach((section) => {
      section.articles.forEach((id) => {
        if (DOC_ARTICLES[id]) list.push(DOC_ARTICLES[id])
      })
    })
    return list
  }, [])

  const currentIndex = flattenedArticles.findIndex((a) => a.id === currentArticle.id)
  const prevArticle = currentIndex > 0 ? flattenedArticles[currentIndex - 1] : null
  const nextArticle = currentIndex < flattenedArticles.length - 1 ? flattenedArticles[currentIndex + 1] : null

  // Filtered articles when searching
  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase().trim()
    return Object.values(DOC_ARTICLES).filter((article) => {
      return (
        article.title.toLowerCase().includes(q) ||
        article.description.toLowerCase().includes(q) ||
        article.section.toLowerCase().includes(q) ||
        article.keywords.some((k) => k.toLowerCase().includes(q))
      )
    })
  }, [searchQuery])

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: 'var(--warm-bg)' }}>
      {/* ── Topbar ───────────────────────────────────────────────────────── */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-md"
        style={{
          background: 'rgba(247, 248, 246, 0.94)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Left: Brand + Docs Pill */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="flex items-center gap-2.5 text-left outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
              aria-label="Back to Fundora landing page"
            >
              <BrandLogo className="h-8 w-auto transition-transform duration-200 hover:scale-105" />
              <BrandWordmark />
            </button>

            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full border hidden sm:inline-flex items-center gap-1"
              style={{
                background: 'var(--brand-light)',
                color: 'var(--brand)',
                borderColor: 'var(--brand-border)',
              }}
            >
              <BookOpen size={11} />
              <span>Docs</span>
            </span>
          </div>

          {/* Center: Search input (desktop) */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <div
              className="relative w-full flex items-center rounded-xl border bg-white px-3 py-1.5 focus-within:ring-2 focus-within:ring-brand/40"
              style={{ borderColor: 'var(--border)' }}
            >
              <Search size={14} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documentation, guides, or concepts..."
                className="w-full text-xs text-midnight placeholder:text-slate-400 bg-transparent outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-slate-400 hover:text-midnight text-xs ml-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-midnight hover:bg-slate-200/60 transition-colors"
            >
              <ArrowLeft size={13} />
              <span>Back to Home</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-midnight text-white hover:bg-slate-800 transition-colors shadow-xs"
            >
              <span>Launch App</span>
              <ArrowRight size={13} />
            </button>

            <ConnectKitButton />

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-xl border text-slate-700 hover:bg-white transition-colors"
              style={{ borderColor: 'var(--border)' }}
              aria-label="Toggle docs navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t overflow-hidden"
              style={{ background: 'var(--warm-surface)', borderColor: 'var(--border)' }}
            >
              <div className="p-4 space-y-4">
                {/* Search */}
                <div
                  className="relative w-full flex items-center rounded-xl border bg-white px-3 py-2"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <Search size={14} className="text-slate-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search docs..."
                    className="w-full text-xs text-midnight placeholder:text-slate-400 bg-transparent outline-none"
                  />
                </div>

                {/* Quick Navigation Links */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onNavigate('landing')
                    }}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold border text-center text-slate-700 hover:bg-slate-50"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    Back to Home
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onNavigate('events')
                    }}
                    className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-midnight text-white text-center"
                  >
                    Launch App
                  </button>
                </div>

                {/* Mobile Sections List */}
                <div className="space-y-4 pt-2">
                  {DOC_SECTIONS.map((section) => (
                    <div key={section.title} className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2">
                        {section.title}
                      </div>
                      <div className="space-y-0.5">
                        {section.articles.map((artId) => {
                          const art = DOC_ARTICLES[artId]
                          if (!art) return null
                          const isActive = art.id === activeArticleId
                          return (
                            <button
                              key={art.id}
                              type="button"
                              onClick={() => selectArticle(art.id)}
                              className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                                isActive
                                  ? 'bg-brand text-white font-semibold'
                                  : 'text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {art.title}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main Layout: Sidebar + Article Body ──────────────────────────── */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* ── Left Sidebar (Desktop) ────────────────────────────────────── */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-24 space-y-6">
            <div
              className="p-4 rounded-2xl border"
              style={{
                background: 'var(--warm-surface)',
                borderColor: 'var(--border)',
              }}
            >
              {filteredArticles ? (
                /* Search Results View */
                <div className="space-y-2">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1 border-b border-slate-100">
                    Search Results ({filteredArticles.length})
                  </div>
                  {filteredArticles.length === 0 ? (
                    <div className="p-3 text-xs text-slate-500 italic">No matching guides found.</div>
                  ) : (
                    <div className="space-y-1 max-h-[70vh] overflow-y-auto">
                      {filteredArticles.map((art) => (
                        <button
                          key={art.id}
                          type="button"
                          onClick={() => {
                            selectArticle(art.id)
                            setSearchQuery('')
                          }}
                          className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors"
                        >
                          <div className="text-xs font-bold text-midnight">{art.title}</div>
                          <div className="text-[11px] text-slate-500 truncate">{art.description}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                /* Standard Grouped Sections */
                <div className="space-y-5 max-h-[78vh] overflow-y-auto pr-1">
                  {DOC_SECTIONS.map((section) => (
                    <div key={section.title} className="space-y-1">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-2.5 mb-1.5">
                        {section.title}
                      </div>
                      <div className="space-y-0.5">
                        {section.articles.map((artId) => {
                          const art = DOC_ARTICLES[artId]
                          if (!art) return null
                          const isActive = art.id === activeArticleId
                          return (
                            <button
                              key={art.id}
                              type="button"
                              onClick={() => selectArticle(art.id)}
                              className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                                isActive
                                  ? 'bg-brand text-white font-semibold shadow-xs'
                                  : 'text-slate-600 hover:text-midnight hover:bg-slate-100/70 font-medium'
                              }`}
                            >
                              <span>{art.title}</span>
                              {isActive && (
                                <ChevronRight size={13} className="text-white/80 shrink-0" />
                              )}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Network & Explorer Links */}
            <div
              className="p-4 rounded-2xl border text-xs space-y-2.5"
              style={{
                background: 'var(--warm-surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="font-jakarta font-bold text-xs text-midnight flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-teal" />
                <span>Verified Arc Escrow</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                All microgrants and prizes are settled in native USDC on Arc with sub-second finality.
              </p>
              <div className="pt-2 border-t border-slate-100 flex flex-col gap-1.5">
                <a
                  href="https://explorer.mainnet.arc.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between text-slate-600 hover:text-brand font-medium"
                >
                  <span>Arc Explorer</span>
                  <ExternalLink size={11} />
                </a>
                <a
                  href="https://arc.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-between text-slate-600 hover:text-brand font-medium"
                >
                  <span>Arc Network Official</span>
                  <ExternalLink size={11} />
                </a>
                <button
                  type="button"
                  onClick={() => selectArticle('support')}
                  className="inline-flex items-center justify-between text-brand hover:underline font-medium text-left pt-1 border-t border-slate-100/60"
                >
                  <span>Email Support Desk</span>
                  <Mail size={11} />
                </button>
              </div>
            </div>
          </aside>

          {/* ── Main Article Area ─────────────────────────────────────────── */}
          <main className="col-span-12 md:col-span-8 lg:col-span-9 space-y-8">
            {/* Breadcrumb Navigation */}
            <nav className="flex items-center gap-2 text-xs text-slate-500" aria-label="Breadcrumb">
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="hover:text-midnight transition-colors"
              >
                Home
              </button>
              <ChevronRight size={12} className="text-slate-400" />
              <button
                type="button"
                onClick={() => selectArticle('overview')}
                className="hover:text-midnight transition-colors"
              >
                Docs
              </button>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="text-slate-400">{currentArticle.section}</span>
              <ChevronRight size={12} className="text-slate-400" />
              <span className="font-semibold text-midnight truncate">{currentArticle.title}</span>
            </nav>

            {/* Article Header Card */}
            <div
              className="p-6 sm:p-8 rounded-3xl border shadow-xs"
              style={{
                background: 'var(--warm-surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center gap-2.5 mb-3 flex-wrap">
                <span
                  className="text-xs font-bold px-2.5 py-0.5 rounded-full border"
                  style={{
                    background: 'var(--brand-light)',
                    color: 'var(--brand)',
                    borderColor: 'var(--brand-border)',
                  }}
                >
                  {currentArticle.section}
                </span>
                {currentArticle.badge && (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full border"
                    style={{
                      background: 'var(--teal-light)',
                      color: 'var(--teal)',
                      borderColor: 'var(--teal-border)',
                    }}
                  >
                    {currentArticle.badge}
                  </span>
                )}
                <span className="text-xs text-slate-400">•</span>
                <span className="text-xs text-slate-500 font-medium">{currentArticle.readTime}</span>
              </div>

              <h1 className="font-jakarta font-extrabold text-2xl sm:text-3xl lg:text-4xl text-midnight tracking-tight mb-4">
                {currentArticle.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
                {currentArticle.content.lead}
              </p>
            </div>

            {/* Quickstart Interactive Component (only on quickstart page) */}
            {currentArticle.id === 'quickstart' && (
              <DocsQuickstart onNavigate={onNavigate} />
            )}

            {/* Support Interactive Card (only on support page) */}
            {currentArticle.id === 'support' && (
              <DocsSupportCard />
            )}

            {/* Article Subsections */}
            <div className="space-y-6">
              {currentArticle.content.sections.map((sec, idx) => (
                <div
                  key={idx}
                  className="p-6 sm:p-8 rounded-3xl border"
                  style={{
                    background: 'var(--warm-surface)',
                    borderColor: 'var(--border)',
                  }}
                >
                  <h2 className="font-jakarta font-bold text-lg sm:text-xl text-midnight mb-3">
                    {sec.heading}
                  </h2>

                  {/* Paragraphs */}
                  {sec.body && sec.body.length > 0 && (
                    <div className="space-y-3 mb-4">
                      {sec.body.map((p, pIdx) => (
                        <p key={pIdx} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                          {p}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Callout box */}
                  {sec.callout && (
                    <div
                      className="p-4 rounded-2xl border my-4 flex items-start gap-3"
                      style={{
                        background:
                          sec.callout.type === 'tip'
                            ? 'var(--amber-light)'
                            : sec.callout.type === 'success'
                              ? 'var(--teal-light)'
                              : sec.callout.type === 'important'
                                ? 'var(--coral-light)'
                                : 'var(--brand-light)',
                        borderColor:
                          sec.callout.type === 'tip'
                            ? 'var(--amber-border)'
                            : sec.callout.type === 'success'
                              ? 'var(--teal-border)'
                              : sec.callout.type === 'important'
                                ? 'var(--coral-border)'
                                : 'var(--brand-border)',
                      }}
                    >
                      <div className="mt-0.5 shrink-0">
                        {sec.callout.type === 'tip' && (
                          <Lightbulb size={16} className="text-amber" />
                        )}
                        {sec.callout.type === 'success' && (
                          <CheckCircle2 size={16} className="text-teal" />
                        )}
                        {sec.callout.type === 'important' && (
                          <AlertTriangle size={16} className="text-coral" />
                        )}
                        {sec.callout.type === 'info' && (
                          <Info size={16} className="text-brand" />
                        )}
                      </div>
                      <div>
                        <div
                          className="font-jakarta font-bold text-xs uppercase tracking-wider mb-1"
                          style={{
                            color:
                              sec.callout.type === 'tip'
                                ? 'var(--amber)'
                                : sec.callout.type === 'success'
                                  ? 'var(--teal)'
                                  : sec.callout.type === 'important'
                                    ? 'var(--coral)'
                                    : 'var(--brand)',
                          }}
                        >
                          {sec.callout.title}
                        </div>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {sec.callout.text}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Bullet items */}
                  {sec.bullets && sec.bullets.length > 0 && (
                    <ul className="space-y-2 my-4">
                      {sec.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 size={15} className="text-teal shrink-0 mt-0.5" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {/* Step cards */}
                  {sec.steps && sec.steps.length > 0 && (
                    <div className="space-y-3 my-4">
                      {sec.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="p-4 rounded-xl border flex items-start gap-3.5"
                          style={{
                            background: 'var(--warm-bg)',
                            borderColor: 'var(--border)',
                          }}
                        >
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5"
                            style={{ background: 'var(--brand)', color: '#ffffff' }}
                          >
                            {sIdx + 1}
                          </div>
                          <div>
                            <div className="font-jakarta font-bold text-sm text-midnight mb-1">
                              {step.title}
                            </div>
                            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                              {step.text}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination: Prev / Next Article */}
            <div
              className="p-6 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: 'var(--warm-surface)',
                borderColor: 'var(--border)',
              }}
            >
              {prevArticle ? (
                <button
                  type="button"
                  onClick={() => selectArticle(prevArticle.id)}
                  className="w-full sm:w-auto p-3 rounded-2xl border text-left hover:border-brand/40 transition-colors flex items-center gap-3"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <ArrowLeft size={16} className="text-slate-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Previous
                    </span>
                    <span className="font-jakarta font-bold text-xs sm:text-sm text-midnight">
                      {prevArticle.title}
                    </span>
                  </div>
                </button>
              ) : (
                <div />
              )}

              {nextArticle ? (
                <button
                  type="button"
                  onClick={() => selectArticle(nextArticle.id)}
                  className="w-full sm:w-auto p-3 rounded-2xl border text-right hover:border-brand/40 transition-colors flex items-center justify-end gap-3"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Next
                    </span>
                    <span className="font-jakarta font-bold text-xs sm:text-sm text-midnight">
                      {nextArticle.title}
                    </span>
                  </div>
                  <ArrowRight size={16} className="text-brand shrink-0" />
                </button>
              ) : (
                <div />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer
        className="border-t py-8 mt-12"
        style={{
          background: 'var(--warm-surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <BrandLogo className="h-5 w-auto" />
            <span>Fundora Documentation • Built on Arc Network</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate('landing')}
              className="hover:text-midnight transition-colors"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="hover:text-midnight transition-colors"
            >
              Explore Events
            </button>
            <button
              type="button"
              onClick={() => onNavigate('participant')}
              className="hover:text-midnight transition-colors"
            >
              Grants
            </button>
            <button
              type="button"
              onClick={() => onNavigate('organizer')}
              className="hover:text-midnight transition-colors"
            >
              Organize
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}
