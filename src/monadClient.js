import {createPublicClient, defineChain, http} from 'viem';
import { createWalletClient, custom } from 'viem';
import {mainnet} from "viem/chains";
import * as client from "viem/actions";
// Import the custom Monad Testnet chain you defined in the previous step

// Explicitly define the Monad Testnet network structure
export const monadTestnet = defineChain({
  id: 10143,
  name: 'Monad Testnet',
  nativeCurrency: {
    name: 'MON',
    symbol: 'MON',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      // You can use the public endpoint or your own private RPC here
      http: ['https://testnet-rpc.monad.xyz/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Monadscan',
      url: 'https://testnet.monadscan.com/',
    },
  },
});

export const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

