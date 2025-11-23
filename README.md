# Buy Me a Coffee - Celo dApp

A decentralized application built on Celo Alfajores that allows users to send CELO tips and leave supportive messages.

## Project Structure

```
celo-app/
├── apps/
│   ├── contracts/          # Smart contracts (Hardhat)
│   │   ├── contracts/
│   │   │   └── CoffeePortal.sol
│   │   └── deploy-coffee.ts
│   └── web/                # Next.js frontend
│       └── src/
│           ├── app/
│           └── components/
```

## Phase 1: Smart Contract Deployment

### Prerequisites

1. Node.js and npm installed
2. A wallet with CELO on Alfajores testnet
   - Get testnet CELO from: https://faucet.celo.org/alfajores
3. Your wallet's private key

### Deployment Steps

1. **Navigate to contracts directory:**
   ```bash
   cd apps/contracts
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   echo "PRIVATE_KEY=your_private_key_here" > .env
   ```

4. **Compile the contract:**
   ```bash
   npm run compile
   ```

5. **Deploy to Alfajores:**
   ```bash
   npx ts-node deploy-coffee.ts
   ```

6. **Save the contract address** - you'll need it for the frontend!

### Using MCP Tools for Network Verification

You can use `celo-mcp` tools to verify network status and transaction details:

- Check network connectivity
- Get gas fee data
- Verify deployed contract
- Query contract state

## Phase 2: Frontend Setup

### Prerequisites

1. Node.js and npm installed
2. WalletConnect Project ID (get from https://cloud.walletconnect.com)
3. Deployed contract address from Phase 1

### Setup Steps

1. **Navigate to web directory:**
   ```bash
   cd apps/web
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Update `.env.local` with your values:**
   ```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id
   NEXT_PUBLIC_COFFEE_PORTAL_ADDRESS=your_deployed_contract_address
   ```

5. **Run the development server:**
   ```bash
   npm run dev
   ```

6. **Open your browser:**
   Navigate to `http://localhost:3000`

## Features

- ✅ Connect wallet using RainbowKit
- ✅ Send 0.01 CELO with a message
- ✅ View all supporter messages
- ✅ Real-time transaction status
- ✅ Beautiful, modern UI with Tailwind CSS
- ✅ Dark mode support

## Smart Contract Functions

- `buyCoffee(string name, string message)` - Send CELO and leave a message
- `getMemos()` - Retrieve all memos
- `withdraw()` - Owner can withdraw accumulated tips

## Tech Stack

### Smart Contracts
- Solidity ^0.8.20
- Hardhat
- TypeScript
- Viem

### Frontend
- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- RainbowKit
- Wagmi
- Viem

## Network

- **Testnet:** Celo Alfajores (Chain ID: 44787)
- **RPC:** https://alfajores-forno.celo-testnet.org
- **Explorer:** https://alfajores.celoscan.io

## License

MIT

# Celo-app
