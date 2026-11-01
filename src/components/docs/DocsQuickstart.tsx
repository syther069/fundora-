import { useState } from 'react'
import { useAccount, useSwitchChain, useReadContract, useBalance } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { formatUnits } from 'viem'
import {
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
  Coins,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Trophy,
  Users,
  LayoutDashboard,
} from 'lucide-react'
import {
  ARC_MAINNET_ID,
  ARC_USDC_ADDRESS,
} from '../../contracts/fundora'

const ERC20_BALANCE_ABI = [
  {
    type: 'function',
    name: 'balanceOf',
    stateMutability: 'view',
    inputs: [{ name: 'account', type: 'address' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
] as const

interface DocsQuickstartProps {
  onNavigate?: (view: string, mode?: 'demo' | 'live') => void
}

export function DocsQuickstart({ onNavigate }: DocsQuickstartProps) {
  const { address, isConnected, chainId } = useAccount()
  const { switchChain } = useSwitchChain()

  const isArcMainnet = chainId === ARC_MAINNET_ID
  const isArcSupported = isConnected && isArcMainnet

  // Read ERC-20 USDC balance
  const {
    data: usdcTokenBalance,
    isLoading: isUsdcLoading,
    refetch: refetchUsdc,
  } = useReadContract({
    address: ARC_USDC_ADDRESS,
    abi: ERC20_BALANCE_ABI,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    chainId: isArcSupported ? chainId : ARC_MAINNET_ID,
    query: {
      enabled: !!address && isArcSupported,
      staleTime: 5000,
    },
  })

  // Read native balance (on Arc, native is USDC)
  const {
    data: nativeBalance,
    isLoading: isNativeLoading,
    refetch: refetchNative,
  } = useBalance({
    address,
    chainId: isArcSupported ? chainId : ARC_MAINNET_ID,
    query: {
      enabled: !!address && isArcSupported,
      staleTime: 5000,
    },
  })

  // Format balances
  const formattedUsdc = usdcTokenBalance
    ? Number(formatUnits(usdcTokenBalance, 6)).toFixed(2)
    : nativeBalance
      ? Number(formatUnits(nativeBalance.value, nativeBalance.decimals)).toFixed(2)
      : '0.00'

  // Interactive pull-claim simulator state
  const [simStep, setSimStep] = useState<'locked' | 'approved' | 'claimed'>('locked')
  const [simulating, setSimulating] = useState(false)

  const handleSimulateApproval = () => {
    setSimStep('approved')
  }

  const handleSimulateClaim = () => {
    setSimulating(true)
    setTimeout(() => {
      setSimulating(false)
      setSimStep('claimed')
    }, 1200)
  }

  const handleResetSim = () => {
    setSimStep('locked')
  }

  const handleRefreshBalances = () => {
    void refetchUsdc()
    void refetchNative()
  }

  return (
    <div className="space-y-6 my-8">
      {/* ── Interactive Live Status Console ─────────────────────────────────── */}
      <div
        className="rounded-2xl border p-5 sm:p-6 shadow-sm"
        style={{
          background: 'var(--warm-surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2" style={{ background: 'var(--brand-light)', color: 'var(--brand)' }}>
              <Sparkles size={12} />
              <span>Live Wallet Diagnostics</span>
            </div>
            <h3 className="font-jakarta font-bold text-lg text-midnight">
              Interactive Onboarding Status
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Connect your wallet right here to test your connection and check your Arc setup.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <ConnectKitButton />
            {isConnected && (
              <button
                type="button"
                onClick={handleRefreshBalances}
                className="p-2 rounded-xl border hover:bg-slate-50 transition-colors text-slate-600"
                style={{ borderColor: 'var(--border)' }}
                title="Refresh balances"
                aria-label="Refresh balances"
              >
                <RefreshCw size={14} className={isUsdcLoading || isNativeLoading ? 'animate-spin' : ''} />
              </button>
            )}
          </div>
        </div>

        {/* ── 3-Step Live Diagnostics Grid ─────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-5">
          {/* Diagnostic 1: Wallet Connection */}
          <div
            className="p-4 rounded-xl border flex flex-col justify-between"
            style={{
              background: isConnected ? 'var(--teal-light)' : 'var(--warm-bg)',
              borderColor: isConnected ? 'var(--teal-border)' : 'var(--border)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 1: Wallet
                </span>
                {isConnected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal">
                    <CheckCircle2 size={14} />
                    Connected
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Not connected</span>
                )}
              </div>
              <div className="font-jakarta font-bold text-sm text-midnight truncate">
                {isConnected && address
                  ? `${address.slice(0, 6)}...${address.slice(-4)}`
                  : 'No Wallet Linked'}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {isConnected
                  ? 'Your Web3 account is ready for authentication.'
                  : 'Connect MetaMask or another injected browser wallet.'}
              </p>
            </div>
          </div>

          {/* Diagnostic 2: Arc Network */}
          <div
            className="p-4 rounded-xl border flex flex-col justify-between"
            style={{
              background: isArcSupported
                ? 'var(--teal-light)'
                : isConnected
                  ? 'var(--amber-light)'
                  : 'var(--warm-bg)',
              borderColor: isArcSupported
                ? 'var(--teal-border)'
                : isConnected
                  ? 'var(--amber-border)'
                  : 'var(--border)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 2: Network
                </span>
                {isArcSupported ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal">
                    <CheckCircle2 size={14} />
                    Arc Mainnet
                  </span>
                ) : isConnected ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber">
                    <AlertTriangle size={14} />
                    Wrong Chain
                  </span>
                ) : (
                  <span className="text-xs font-medium text-slate-400">Waiting</span>
                )}
              </div>
              <div className="font-jakarta font-bold text-sm text-midnight">
                {isArcSupported
                  ? 'Arc Mainnet (5042)'
                  : isConnected
                    ? `Chain ID: ${chainId ?? 'Unknown'}`
                    : 'Arc Blockchain'}
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {isArcSupported
                  ? 'Connected to Arc with sub-second finality.'
                  : isConnected
                    ? 'You need to switch to Arc to interact.'
                    : 'Requires Arc Mainnet.'}
              </p>
            </div>

            {isConnected && !isArcSupported && switchChain && (
              <div className="mt-3 pt-3 border-t border-amber-border flex gap-2">
                <button
                  type="button"
                  onClick={() => switchChain({ chainId: ARC_MAINNET_ID })}
                  className="flex-1 py-1.5 px-2 rounded-lg bg-brand text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Switch to Arc
                </button>
              </div>
            )}
          </div>

          {/* Diagnostic 3: USDC Balance */}
          <div
            className="p-4 rounded-xl border flex flex-col justify-between"
            style={{
              background: isArcSupported && Number(formattedUsdc) > 0
                ? 'var(--teal-light)'
                : 'var(--warm-bg)',
              borderColor: isArcSupported && Number(formattedUsdc) > 0
                ? 'var(--teal-border)'
                : 'var(--border)',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Step 3: USDC
                </span>
                <span className="text-xs font-semibold text-brand inline-flex items-center gap-1">
                  <Coins size={12} />
                  Gas & Escrow
                </span>
              </div>
              <div className="font-jakarta font-bold text-lg text-midnight">
                ${formattedUsdc} <span className="text-xs font-semibold text-slate-500">USDC</span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {isArcSupported && Number(formattedUsdc) > 0
                  ? 'Funds detected. Gas & grants ready.'
                  : 'On Arc, transactions use USDC as gas.'}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-border">
              <a
                href="https://explorer.mainnet.arc.io/address/0x3600000000000000000000000000000000000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-brand"
              >
                <span>Verify USDC on Arc Explorer</span>
                <ExternalLink size={11} />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Choose Your Path & Quick Actions ─────────────────────────────────── */}
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          background: 'var(--warm-surface)',
          borderColor: 'var(--border)',
        }}
      >
        <h4 className="font-jakarta font-bold text-base text-midnight mb-1">
          Ready to Start? Choose Your Next Step
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 mb-5">
          Select what you want to do on Fundora right now. No waiting, no complex verification.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Explore Bounties */}
          <div className="p-4 rounded-xl border flex flex-col justify-between hover:border-brand/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
            <div>
              <div className="w-8 h-8 rounded-lg bg-teal-light text-teal flex items-center justify-center mb-3">
                <Trophy size={16} />
              </div>
              <h5 className="font-jakarta font-bold text-sm text-midnight mb-1">
                Explore Hackathons & Events
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Discover active community competitions with verified smart contract prize pools.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('events')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-midnight text-white hover:bg-slate-800 transition-colors"
            >
              <span>Explore Directory</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 2: Browse Milestone Grants */}
          <div className="p-4 rounded-xl border flex flex-col justify-between hover:border-brand/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
            <div>
              <div className="w-8 h-8 rounded-lg bg-brand-light text-brand flex items-center justify-center mb-3">
                <Users size={16} />
              </div>
              <h5 className="font-jakarta font-bold text-sm text-midnight mb-1">
                Browse Milestone Grants
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Apply for phased microgrants, submit deliverables, and claim approved USDC.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('participant')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-brand text-white hover:bg-brand-hover transition-colors"
            >
              <span>Open Grants Portal</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Card 3: Host or Sponsor */}
          <div className="p-4 rounded-xl border flex flex-col justify-between hover:border-brand/40 transition-colors" style={{ borderColor: 'var(--border)' }}>
            <div>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
                <LayoutDashboard size={16} />
              </div>
              <h5 className="font-jakarta font-bold text-sm text-midnight mb-1">
                Create a Grant or Event
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                Deposit USDC in escrow, define milestone rubrics, and assign trusted reviewers.
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate?.('organizer')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold border border-border text-slate-800 hover:bg-slate-100 transition-colors"
            >
              <span>Organize Portal</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Interactive Milestone Escrow & Claim Simulator ────────────────────── */}
      <div
        className="rounded-2xl border p-5 sm:p-6"
        style={{
          background: 'var(--warm-bg-2)',
          borderColor: 'var(--brand-border)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
            <h4 className="font-jakarta font-bold text-sm text-midnight">
              Interactive Preview: How Escrow Payouts Work
            </h4>
          </div>
          <button
            type="button"
            onClick={handleResetSim}
            className="text-[11px] font-semibold text-slate-500 hover:text-midnight underline"
          >
            Reset Demo
          </button>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed">
          Experience the three stages of a milestone: funds locked in escrow, verified approval by judges, and direct pull-claiming to your wallet.
        </p>

        <div className="bg-white p-4 rounded-xl border shadow-xs space-y-4" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Sample Grant Milestone
              </span>
              <div className="font-jakarta font-bold text-sm text-midnight">
                Milestone 1: Web Interface & Working Prototype
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Milestone Allocation
              </span>
              <div className="font-mono font-bold text-sm text-teal">$500.00 USDC</div>
            </div>
          </div>

          {/* Lifecycle state indicators */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  simStep === 'locked'
                    ? 'bg-amber text-white'
                    : 'bg-teal text-white'
                }`}
              >
                1
              </div>
              <span className="font-semibold text-slate-700">Funds Escrowed</span>
            </div>

            <div className="w-8 h-0.5 bg-slate-200" />

            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  simStep === 'locked'
                    ? 'bg-slate-200 text-slate-500'
                    : simStep === 'approved'
                      ? 'bg-amber text-white'
                      : 'bg-teal text-white'
                }`}
              >
                2
              </div>
              <span className="font-semibold text-slate-700">Reviewers Approve</span>
            </div>

            <div className="w-8 h-0.5 bg-slate-200" />

            <div className="flex items-center gap-2">
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  simStep === 'claimed'
                    ? 'bg-teal text-white'
                    : 'bg-slate-200 text-slate-500'
                }`}
              >
                3
              </div>
              <span className="font-semibold text-slate-700">Builder Claim</span>
            </div>
          </div>

          {/* Interactive action button for simulator */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg">
            <div className="text-xs text-slate-600">
              {simStep === 'locked' && (
                <span>Evidence submitted. Waiting for reviewer evaluation.</span>
              )}
              {simStep === 'approved' && (
                <span className="text-teal font-semibold">
                  Reviewers approved! $500.00 USDC is ready to claim.
                </span>
              )}
              {simStep === 'claimed' && (
                <span className="text-teal font-semibold flex items-center gap-1">
                  <CheckCircle2 size={13} />
                  Claim successful! $500.00 USDC transferred to builder wallet.
                </span>
              )}
            </div>

            <div>
              {simStep === 'locked' && (
                <button
                  type="button"
                  onClick={handleSimulateApproval}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-midnight text-white hover:opacity-90 transition-opacity"
                >
                  Simulate Reviewer Approval
                </button>
              )}
              {simStep === 'approved' && (
                <button
                  type="button"
                  onClick={handleSimulateClaim}
                  disabled={simulating}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-teal text-white hover:bg-teal-hover transition-colors inline-flex items-center gap-1.5"
                >
                  {simulating ? (
                    <>
                      <RefreshCw size={12} className="animate-spin" />
                      <span>Claiming...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck size={13} />
                      <span>Claim $500.00 USDC</span>
                    </>
                  )}
                </button>
              )}
              {simStep === 'claimed' && (
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-teal-light text-teal border border-teal-border">
                  Settled on Arc
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
