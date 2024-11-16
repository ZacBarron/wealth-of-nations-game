import { ethers } from 'ethers';
import StarterPackABI from '@/src/abis/StarterPack.json';

export async function getContract() {
  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_RPC_URL);
  const contract = new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS!,
    StarterPackABI as any[],
    provider
  );
  
  return contract;
}