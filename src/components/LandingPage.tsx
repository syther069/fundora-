import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useReadContract } from 'wagmi'
import { formatUnits } from 'viem'
import {
  ArrowRight,
  ShieldCheck,
  Lock,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Compass,
  Award,
  Layers,
  Scale,
  Wallet,
  Globe,
  ChevronDown,
  Sparkles,
  BookOpen,
  Mail,
  LifeBuoy,
  Menu,
  X,
  Eye,
  KeyRound,
  Clock,
  Users,
  CircleDot,
  PlusCircle,
  Send,
} from 'lucide-react'
import {
  ARC_MAINNET_ID,
  ARC_USDC_ADDRESS,
  FUNDORA_ABI,
  ADMIN_REGISTRY_ABI,
  getContractAddress,
  getAdminRegistryAddress,
} from '../contracts/fundora'
import {
  FUNDORA_EVENTS_ABI,
  getFundoraEventsAddress,
} from '../contracts/fundoraEvents'
import { useLiveEvents } from '../hooks/useLiveEvents'

const USDC_ADDRESS = ARC_USDC_ADDRESS

const FUNDORA_ADDRESSES: Record<number, `0x${string}`> = {
  [ARC_MAINNET_ID]: getContractAddress(ARC_MAINNET_ID),
}

const FUNDORA_EVENTS_ADDRESSES: Record<number, `0x${string}`> = {
  [ARC_MAINNET_ID]: getFundoraEventsAddress(ARC_MAINNET_ID),
}

const ADMIN_REGISTRY_ADDRESSES: Record<number, `0x${string}`> = {
  [ARC_MAINNET_ID]: getAdminRegistryAddress(ARC_MAINNET_ID),
}

function getExplorerUrl(type: 'address' | 'tx', hash: string): string {
  return `https://explorer.mainnet.arc.io/${type}/${hash}`
}

function formatAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

interface LandingPageProps {
  onNavigate: (view: string, mode?: 'demo' | 'live') => void
  onSelectEvent?: (eventId: string) => void
  onOpenOrganizerWizard?: () => void
  onOpenApplyAdmin?: () => void
}

type ShowcaseTab = 'escrow' | 'milestones' | 'review'
type LifecycleDemoStage = 'open' | 'judging' | 'finalized'
type WorkflowType = 'events' | 'grants'
type RoleTab = 'organizer' | 'builder' | 'reviewer'
type DiscoveryStage = 0 | 1 | 2

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

function BrandWordmark({ className = 'h-5 sm:h-6 w-auto' }: { className?: string }) {
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

export function LandingPage({
  onNavigate,
  onSelectEvent,
  onOpenOrganizerWizard,
  onOpenApplyAdmin,
}: LandingPageProps) {
  const shouldReduce = useReducedMotion()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Interactive Hero Showcase State
  const [showcaseTab, setShowcaseTab] = useState<ShowcaseTab>('escrow')
  const [lifecycleStage, setLifecycleStage] = useState<LifecycleDemoStage>('open')
  const [selectedMilestoneIdx, setSelectedMilestoneIdx] = useState<number>(1)
  const [demoRubricScore, setDemoRubricScore] = useState<number>(92)

  // Section Interactive States
  const [workflowType, setWorkflowType] = useState<WorkflowType>('events')
  const [activeRoleTab, setActiveRoleTab] = useState<RoleTab>('organizer')
  const [discoveryStage, setDiscoveryStage] = useState<DiscoveryStage>(0)
  const verifyChainId = ARC_MAINNET_ID
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // ── Real Platform Data Reads (Public Read, No Wallet Required) ──────────────
  const { events: liveMainnetEvents, isLoading: liveEventsLoading } = useLiveEvents()

  const eventsContractAddress = FUNDORA_EVENTS_ADDRESSES[verifyChainId]
  const grantsContractAddress = FUNDORA_ADDRESSES[verifyChainId]
  const registryContractAddress = ADMIN_REGISTRY_ADDRESSES[verifyChainId]

  const { data: onchainEventCount } = useReadContract({
    address: eventsContractAddress,
    abi: FUNDORA_EVENTS_ABI,
    functionName: 'eventCount',
    chainId: verifyChainId,
  })

  const { data: onchainEventsPaused } = useReadContract({
    address: eventsContractAddress,
    abi: FUNDORA_EVENTS_ABI,
    functionName: 'paused',
    chainId: verifyChainId,
  })

  const { data: onchainGrantCount } = useReadContract({
    address: grantsContractAddress,
    abi: FUNDORA_ABI,
    functionName: 'grantCount',
    chainId: verifyChainId,
  })

  const { data: onchainTotalFunded } = useReadContract({
    address: grantsContractAddress,
    abi: FUNDORA_ABI,
    functionName: 'totalFunded',
    chainId: verifyChainId,
  })

  const { data: onchainAdminCount } = useReadContract({
    address: registryContractAddress,
    abi: ADMIN_REGISTRY_ABI,
    functionName: 'adminCount',
    chainId: verifyChainId,
  })

  const copyToClipboard = (value: string, key: string) => {
    void navigator.clipboard.writeText(value)
    setCopiedText(key)
    setTimeout(() => setCopiedText(null), 2000)
  }

  const scrollToSection = (sectionId: string) => {
    setMobileMenuOpen(false)
    const el = document.getElementById(sectionId)
    if (el) {
      el.scrollIntoView({ behavior: shouldReduce ? 'auto' : 'smooth', block: 'start' })
    }
  }

  const handleCreateAction = () => {
    setMobileMenuOpen(false)
    if (onOpenOrganizerWizard) {
      onOpenOrganizerWizard()
    } else {
      onNavigate('organizer')
    }
  }

  return (
    <div
      className="min-h-dvh flex flex-col selection:bg-brand-light selection:text-brand"
      style={{ background: 'var(--warm-bg)', color: 'var(--ink)' }}
    >
      {/* ═══════════════════════════════════════════════════════════════════════
          1. PUBLIC NAVIGATION BAR (Streamlined, Clean Hierarchy)
      ════════════════════════════════════════════════════════════════════════ */}
      <header
        role="banner"
        className="sticky top-0 z-40 backdrop-blur-md border-b transition-colors"
        style={{
          background: 'rgba(247, 248, 246, 0.90)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo (Left) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg"
              aria-label="Fundora home"
            >
              <BrandLogo className="h-8 w-auto transition-transform duration-200 group-hover:scale-105" />
              <div className="flex items-center gap-2">
                <BrandWordmark />
                <span
                  className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-0.5 rounded-full border"
                  style={{
                    background: 'var(--brand-light)',
                    color: 'var(--brand)',
                    borderColor: 'var(--brand-border)',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-teal" />
                  Arc
                </span>
              </div>
            </button>
          </div>

          {/* Centered Navigation Links + Create Button (Centric) */}
          <nav
            aria-label="Landing page navigation"
            className="hidden lg:flex items-center justify-center gap-1 flex-1 max-w-xl mx-auto"
          >
            {[
              { label: 'How', id: 'how-it-works' },
              { label: 'Features', id: 'features' },
              { label: 'Explore', id: 'discovery' },
              { label: 'Trust', id: 'verification' },
              { label: 'FAQ', id: 'faq' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => scrollToSection(item.id)}
                className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-midnight hover:bg-slate-200/50 transition-colors"
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={handleCreateAction}
              className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all hover:bg-white shadow-2xs"
              style={{
                color: 'var(--brand)',
                borderColor: 'var(--brand-border)',
                background: 'rgba(255, 255, 255, 0.85)',
              }}
            >
              <PlusCircle size={13} className="text-brand" />
              <span>Create</span>
            </button>
          </nav>

          {/* Right Action Group: Docs + Launch */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('docs')}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-midnight hover:bg-white transition-all"
            >
              <BookOpen size={13} className="text-brand" />
              <span>Docs</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="btn btn-primary btn-sm rounded-xl px-4 py-2 text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Launch</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate('events')}
              className="btn btn-primary btn-sm rounded-lg px-3.5 py-1.5 text-xs font-semibold"
            >
              Launch
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg border text-slate-700 hover:bg-white transition-colors"
              style={{ borderColor: 'var(--border)' }}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t overflow-hidden"
              style={{ background: 'var(--warm-surface)', borderColor: 'var(--border)' }}
            >
              <div className="px-4 py-4 space-y-3">
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { label: 'How', id: 'how-it-works' },
                    { label: 'Features', id: 'features' },
                    { label: 'Explore', id: 'discovery' },
                    { label: 'Trust', id: 'verification' },
                    { label: 'FAQ', id: 'faq' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                <div className="pt-3 border-t grid grid-cols-2 gap-2" style={{ borderColor: 'var(--border)' }}>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false)
                      onNavigate('docs')
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold border text-center inline-flex items-center justify-center gap-1.5"
                    style={{ borderColor: 'var(--brand-border)', background: 'var(--brand-light)', color: 'var(--brand)' }}
                  >
                    <BookOpen size={13} />
                    <span>Docs</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateAction}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold border text-center inline-flex items-center justify-center gap-1.5"
                    style={{ borderColor: 'var(--border)', background: 'var(--warm-bg)' }}
                  >
                    <PlusCircle size={13} className="text-brand" />
                    <span>Create</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main id="main-content" className="flex-1">
        {/* ═════════════════════════════════════════════════════════════════════
            2. CLEAN, PREMIUM FINTECH HERO SECTION
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          className="relative overflow-hidden pt-12 pb-16 sm:pt-20 sm:pb-24 border-b"
          style={{ borderColor: 'var(--border)' }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                'radial-gradient(circle at 18% 16%, rgba(26, 63, 117, 0.08), transparent 42%), radial-gradient(circle at 82% 24%, rgba(15, 118, 110, 0.07), transparent 40%)',
            }}
          />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
              {/* Left Column: Crisp 3-Element Value Proposition */}
              <div className="lg:col-span-6">
                <div
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6"
                  style={{
                    background: 'var(--warm-surface)',
                    borderColor: 'var(--brand-border)',
                    color: 'var(--brand)',
                  }}
                >
                  <ShieldCheck size={14} className="text-teal" />
                  <span>USDC Grants &amp; Hackathons on Arc</span>
                </div>

                <h1 className="font-jakarta font-extrabold text-4xl sm:text-5xl lg:text-[54px] text-midnight tracking-tight leading-[1.06] mb-5">
                  Fund great projects.
                  <br />
                  Pay builders on time.
                </h1>

                <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
                  Launch grants and hackathons with reserved USDC budgets, structured reviews, and instant payouts.
                </p>

                {/* 2 Focused Action Buttons */}
                <div className="flex flex-wrap items-center gap-3.5 mb-8">
                  <button
                    type="button"
                    onClick={() => onNavigate('events')}
                    className="btn btn-primary rounded-xl px-6 py-3.5 text-sm font-semibold inline-flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Explore</span>
                    <ArrowRight size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateAction}
                    className="px-6 py-3.5 rounded-xl text-sm font-semibold border transition-all inline-flex items-center justify-center gap-2 hover:bg-white"
                    style={{
                      background: 'var(--warm-surface)',
                      borderColor: 'var(--border-strong)',
                      color: 'var(--ink)',
                    }}
                  >
                    <PlusCircle size={16} className="text-brand" />
                    <span>Create</span>
                  </button>
                </div>

                {/* Quiet Single-Line Trust Strip */}
                <div
                  className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-5 border-t text-xs font-medium text-slate-600"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-teal shrink-0" />
                    <span>No wallet required to browse</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-teal shrink-0" />
                    <span>100% reserved USDC</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-teal shrink-0" />
                    <span>Instant payouts</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Clean Visual Fintech Vault Card */}
              <div className="lg:col-span-6">
                <div
                  className="rounded-2xl border p-2 sm:p-2.5 shadow-md"
                  style={{
                    background: 'var(--warm-bg-2)',
                    borderColor: 'var(--border-strong)',
                  }}
                >
                  <div
                    className="rounded-xl border overflow-hidden"
                    style={{
                      background: 'var(--warm-surface)',
                      borderColor: 'var(--border)',
                    }}
                  >
                    {/* Card Header with Compact Segmented Control */}
                    <div
                      className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3"
                      style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-teal" />
                        <span className="font-jakarta font-bold text-xs text-midnight">
                          {showcaseTab === 'escrow'
                            ? 'Hackathon Prize Vault'
                            : showcaseTab === 'milestones'
                              ? 'Milestone Grant Vault'
                              : 'Submission Scorecard'}
                        </span>
                      </div>

                      <div
                        className="inline-flex p-0.5 rounded-lg border"
                        style={{ background: 'var(--warm-bg-2)', borderColor: 'var(--border)' }}
                        role="tablist"
                        aria-label="Vault preview modes"
                      >
                        {[
                          { id: 'escrow' as ShowcaseTab, label: 'Hackathons' },
                          { id: 'milestones' as ShowcaseTab, label: 'Grants' },
                          { id: 'review' as ShowcaseTab, label: 'Reviews' },
                        ].map((tab) => {
                          const active = showcaseTab === tab.id
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => setShowcaseTab(tab.id)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                                active ? 'bg-white text-midnight shadow-2xs' : 'text-slate-500 hover:text-midnight'
                              }`}
                            >
                              {tab.label}
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    {/* Tab 1: Hackathons (Scannable Prize Tiers + Stage Selector) */}
                    {showcaseTab === 'escrow' && (
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-600">
                            Competition stage
                          </span>
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border"
                            style={{
                              background: 'var(--teal-light)',
                              color: 'var(--teal)',
                              borderColor: 'var(--teal-border)',
                            }}
                          >
                            <Lock size={12} />
                            Budget Reserved
                          </span>
                        </div>

                        {/* Compact 3-Step Pill Selector */}
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'open' as LifecycleDemoStage, label: '1. Open' },
                            { id: 'judging' as LifecycleDemoStage, label: '2. In Review' },
                            { id: 'finalized' as LifecycleDemoStage, label: '3. Completed' },
                          ].map((st) => {
                            const active = lifecycleStage === st.id
                            return (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => setLifecycleStage(st.id)}
                                className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                                  active ? 'ring-2 ring-brand/15' : 'hover:bg-slate-50'
                                }`}
                                style={{
                                  background: active ? 'var(--brand-light)' : 'var(--warm-bg)',
                                  borderColor: active ? 'var(--brand-border)' : 'var(--border)',
                                  color: active ? 'var(--brand)' : 'var(--ink)',
                                }}
                              >
                                {st.label}
                              </button>
                            )
                          })}
                        </div>

                        {/* Scannable Prize Tier Rows */}
                        <div className="space-y-2">
                          {[
                            { tier: '1st Place', track: 'Main Track' },
                            { tier: '2nd Place', track: 'Runner-Up' },
                            { tier: 'Track Bonus', track: 'Best Design' },
                          ].map((row) => (
                            <div
                              key={row.tier}
                              className="p-3 rounded-xl border flex items-center justify-between gap-3"
                              style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="text-xs font-bold text-midnight">{row.tier}</span>
                                <span className="text-xs text-slate-500">• {row.track}</span>
                              </div>
                              {lifecycleStage === 'open' && (
                                <span
                                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md border"
                                  style={{
                                    background: 'var(--teal-light)',
                                    color: 'var(--teal)',
                                    borderColor: 'var(--teal-border)',
                                  }}
                                >
                                  Reserved in USDC
                                </span>
                              )}
                              {lifecycleStage === 'judging' && (
                                <span
                                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md border"
                                  style={{
                                    background: 'var(--amber-light)',
                                    color: 'var(--amber)',
                                    borderColor: 'var(--amber-border)',
                                  }}
                                >
                                  Scoring Entries
                                </span>
                              )}
                              {lifecycleStage === 'finalized' && (
                                <span
                                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md border"
                                  style={{
                                    background: 'var(--brand-light)',
                                    color: 'var(--brand)',
                                    borderColor: 'var(--brand-border)',
                                  }}
                                >
                                  Payout Unlocked
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Milestone Grants (Clean Milestone Rows) */}
                    {showcaseTab === 'milestones' && (
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-600">
                            Stage-by-stage funding release
                          </span>
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border"
                            style={{
                              background: 'var(--brand-light)',
                              color: 'var(--brand)',
                              borderColor: 'var(--brand-border)',
                            }}
                          >
                            Reviewer Quorum
                          </span>
                        </div>

                        <div className="space-y-2">
                          {[
                            {
                              idx: 0,
                              step: '01',
                              title: 'Product scope & design',
                              state: 'Approved',
                              statusLine: 'Milestone 1 approved — USDC unlocked for immediate withdrawal',
                              badgeStyle: {
                                background: 'var(--teal-light)',
                                color: 'var(--teal)',
                                borderColor: 'var(--teal-border)',
                              },
                            },
                            {
                              idx: 1,
                              step: '02',
                              title: 'Working prototype & demo',
                              state: 'In Review',
                              statusLine: 'Deliverables submitted — awaiting reviewer approval vote',
                              badgeStyle: {
                                background: 'var(--amber-light)',
                                color: 'var(--amber)',
                                borderColor: 'var(--amber-border)',
                              },
                            },
                            {
                              idx: 2,
                              step: '03',
                              title: 'Public launch & final report',
                              state: 'Reserved',
                              statusLine: 'USDC safely reserved in vault until Milestone 2 completes',
                              badgeStyle: {
                                background: 'var(--warm-bg-2)',
                                color: 'var(--muted)',
                                borderColor: 'var(--border)',
                              },
                            },
                          ].map((m) => {
                            const selected = selectedMilestoneIdx === m.idx
                            return (
                              <button
                                key={m.idx}
                                type="button"
                                onClick={() => setSelectedMilestoneIdx(m.idx)}
                                className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-3 ${
                                  selected ? 'bg-white shadow-2xs ring-2 ring-brand/10' : 'hover:bg-white'
                                }`}
                                style={{
                                  background: selected ? 'var(--warm-surface)' : 'var(--warm-bg)',
                                  borderColor: selected ? 'var(--brand-border)' : 'var(--border)',
                                }}
                              >
                                <div className="flex items-center gap-2.5">
                                  <span className="font-mono text-xs font-semibold text-brand">
                                    {m.step}
                                  </span>
                                  <span className="text-xs font-semibold text-midnight">{m.title}</span>
                                </div>
                                <span
                                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md border shrink-0"
                                  style={m.badgeStyle}
                                >
                                  {m.state}
                                </span>
                              </button>
                            )
                          })}
                        </div>

                        <div
                          className="px-3.5 py-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs"
                          style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                        >
                          <span className="text-slate-600 font-medium">
                            {selectedMilestoneIdx === 0
                              ? 'Milestone 1 approved — USDC ready to claim'
                              : selectedMilestoneIdx === 1
                                ? 'Milestone 2 under reviewer evaluation'
                                : 'Milestone 3 funds reserved in grant vault'}
                          </span>
                          <span className="font-semibold text-teal shrink-0">Verified</span>
                        </div>
                      </div>
                    )}

                    {/* Tab 3: Submission Reviews (Interactive Scorecard) */}
                    {showcaseTab === 'review' && (
                      <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-slate-600">
                            Weighted evaluation rubric
                          </span>
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border tabular-nums"
                            style={{
                              background: 'var(--violet-light)',
                              color: 'var(--violet)',
                              borderColor: 'var(--violet-border)',
                            }}
                          >
                            Score: {demoRubricScore} / 100
                          </span>
                        </div>

                        <div
                          className="p-3.5 rounded-xl border space-y-2.5"
                          style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                        >
                          <div className="flex items-center justify-between">
                            <label htmlFor="demo-score-slider" className="text-xs font-semibold text-midnight">
                              Overall submission rating
                            </label>
                            <span className="text-xs font-bold text-brand tabular-nums">
                              {demoRubricScore} pts
                            </span>
                          </div>
                          <input
                            id="demo-score-slider"
                            type="range"
                            min={1}
                            max={100}
                            value={demoRubricScore}
                            onChange={(e) => setDemoRubricScore(Number(e.target.value))}
                            className="w-full accent-brand cursor-pointer"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {[
                            { label: 'Execution', weight: '35%' },
                            { label: 'Impact', weight: '25%' },
                            { label: 'User Experience', weight: '20%' },
                            { label: 'Clarity', weight: '20%' },
                          ].map((crit) => (
                            <div
                              key={crit.label}
                              className="p-3 rounded-xl border flex items-center justify-between"
                              style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                            >
                              <span className="text-xs font-medium text-slate-600">{crit.label}</span>
                              <span className="text-xs font-bold text-midnight tabular-nums">{crit.weight}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Sleek Single-Row Live Onchain Telemetry Bar ──────────────── */}
            <div
              className="mt-12 rounded-2xl border px-5 py-4 shadow-2xs flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              style={{
                background: 'var(--warm-surface)',
                borderColor: 'var(--border)',
              }}
            >
              <div className="flex items-center gap-2.5 shrink-0">
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span className="text-xs font-semibold text-midnight">
                  Live on Arc Mainnet
                </span>
              </div>

              <div
                className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-0 sm:divide-x flex-1 lg:max-w-3xl"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="sm:px-5 flex items-baseline justify-between sm:justify-start gap-2.5">
                  <span className="text-xs text-slate-500">Published events</span>
                  <span className="font-jakarta font-bold text-sm text-midnight tabular-nums">
                    {onchainEventCount !== undefined ? onchainEventCount.toString() : '0'}
                  </span>
                </div>

                <div className="sm:px-5 flex items-baseline justify-between sm:justify-start gap-2.5">
                  <span className="text-xs text-slate-500">Milestone grants</span>
                  <span className="font-jakarta font-bold text-sm text-midnight tabular-nums">
                    {onchainGrantCount !== undefined ? onchainGrantCount.toString() : '0'}
                    {onchainTotalFunded !== undefined && onchainTotalFunded > 0n
                      ? ` (${Number(formatUnits(onchainTotalFunded, 6)).toLocaleString('en-US')} USDC)`
                      : ''}
                  </span>
                </div>

                <div className="sm:px-5 flex items-baseline justify-between sm:justify-start gap-2.5">
                  <span className="text-xs text-slate-500">Organizers</span>
                  <span className="font-jakarta font-bold text-sm text-midnight tabular-nums">
                    {onchainAdminCount !== undefined ? onchainAdminCount.toString() : '0'}
                  </span>
                </div>

                <div className="sm:pl-5 flex items-baseline justify-between sm:justify-start gap-2.5">
                  <span className="text-xs text-slate-500">Settlement</span>
                  <span className="font-jakarta font-bold text-sm text-teal">
                    USDC
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            3. HOW FUNDORA WORKS SECTION
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="how-it-works"
          className="py-16 sm:py-24 border-b scroll-mt-16"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3"
                  style={{
                    background: 'var(--brand-light)',
                    color: 'var(--brand)',
                    borderColor: 'var(--brand-border)',
                  }}
                >
                  <Layers size={13} />
                  How it works
                </span>
                <h2 className="font-jakarta font-extrabold text-2xl sm:text-4xl text-midnight tracking-tight mb-3">
                  From launch to payout in four simple steps
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Run community hackathons with tiered prizes or fund individual builders across clear project milestones.
                </p>
              </div>

              {/* Program Type Switcher */}
              <div
                className="inline-flex p-1 rounded-xl border self-start"
                style={{ background: 'var(--warm-bg-2)', borderColor: 'var(--border)' }}
              >
                <button
                  type="button"
                  onClick={() => setWorkflowType('events')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    workflowType === 'events'
                      ? 'bg-white text-brand shadow-xs'
                      : 'text-slate-600 hover:text-midnight'
                  }`}
                >
                  Hackathons & Contests
                </button>
                <button
                  type="button"
                  onClick={() => setWorkflowType('grants')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                    workflowType === 'grants'
                      ? 'bg-white text-brand shadow-xs'
                      : 'text-slate-600 hover:text-midnight'
                  }`}
                >
                  Milestone Grants
                </button>
              </div>
            </div>

            {/* 4 Step Cards in Plain English */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(workflowType === 'events'
                ? [
                    {
                      step: '01',
                      role: 'Organizers',
                      title: 'Create and fund your event',
                      description:
                        'Set your tracks, submission deadlines, judging criteria, and prize tiers. The full USDC prize pool is reserved upfront so participants know the rewards are guaranteed.',
                      outcome: 'Prize budget is locked and visible to all applicants',
                      badge: 'Event setup',
                    },
                    {
                      step: '02',
                      role: 'Applicants',
                      title: 'Submit projects before the deadline',
                      description:
                        'Builders browse open competitions without needing an account, then submit their project summary, demo links, and repository through a guided application form.',
                      outcome: 'Applicants receive an instant submission confirmation receipt',
                      badge: 'Project entry',
                    },
                    {
                      step: '03',
                      role: 'Reviewers',
                      title: 'Review and score submissions',
                      description:
                        'Assigned reviewers evaluate each submission against your weighted criteria and assign a score from 1 to 100 to rank the top projects fairly.',
                      outcome: 'Scores combine automatically into a clear leaderboard',
                      badge: 'Evaluation',
                    },
                    {
                      step: '04',
                      role: 'Winners',
                      title: 'Publish results and claim payouts',
                      description:
                        'Organizers confirm the winners for each prize tier, and winning builders withdraw their USDC rewards directly from their dashboard at any time.',
                      outcome: 'Direct USDC payouts with unused tier funds returned to the host',
                      badge: 'Instant payout',
                    },
                  ]
                : [
                    {
                      step: '01',
                      role: 'Organizers',
                      title: 'Set up a milestone grant',
                      description:
                        'Choose the grant recipient and divide the total USDC funding into clear milestone payments that unlock as each stage of work is completed.',
                      outcome: 'Full grant budget is reserved upfront for the builder',
                      badge: 'Grant setup',
                    },
                    {
                      step: '02',
                      role: 'Builders',
                      title: 'Submit milestone deliverables',
                      description:
                        'As work progresses, the builder submits links to their completed deliverables, prototypes, or documentation for each milestone.',
                      outcome: 'Builders can easily update links if reviewers request revisions',
                      badge: 'Milestone update',
                    },
                    {
                      step: '03',
                      role: 'Reviewers',
                      title: 'Approve completed milestones',
                      description:
                        'Reviewers inspect the submitted work against the milestone goals and vote to approve the stage or ask for adjustments.',
                      outcome: 'Every approval is recorded clearly for both sides',
                      badge: 'Milestone review',
                    },
                    {
                      step: '04',
                      role: 'Builders',
                      title: 'Withdraw approved funding',
                      description:
                        'As soon as a milestone is approved, the USDC payment for that stage is unlocked so the builder can withdraw it immediately.',
                      outcome: 'Fast, predictable payouts without invoice delays',
                      badge: 'Direct withdrawal',
                    },
                  ]
              ).map((item) => (
                <div
                  key={item.step}
                  className="rounded-2xl border p-6 flex flex-col justify-between transition-shadow hover:shadow-md"
                  style={{ background: 'var(--warm-surface)', borderColor: 'var(--border)' }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-4">
                      <span
                        className="text-xs font-bold px-2.5 py-1 rounded-lg border"
                        style={{
                          background: 'var(--brand-light)',
                          color: 'var(--brand)',
                          borderColor: 'var(--brand-border)',
                        }}
                      >
                        Step {item.step} • {item.role}
                      </span>
                      <span className="text-xs font-medium text-slate-500">{item.badge}</span>
                    </div>

                    <h3 className="font-jakarta font-bold text-lg text-midnight mb-2">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5">{item.description}</p>
                  </div>

                  <div
                    className="rounded-xl p-3.5 border flex items-center gap-2 text-xs font-medium text-teal"
                    style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                  >
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>{item.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            4. KEY FEATURES & PLATFORM BENEFITS
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="features"
          className="py-16 sm:py-24 border-b scroll-mt-16"
          style={{ background: 'var(--warm-bg-2)', borderColor: 'var(--border)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mb-10">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3"
                style={{
                  background: 'var(--warm-surface)',
                  color: 'var(--brand)',
                  borderColor: 'var(--brand-border)',
                }}
              >
                <Sparkles size={13} />
                Features
              </span>
              <h2 className="font-jakarta font-extrabold text-2xl sm:text-4xl text-midnight tracking-tight mb-3">
                Everything you need to run and join funding programs
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Dedicated workspaces for organizers, builders, and reviewers keep applications, evaluations, and payouts simple and organized.
              </p>
            </div>

            {/* Role Selector Tabs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
              {[
                {
                  id: 'organizer' as RoleTab,
                  title: 'Grant & Event Organizers',
                  subtitle: 'Create programs, assign reviewers, and manage payouts',
                  icon: Award,
                },
                {
                  id: 'builder' as RoleTab,
                  title: 'Builders & Applicants',
                  subtitle: 'Discover opportunities, submit work, and claim rewards',
                  icon: Send,
                },
                {
                  id: 'reviewer' as RoleTab,
                  title: 'Program Reviewers',
                  subtitle: 'Evaluate submissions and approve completed milestones',
                  icon: Scale,
                },
              ].map((tab) => {
                const Icon = tab.icon
                const active = activeRoleTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveRoleTab(tab.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      active ? 'bg-white shadow-sm ring-2 ring-brand/15' : 'bg-white/60 hover:bg-white'
                    }`}
                    style={{
                      borderColor: active ? 'var(--brand-border)' : 'var(--border)',
                    }}
                  >
                    <div className="flex items-center gap-3 mb-1.5">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center"
                        style={
                          active
                            ? { background: 'var(--brand)', color: 'white' }
                            : { background: 'var(--brand-light)', color: 'var(--brand)' }
                        }
                      >
                        <Icon size={16} />
                      </div>
                      <span className="font-jakarta font-bold text-sm text-midnight">{tab.title}</span>
                    </div>
                    <p className="text-xs text-slate-600">{tab.subtitle}</p>
                  </button>
                )
              })}
            </div>

            {/* Role Feature Detail Panel */}
            <div
              className="rounded-2xl border p-6 sm:p-8 shadow-xs mb-10"
              style={{ background: 'var(--warm-surface)', borderColor: 'var(--border)' }}
            >
              {activeRoleTab === 'organizer' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs uppercase tracking-wider text-brand font-semibold">
                      For Organizers
                    </span>
                    <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-midnight">
                      Create and manage funding events without spreadsheet chaos
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Launch hackathons with reserved USDC prize pools or list external community events in the discovery directory. Assign reviewers, track scores, and settle payouts from one dashboard.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigate('organizer')}
                        className="btn btn-primary btn-sm rounded-xl px-4 py-2.5 text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <span>Organize</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={handleCreateAction}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold border hover:bg-slate-50 transition-colors"
                        style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
                      >
                        Create
                      </button>
                      {onOpenApplyAdmin && (
                        <button
                          type="button"
                          onClick={onOpenApplyAdmin}
                          className="px-4 py-2.5 rounded-xl text-xs font-semibold border hover:bg-slate-50 transition-colors"
                          style={{ borderColor: 'var(--brand-border)', color: 'var(--brand)' }}
                        >
                          Register as host
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Guided Event Creator',
                        desc: 'Set up tracks, prize tiers, deadlines, and judging criteria in five simple steps.',
                      },
                      {
                        title: 'Flexible Event Formats',
                        desc: 'Host competitions with reserved USDC prize pools or publish external community listings.',
                      },
                      {
                        title: 'Automatic Leaderboard',
                        desc: 'See combined reviewer scores for every submission and assign prize tiers with confidence.',
                      },
                      {
                        title: 'Easy Unclaimed Refunds',
                        desc: 'If an event is cancelled or a prize tier goes unused, reclaim your remaining USDC anytime.',
                      },
                    ].map((feat) => (
                      <div
                        key={feat.title}
                        className="p-4 rounded-xl border"
                        style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                      >
                        <div className="font-jakarta font-bold text-sm text-midnight mb-1.5">{feat.title}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeRoleTab === 'builder' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs uppercase tracking-wider text-teal font-semibold">
                      For Builders & Applicants
                    </span>
                    <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-midnight">
                      Apply to verified programs and get paid fast
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Check reserved prize pools, deadlines, and evaluation criteria upfront. Submit your project or milestone updates in minutes and withdraw USDC as soon as your work is approved.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigate('participant')}
                        className="btn btn-primary btn-sm rounded-xl px-4 py-2.5 text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <span>Grants</span>
                        <ArrowRight size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onNavigate('events')}
                        className="px-4 py-2.5 rounded-xl text-xs font-semibold border hover:bg-slate-50 transition-colors"
                        style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
                      >
                        Explore
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Simple 3-Step Application',
                        desc: 'Choose your track, share your demo and repository links, and submit your entry in minutes.',
                      },
                      {
                        title: 'Submission Receipts',
                        desc: 'Get an immediate confirmation receipt showing your submission ID and timestamp.',
                      },
                      {
                        title: 'Milestone Tracking',
                        desc: 'Submit deliverables for each grant stage and update your links if reviewers ask for changes.',
                      },
                      {
                        title: 'Direct USDC Withdrawals',
                        desc: 'View your approved prizes and grant payouts in one place and withdraw directly to your wallet.',
                      },
                    ].map((feat) => (
                      <div
                        key={feat.title}
                        className="p-4 rounded-xl border"
                        style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                      >
                        <div className="font-jakarta font-bold text-sm text-midnight mb-1.5">{feat.title}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeRoleTab === 'reviewer' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-5 space-y-4">
                    <span className="text-xs uppercase tracking-wider text-violet font-semibold">
                      For Reviewers
                    </span>
                    <h3 className="font-jakarta font-bold text-xl sm:text-2xl text-midnight">
                      Review submissions with clarity and consistency
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Assigned reviewers get a focused workspace showing every submission and milestone waiting for their evaluation, complete with weighted scoring sliders.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigate('reviewer')}
                        className="btn btn-primary btn-sm rounded-xl px-4 py-2.5 text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <span>Open review console</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      {
                        title: 'Weighted Scorecards',
                        desc: 'Score each criterion individually while Fundora calculates the overall 1–100 rating automatically.',
                      },
                      {
                        title: 'Structured Feedback',
                        desc: 'Add clear evaluation notes alongside your score so organizers can make informed decisions.',
                      },
                      {
                        title: 'Milestone Approvals',
                        desc: 'Inspect builder deliverables and vote to approve completed grant milestones or request updates.',
                      },
                      {
                        title: 'Dedicated Review Queue',
                        desc: 'Filter submissions by status so you always know which entries still need your review.',
                      },
                    ].map((feat) => (
                      <div
                        key={feat.title}
                        className="p-4 rounded-xl border"
                        style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                      >
                        <div className="font-jakarta font-bold text-sm text-midnight mb-1.5">{feat.title}</div>
                        <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Public Browsing vs Active Participation */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className="rounded-2xl border p-6"
                style={{ background: 'var(--warm-surface)', borderColor: 'var(--teal-border)' }}
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border"
                    style={{
                      background: 'var(--teal-light)',
                      color: 'var(--teal)',
                      borderColor: 'var(--teal-border)',
                    }}
                  >
                    <Globe size={13} />
                    Browse without a wallet
                  </span>
                  <span className="text-xs text-slate-500">Always open</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {[
                    'Discover open grants, hackathons, and community contests',
                    'Inspect prize pools, tracks, deadlines, and judging criteria',
                    'View public project submissions, demos, and winner leaderboards',
                    'Verify funding balances and payout records on Arc Explorer',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <CheckCircle2 size={15} className="text-teal shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="rounded-2xl border p-6"
                style={{ background: 'var(--warm-surface)', borderColor: 'var(--brand-border)' }}
              >
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg border"
                    style={{
                      background: 'var(--brand-light)',
                      color: 'var(--brand)',
                      borderColor: 'var(--brand-border)',
                    }}
                  >
                    <KeyRound size={13} />
                    Connect when taking action
                  </span>
                  <span className="text-xs text-slate-500">Wallet required</span>
                </div>
                <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                  {[
                    'Create and fund a new hackathon, contest, or milestone grant',
                    'Submit a project application or milestone deliverable',
                    'Score entries or vote to approve completed grant milestones',
                    'Confirm event winners and withdraw USDC payouts or refunds',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Wallet size={15} className="text-brand shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            5. EXPLORE & APPLICATION EXPERIENCE
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="discovery"
          className="py-16 sm:py-24 border-b scroll-mt-16"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
              <div className="max-w-2xl">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3"
                  style={{
                    background: 'var(--teal-light)',
                    color: 'var(--teal)',
                    borderColor: 'var(--teal-border)',
                  }}
                >
                  <Compass size={13} />
                  Explore
                </span>
                <h2 className="font-jakarta font-extrabold text-2xl sm:text-4xl text-midnight tracking-tight mb-3">
                  Discover grants and hackathons
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  Browse live funding events on Arc or preview the full application experience in Sandbox Mode. Every listing shows real prize pools and clear deadlines.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('events', 'live')}
                  className="btn btn-primary btn-sm rounded-xl px-4 py-2.5 text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <span>Explore</span>
                  <ArrowRight size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('events', 'demo')}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold border hover:bg-white transition-colors"
                  style={{
                    background: 'var(--warm-surface)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--brand)',
                  }}
                >
                  Preview sandbox events
                </button>
              </div>
            </div>

            {/* Live Directory Status */}
            <div
              className="rounded-2xl border p-5 sm:p-6 mb-10"
              style={{ background: 'var(--warm-surface)', borderColor: 'var(--border)' }}
            >
              <div
                className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-5 border-b"
                style={{ borderColor: 'var(--border)' }}
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal" />
                  <span className="font-jakarta font-bold text-sm text-midnight">
                    Live Directory
                  </span>
                </div>
                <a
                  href={getExplorerUrl('address', FUNDORA_EVENTS_ADDRESSES[ARC_MAINNET_ID])}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-brand hover:underline"
                >
                  <span>Verify on Arc Explorer</span>
                  <ExternalLink size={12} />
                </a>
              </div>

              {liveEventsLoading ? (
                <div className="py-8 text-center text-sm text-slate-500">
                  Loading live events from Arc Mainnet...
                </div>
              ) : liveMainnetEvents.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {liveMainnetEvents.slice(0, 3).map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-xl border p-5 flex flex-col justify-between hover:shadow-sm transition-shadow"
                      style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-brand-light text-brand border border-brand-border">
                            {ev.category.toUpperCase()}
                          </span>
                          <span className="text-xs font-semibold text-teal">
                            {Number(ev.totalPrizePoolUsdc / 1_000_000n).toLocaleString('en-US')} USDC
                          </span>
                        </div>
                        <h3 className="font-jakarta font-bold text-base text-midnight mb-1.5">{ev.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-4">{ev.tagline}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          if (onSelectEvent) {
                            onSelectEvent(ev.id)
                          } else {
                            onNavigate('events', 'live')
                          }
                        }}
                        className="w-full py-2 px-3 rounded-lg text-xs font-semibold border bg-white text-midnight hover:border-brand transition-colors inline-flex items-center justify-center gap-1.5"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        <span>View details</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded-xl p-5 border flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded bg-white border text-midnight"
                        style={{ borderColor: 'var(--border)' }}
                      >
                        0 Open Events
                      </span>
                      <span className="text-xs font-semibold text-midnight">
                        Ready for new launches
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
                      There are currently no open events on Arc Mainnet. You can launch the next competition from the Organizer Console, or switch to Sandbox Mode to explore sample hackathons, judging scorecards, and submission flows.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleCreateAction}
                      className="btn btn-primary btn-sm rounded-xl px-3.5 py-2 text-xs font-semibold"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => onNavigate('events', 'demo')}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold border bg-white hover:bg-slate-50 transition-colors"
                      style={{ borderColor: 'var(--border)', color: 'var(--ink)' }}
                    >
                      Preview sandbox
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* 3-Step Application Experience Walkthrough */}
            <div
              className="rounded-2xl border p-6 sm:p-8"
              style={{ background: 'var(--warm-surface)', borderColor: 'var(--border)' }}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-brand font-semibold">
                    Applicant experience
                  </span>
                  <h3 className="font-jakarta font-bold text-lg sm:text-xl text-midnight">
                    How builders discover, apply, and get paid
                  </h3>
                </div>
                <div
                  className="inline-flex p-1 rounded-xl border"
                  style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                >
                  {[
                    { idx: 0 as DiscoveryStage, label: '1. Discover' },
                    { idx: 1 as DiscoveryStage, label: '2. Apply' },
                    { idx: 2 as DiscoveryStage, label: '3. Get Paid' },
                  ].map((st) => (
                    <button
                      key={st.idx}
                      type="button"
                      onClick={() => setDiscoveryStage(st.idx)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        discoveryStage === st.idx
                          ? 'bg-white text-brand shadow-2xs'
                          : 'text-slate-600 hover:text-midnight'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {discoveryStage === 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-5 space-y-3">
                    <div className="inline-flex items-center gap-1.5 text-xs text-teal font-semibold">
                      <Eye size={14} />
                      <span>Open Browsing • No Wallet Required</span>
                    </div>
                    <h4 className="font-jakarta font-bold text-base sm:text-lg text-midnight">
                      Compare prize pools, tracks, and judging criteria upfront
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Filter opportunities by category or status, see whether prize funds are reserved on Fundora or hosted externally, and review every track requirement before starting your application.
                    </p>
                  </div>
                  <div
                    className="lg:col-span-7 rounded-xl border p-4 space-y-3"
                    style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                  >
                    <div
                      className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-brand text-white">
                          All Programs
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border text-slate-600"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          Hackathons
                        </span>
                        <span
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-white border text-slate-600"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          Contests
                        </span>
                      </div>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-teal-light text-teal border border-teal-border">
                        USDC Prize Pool Reserved
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-[10px] text-slate-500">Funding guarantee</div>
                        <div className="text-xs font-bold text-midnight mt-0.5">Reserved USDC</div>
                        <div className="text-[11px] text-teal mt-1">Verified prize tiers</div>
                      </div>
                      <div className="p-3 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-[10px] text-slate-500">Evaluation</div>
                        <div className="text-xs font-bold text-midnight mt-0.5">Clear Rubric</div>
                        <div className="text-[11px] text-slate-600 mt-1">Weights published upfront</div>
                      </div>
                      <div className="p-3 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-[10px] text-slate-500">Schedule</div>
                        <div className="text-xs font-bold text-midnight mt-0.5">Clear Deadlines</div>
                        <div className="text-[11px] text-slate-600 mt-1">Submission & review dates</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {discoveryStage === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-5 space-y-3">
                    <div className="inline-flex items-center gap-1.5 text-xs text-brand font-semibold">
                      <Send size={14} />
                      <span>Guided Application • Instant Receipt</span>
                    </div>
                    <h4 className="font-jakarta font-bold text-base sm:text-lg text-midnight">
                      Submit your project or milestone update in three steps
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      Select your track, add your project summary along with GitHub or demo links, and confirm your submission. You receive an instant, time-stamped receipt proving your work was delivered on time.
                    </p>
                  </div>
                  <div
                    className="lg:col-span-7 rounded-xl border p-4 space-y-3"
                    style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-[10px] text-brand font-semibold">Step 1</div>
                        <div className="text-xs font-bold text-midnight mt-0.5">Select Track</div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Pick the competition track that fits your project.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-[10px] text-brand font-semibold">Step 2</div>
                        <div className="text-xs font-bold text-midnight mt-0.5">Add Project Links</div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Share your live demo, repository, and short overview.
                        </p>
                      </div>
                      <div className="p-3 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-[10px] text-teal font-semibold">Step 3</div>
                        <div className="text-xs font-bold text-midnight mt-0.5">Confirm & Save</div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Receive your time-stamped submission confirmation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {discoveryStage === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-5 space-y-3">
                    <div className="inline-flex items-center gap-1.5 text-xs text-teal font-semibold">
                      <Wallet size={14} />
                      <span>Direct Payouts • Zero Middlemen</span>
                    </div>
                    <h4 className="font-jakarta font-bold text-base sm:text-lg text-midnight">
                      Track your funding status and withdraw USDC anytime
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      As soon as event winners are announced or a grant milestone is approved, your USDC payout appears in your dashboard—ready to withdraw to your wallet in a single click.
                    </p>
                  </div>
                  <div
                    className="lg:col-span-7 rounded-xl border p-4 space-y-3"
                    style={{ background: 'var(--warm-bg)', borderColor: 'var(--border)' }}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-[11px] text-brand font-semibold">Competition Prizes</div>
                        <div className="text-xs font-bold text-midnight mt-1">Instant winner withdrawals</div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Claim your prize tier reward directly once event results are published.
                        </p>
                      </div>
                      <div className="p-3.5 rounded-lg bg-white border" style={{ borderColor: 'var(--border)' }}>
                        <div className="text-[11px] text-teal font-semibold">Milestone Grants</div>
                        <div className="text-xs font-bold text-midnight mt-1">Stage-by-stage payouts</div>
                        <p className="text-[11px] text-slate-600 mt-1">
                          Withdraw each milestone payment immediately after reviewer approval.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            6. TRUST, TRANSPARENCY & VERIFICATION ON ARC
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="verification"
          className="py-16 sm:py-24 scroll-mt-16 text-white"
          style={{ background: 'var(--midnight)' }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
              <div className="max-w-2xl">
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3"
                  style={{
                    background: 'rgba(15, 118, 110, 0.2)',
                    color: '#5EEAD4',
                    borderColor: 'rgba(153, 246, 228, 0.3)',
                  }}
                >
                  <ShieldCheck size={13} />
                  Trust & transparency
                </span>
                <h2 className="font-jakarta font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-3">
                  Transparent funding you can verify on Arc
                </h2>
                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  Every funding pool, submission timestamp, review score, and payout is recorded on the Arc network—giving organizers and builders a permanent, auditable record.
                </p>
              </div>

              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold self-start"
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  borderColor: 'rgba(255, 255, 255, 0.14)',
                  color: '#5EEAD4',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
                <span>Arc Mainnet Verified</span>
              </div>
            </div>

            {/* 4 Plain-English Trust Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {[
                {
                  title: 'Guaranteed budgets',
                  desc: 'Prize pools and grant budgets are reserved upfront so builders never have to worry about missing funds.',
                },
                {
                  title: 'Verifiable records',
                  desc: 'Every application receipt, review score, and milestone approval is time-stamped on Arc.',
                },
                {
                  title: 'Direct payouts',
                  desc: 'Approved funds are withdrawn directly by the recipient without manual wire transfers or delays.',
                },
                {
                  title: 'Protected refunds',
                  desc: 'If an event is cancelled or a prize tier goes unclaimed, unused USDC returns safely to the organizer.',
                },
              ].map((sec) => (
                <div
                  key={sec.title}
                  className="rounded-xl border p-4"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <div className="font-jakarta font-bold text-sm text-white mb-1.5 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-teal-300 shrink-0" />
                    <span>{sec.title}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{sec.desc}</p>
                </div>
              ))}
            </div>

            {/* Public Verification Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  key: 'fundora-events',
                  name: 'Hackathon & Event Vault',
                  purpose: 'Holds competition prize pools, records entries and scores, and processes winner payouts.',
                  address: FUNDORA_EVENTS_ADDRESSES[verifyChainId],
                  statusText: onchainEventsPaused === false ? 'Active & Verified' : 'Verified on Arc',
                },
                {
                  key: 'fundora-grants',
                  name: 'Milestone Grant Vault',
                  purpose: 'Reserves grant budgets, tracks milestone approvals, and unlocks stage-by-stage builder payouts.',
                  address: FUNDORA_ADDRESSES[verifyChainId],
                  statusText: 'Active & Verified',
                },
                {
                  key: 'admin-registry',
                  name: 'Organizer Directory',
                  purpose: 'Verifies registered event hosts and grant administrators across the platform.',
                  address: ADMIN_REGISTRY_ADDRESSES[verifyChainId],
                  statusText: 'Active & Verified',
                },
                {
                  key: 'arc-usdc',
                  name: 'USDC on Arc',
                  purpose: 'Digital dollar token used for all funding pools, payouts, and network transactions.',
                  address: USDC_ADDRESS,
                  statusText: 'Official Settlement Asset',
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="rounded-2xl border p-5 flex flex-col justify-between"
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <span className="font-jakarta font-bold text-base text-white">{item.name}</span>
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-teal-950/80 text-teal-300 border border-teal-700/50">
                        {item.statusText}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                      {item.purpose}
                    </p>
                  </div>

                  <div
                    className="rounded-xl p-3 border flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                    style={{
                      background: 'rgba(0, 0, 20, 0.55)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                  >
                    <span className="font-mono text-xs text-slate-300 break-all">{item.address}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => copyToClipboard(item.address, item.key)}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-white/10 hover:bg-white/15 text-white transition-colors inline-flex items-center gap-1"
                        title="Copy address"
                      >
                        {copiedText === item.key ? (
                          <>
                            <Check size={12} className="text-teal-300" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <a
                        href={getExplorerUrl('address', item.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-brand hover:bg-brand-hover text-white transition-colors inline-flex items-center gap-1"
                      >
                        <span>Verify on Arc</span>
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            7. FREQUENTLY ASKED QUESTIONS (FAQ)
        ══════════════════════════════════════════════════════════════════════ */}
        <section
          id="faq"
          className="py-16 sm:py-24 border-b scroll-mt-16"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border mb-3"
                style={{
                  background: 'var(--brand-light)',
                  color: 'var(--brand)',
                  borderColor: 'var(--brand-border)',
                }}
              >
                FAQ
              </span>
              <h2 className="font-jakarta font-extrabold text-2xl sm:text-4xl text-midnight tracking-tight mb-3">
                Common questions
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Simple answers about browsing, applying, organizing, and receiving payouts.
              </p>
            </div>

            <div className="space-y-3">
              {[
                {
                  q: 'Do I need a wallet to browse grants and hackathons?',
                  a: 'No. Anyone can explore the landing page, browse open events, inspect prize tiers and deadlines, and read judging criteria without connecting a wallet. You only connect a wallet when you are ready to submit an application, review entries, create an event, or withdraw funds.',
                },
                {
                  q: 'How do builders know the funding is guaranteed?',
                  a: 'When an organizer creates a funded hackathon or milestone grant on Fundora, 100% of the USDC budget is reserved upfront. Once a winner is finalized or a milestone is approved by reviewers, those funds are unlocked exclusively for the builder to withdraw.',
                },
                {
                  q: 'How do payouts work once my submission or milestone is approved?',
                  a: 'Approved grant payments and competition prizes appear immediately in your Participant Hub. From there, you can withdraw your USDC directly to your wallet whenever you are ready.',
                },
                {
                  q: 'Can organizers list events that use an external application link?',
                  a: 'Yes. Organizers can choose between hosting a fully funded competition directly on Fundora or publishing an external listing in the discovery directory to direct builders to their own event page.',
                },
                {
                  q: 'What currency does Fundora use for funding and payouts?',
                  a: 'All grants, prize pools, and payouts on Fundora use USDC on the Arc network. Because Arc also uses USDC for network fees, you never need to hold a separate volatile token.',
                },
                {
                  q: 'How can my organization start hosting grants or hackathons?',
                  a: 'Click "Organize" or "Create" in the navigation bar to open the Organizer Console, register your organization, and launch your first event in minutes.',
                },
              ].map((item, idx) => {
                const isOpen = openFaqIndex === idx
                return (
                  <div
                    key={item.q}
                    className="rounded-2xl border overflow-hidden transition-colors"
                    style={{
                      background: 'var(--warm-surface)',
                      borderColor: isOpen ? 'var(--brand-border)' : 'var(--border)',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                    >
                      <span className="font-jakarta font-bold text-sm sm:text-base text-midnight">
                        {item.q}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`text-slate-500 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-brand' : ''
                        }`}
                      />
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2, ease: 'easeOut' }}
                        >
                          <div
                            className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t"
                            style={{ borderColor: 'var(--border)' }}
                          >
                            {item.a}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ═════════════════════════════════════════════════════════════════════
            8. STRONG FINAL CTA SECTION
        ══════════════════════════════════════════════════════════════════════ */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div
              className="rounded-3xl border p-8 sm:p-12 lg:p-14 relative overflow-hidden shadow-sm"
              style={{
                background: 'linear-gradient(135deg, #1A3F75 0%, #00002A 100%)',
                borderColor: 'var(--brand-border)',
              }}
            >
              <div className="relative z-10 max-w-3xl">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-white/10 text-teal-300 border border-white/15 mb-4 font-semibold">
                  <CircleDot size={12} />
                  Get started with Fundora
                </span>
                <h2 className="font-jakarta font-extrabold text-2xl sm:text-4xl text-white tracking-tight mb-4">
                  Ready to fund or build your next project?
                </h2>
                <p className="text-sm sm:text-base text-slate-200 leading-relaxed mb-8 max-w-2xl">
                  Discover open grants and hackathons right away with no wallet required, or launch your own funding program in minutes.
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                  <button
                    type="button"
                    onClick={() => onNavigate('events')}
                    className="px-6 py-3.5 rounded-xl text-sm font-semibold bg-white text-midnight hover:bg-slate-100 transition-colors inline-flex items-center gap-2 shadow-sm"
                  >
                    <Compass size={16} className="text-brand" />
                    <span>Explore</span>
                    <ArrowRight size={15} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('participant')}
                    className="px-5 py-3.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors inline-flex items-center gap-2"
                  >
                    <Users size={16} />
                    <span>Grants</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateAction}
                    className="px-5 py-3.5 rounded-xl text-sm font-semibold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors inline-flex items-center gap-2"
                  >
                    <PlusCircle size={16} />
                    <span>Create</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onNavigate('organizer')}
                    className="px-5 py-3.5 rounded-xl text-sm font-semibold bg-teal text-white hover:opacity-95 transition-opacity inline-flex items-center gap-2"
                  >
                    <Award size={16} />
                    <span>Organize</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ═══════════════════════════════════════════════════════════════════════
          9. PROFESSIONAL FOOTER
      ════════════════════════════════════════════════════════════════════════ */}
      <footer
        role="contentinfo"
        className="border-t pt-12 pb-10"
        style={{ background: 'var(--warm-surface)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b"
            style={{ borderColor: 'var(--border)' }}
          >
            {/* Column 1-2: Brand & Mission */}
            <div className="lg:col-span-2 min-w-0 space-y-3">
              <div className="flex items-center gap-2.5">
                <BrandLogo className="h-7 w-auto" />
                <BrandWordmark className="h-5 w-auto max-w-[180px]" />
                <span
                  className="text-[11px] font-medium px-2 py-0.5 rounded-full border"
                  style={{
                    background: 'var(--brand-light)',
                    color: 'var(--brand)',
                    borderColor: 'var(--brand-border)',
                  }}
                >
                  Arc
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 max-w-sm leading-relaxed">
                Modern grants, hackathons, and milestone payouts powered by reserved USDC funding and transparent reviews on Arc.
              </p>
              <div className="text-xs text-slate-500 pt-1">
                Settlement currency: USDC ({formatAddress(USDC_ADDRESS)})
              </div>

              {/* Direct Support Actions */}
              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href="mailto:sytherrhere12@gmail.com?subject=Fundora%20Support%20Inquiry"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white border border-border text-slate-700 hover:text-midnight hover:border-brand-border transition-all shadow-xs"
                >
                  <Mail size={12} className="text-brand" />
                  <span>Email Support</span>
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('docs')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:text-midnight hover:bg-slate-100 transition-colors"
                >
                  <LifeBuoy size={12} className="text-teal" />
                  <span>Support Docs</span>
                </button>
              </div>
            </div>

            {/* Column 3: Platform Navigation */}
            <div>
              <h3 className="font-jakarta font-bold text-xs uppercase tracking-wider text-midnight mb-3">
                Platform
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('docs')}
                    className="hover:text-brand transition-colors font-medium text-brand inline-flex items-center gap-1.5"
                  >
                    <BookOpen size={13} />
                    <span>Documentation</span>
                  </button>
                </li>
                <li>
                  <a
                    href="mailto:sytherrhere12@gmail.com?subject=Fundora%20Support%20Inquiry"
                    className="hover:text-brand transition-colors inline-flex items-center gap-1.5"
                  >
                    <Mail size={13} className="text-slate-400" />
                    <span>Contact Support</span>
                  </a>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('events')}
                    className="hover:text-brand transition-colors"
                  >
                    Launch
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('events', 'live')}
                    className="hover:text-brand transition-colors"
                  >
                    Explore
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('participant')}
                    className="hover:text-brand transition-colors"
                  >
                    Grants
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={handleCreateAction}
                    className="hover:text-brand transition-colors"
                  >
                    Create
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => onNavigate('organizer')}
                    className="hover:text-brand transition-colors"
                  >
                    Organize
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Sections */}
            <div>
              <h3 className="font-jakarta font-bold text-xs uppercase tracking-wider text-midnight mb-3">
                Sections
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('how-it-works')}
                    className="hover:text-brand transition-colors"
                  >
                    How
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('features')}
                    className="hover:text-brand transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('discovery')}
                    className="hover:text-brand transition-colors"
                  >
                    Explore
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('verification')}
                    className="hover:text-brand transition-colors"
                  >
                    Trust
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => scrollToSection('faq')}
                    className="hover:text-brand transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 5: Verification Links */}
            <div>
              <h3 className="font-jakarta font-bold text-xs uppercase tracking-wider text-midnight mb-3">
                Verify on Arc
              </h3>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <a
                    href={getExplorerUrl('address', FUNDORA_EVENTS_ADDRESSES[ARC_MAINNET_ID])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand inline-flex items-center gap-1"
                  >
                    <span>Event Vault</span>
                    <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a
                    href={getExplorerUrl('address', FUNDORA_ADDRESSES[ARC_MAINNET_ID])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand inline-flex items-center gap-1"
                  >
                    <span>Grant Vault</span>
                    <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a
                    href={getExplorerUrl('address', ADMIN_REGISTRY_ADDRESSES[ARC_MAINNET_ID])}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand inline-flex items-center gap-1"
                  >
                    <span>Organizer Registry</span>
                    <ExternalLink size={11} />
                  </a>
                </li>
                <li>
                  <a
                    href={getExplorerUrl('address', USDC_ADDRESS)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand inline-flex items-center gap-1"
                  >
                    <span>USDC Contract</span>
                    <ExternalLink size={11} />
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              Fundora • Grants, Hackathons & Instant USDC Payouts
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <a
                href="mailto:sytherrhere12@gmail.com"
                className="hover:text-brand transition-colors inline-flex items-center gap-1.5"
              >
                <Mail size={12} className="text-teal" />
                <span>Support: sytherrhere12@gmail.com</span>
              </a>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={12} className="text-teal" />
                <span>Open to browse (no wallet required)</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
export default LandingPage
