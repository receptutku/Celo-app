import { createWalletClient, http, createPublicClient } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { celoAlfajores } from 'viem/chains';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

async function deploy() {
  if (!process.env.PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY not found in environment variables');
  }

  // Read the compiled contract
  const artifactPath = path.join(__dirname, 'artifacts/contracts/CoffeePortal.sol/CoffeePortal.json');
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf-8'));

  // Create account from private key
  const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);

  // Create clients
  const publicClient = createPublicClient({
    chain: celoAlfajores,
    transport: http('https://alfajores-forno.celo-testnet.org'),
  });

  const walletClient = createWalletClient({
    account,
    chain: celoAlfajores,
    transport: http('https://alfajores-forno.celo-testnet.org'),
  });

  console.log('Deploying CoffeePortal to Celo Alfajores...');
  console.log('Deployer address:', account.address);

  // Deploy the contract
  const hash = await walletClient.deployContract({
    abi: artifact.abi,
    bytecode: artifact.bytecode as `0x${string}`,
  });

  console.log('Transaction hash:', hash);
  console.log('Waiting for confirmation...');

  // Wait for transaction receipt
  const receipt = await publicClient.waitForTransactionReceipt({ hash });
  
  console.log('\n✅ Contract deployed successfully!');
  console.log('Contract Address:', receipt.contractAddress);
  console.log('Block Number:', receipt.blockNumber);
  console.log('\nYou can view it on CeloScan:');
  console.log(`https://alfajores.celoscan.io/address/${receipt.contractAddress}`);

  return receipt.contractAddress;
}

deploy()
  .then((address) => {
    console.log('\n📝 Save this contract address for the frontend:', address);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Deployment failed:', error);
    process.exit(1);
  });

