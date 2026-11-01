/**
 * Fundora Wagmi Configuration
 */

import { http, createConfig } from 'wagmi'
import { mainnet, baseSepolia, arbitrumSepolia, sepolia, base, arbitrum } from 'wagmi/chains'
import { arcTestnet, arc } from 'viem/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  // Arc chains + CCTP source chains (testnet + mainnet) + Ethereum mainnet for ENS
  chains: [arcTestnet, arc, baseSepolia, arbitrumSepolia, sepolia, base, arbitrum, mainnet],
  connectors: [injected()],
  transports: {
    [arcTestnet.id]:      http('https://rpc.testnet.arc.io'),
    [arc.id]:             http('https://rpc.mainnet.arc.io'),
    // CCTP testnet sources — use public defaults
    [baseSepolia.id]:     http(),
    [arbitrumSepolia.id]: http(),
    [sepolia.id]:         http(),
    // CCTP mainnet sources — use public defaults
    [base.id]:            http(),
    [arbitrum.id]:        http(),
    [mainnet.id]:         http(), // also needed for ENS resolution
  },
})
