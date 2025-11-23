# CoffeePortal Deployment Guide

## Prerequisites

1. A wallet with CELO on Alfajores testnet (get testnet CELO from https://faucet.celo.org/alfajores)
2. Your private key (keep it secure!)

## Deployment Steps

1. Create a `.env` file in the `apps/contracts` directory:
   ```
   PRIVATE_KEY=your_private_key_here
   ```

2. Deploy the contract:
   ```bash
   cd apps/contracts
   npx ts-node deploy-coffee.ts
   ```

3. Save the contract address that is output - you'll need it for the frontend!

## Using MCP Tools for Network Verification

Before deployment, you can use MCP tools to:
- Check network status
- Get gas fee data
- Verify network connectivity

After deployment, use MCP tools to:
- Verify the transaction
- Check contract balance
- Query contract state

