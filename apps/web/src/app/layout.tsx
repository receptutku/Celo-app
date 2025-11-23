import type { Metadata } from 'next'
import { WalletProvider } from '@/components/wallet-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Buy Me a Coffee - Celo dApp',
  description: 'Support creators with CELO on Celo blockchain',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          {children}
        </WalletProvider>
      </body>
    </html>
  )
}

