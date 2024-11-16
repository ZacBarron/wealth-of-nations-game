import { ethers } from 'ethers';
import StarterPackABI from '../abis/StarterPack.json';

export function getStarterPackContract(signer: ethers.Signer) {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_STARTER_PACK_ADDRESS!,
    StarterPackABI,
    signer
  );
}
