'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi'
import { useState, useEffect } from 'react'
import { parseEther } from 'viem'

// Contract ABI - Update this with your deployed contract address
const COFFEE_PORTAL_ADDRESS = process.env.NEXT_PUBLIC_COFFEE_PORTAL_ADDRESS || '0x0000000000000000000000000000000000000000'

const COFFEE_PORTAL_ABI = [
  {
    inputs: [
      { internalType: 'string', name: 'name', type: 'string' },
      { internalType: 'string', name: 'message', type: 'string' },
    ],
    name: 'buyCoffee',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMemos',
    outputs: [
      {
        components: [
          { internalType: 'address', name: 'from', type: 'address' },
          { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
          { internalType: 'string', name: 'message', type: 'string' },
          { internalType: 'string', name: 'name', type: 'string' },
        ],
        internalType: 'struct CoffeePortal.Memo[]',
        name: '',
        type: 'tuple[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const

interface Memo {
  from: `0x${string}`
  timestamp: bigint
  message: string
  name: string
}

export default function Home() {
  const { address, isConnected } = useAccount()
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [memos, setMemos] = useState<Memo[]>([])

  // Validate contract address
  const isValidAddress = Boolean(
    COFFEE_PORTAL_ADDRESS && 
    COFFEE_PORTAL_ADDRESS !== '0x0000000000000000000000000000000000000000' &&
    COFFEE_PORTAL_ADDRESS.startsWith('0x') &&
    COFFEE_PORTAL_ADDRESS.length === 42
  )

  // Read memos from contract
  const { data: memosData, refetch: refetchMemos, error: memosError } = useReadContract({
    address: isValidAddress ? (COFFEE_PORTAL_ADDRESS as `0x${string}`) : undefined,
    abi: COFFEE_PORTAL_ABI,
    functionName: 'getMemos',
    query: {
      enabled: isValidAddress,
      retry: 2,
    },
  })

  // Write contract for buying coffee
  const { writeContract, data: hash, isPending, error } = useWriteContract()

  // Wait for transaction
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  })

  // Update memos when data changes
  useEffect(() => {
    if (memosData) {
      setMemos(memosData as Memo[])
    }
  }, [memosData])

  // Refetch memos after successful transaction
  useEffect(() => {
    if (isSuccess) {
      refetchMemos()
      setName('')
      setMessage('')
    }
  }, [isSuccess, refetchMemos])

  const handleBuyCoffee = async () => {
    if (!isConnected || !name.trim() || !message.trim()) {
      alert('Please connect your wallet and fill in all fields')
      return
    }

    try {
      await writeContract({
        address: COFFEE_PORTAL_ADDRESS as `0x${string}`,
        abi: COFFEE_PORTAL_ABI,
        functionName: 'buyCoffee',
        args: [name, message],
        value: parseEther('0.01'), // 0.01 CELO
      })
    } catch (err) {
      console.error('Error buying coffee:', err)
    }
  }

  const formatAddress = (addr: `0x${string}`) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) * 1000).toLocaleString()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            ☕ Buy Me a Coffee
          </h1>
          <div className="flex-shrink-0">
            <ConnectButton />
          </div>
        </div>

        {/* Main Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Support with CELO
            </h2>

            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Please connect your wallet to continue
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    disabled={isPending || isConfirming}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Leave a supportive message..."
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                    disabled={isPending || isConfirming}
                  />
                </div>

                <button
                  onClick={handleBuyCoffee}
                  disabled={isPending || isConfirming || !name.trim() || !message.trim()}
                  className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  {isPending || isConfirming ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {isPending ? 'Confirm in wallet...' : 'Processing...'}
                    </>
                  ) : isSuccess ? (
                    '✅ Coffee Sent!'
                  ) : (
                    'Send 0.01 CELO ☕'
                  )}
                </button>

                {error && (
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200 text-sm">
                      Error: {error.message}
                    </p>
                  </div>
                )}

                {isSuccess && (
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <p className="text-green-800 dark:text-green-200 text-sm font-medium">
                      🎉 Thank you for your support! Your message has been recorded on the blockchain.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Recent Supporters Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white">
              Recent Supporters
            </h2>

            {!isValidAddress ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400 mb-2">
                  ⚠️ Contract address not configured
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  Please set NEXT_PUBLIC_COFFEE_PORTAL_ADDRESS in your environment variables
                </p>
              </div>
            ) : memosError ? (
              <div className="text-center py-8">
                <p className="text-red-600 dark:text-red-400 mb-2">
                  Error loading memos
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500">
                  {memosError.message}
                </p>
              </div>
            ) : memos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  No supporters yet. Be the first! ☕
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {[...memos].reverse().map((memo, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {memo.name || 'Anonymous'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatAddress(memo.from)} • {formatDate(memo.timestamp)}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mt-2">
                      {memo.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
