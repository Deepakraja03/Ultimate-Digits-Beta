import { http, createConfig } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const Wagmiconfig = createConfig({
  chains: [baseSepolia],
  connectors: [coinbaseWallet()],
  transports: {
    [baseSepolia.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof Wagmiconfig
  }
}