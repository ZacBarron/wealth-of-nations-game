"use client";
import AuthLayout from "./components/layout/AuthLayout";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { createClient } from "@/src/lib/client";
import Link from 'next/link';

// Define outside the component with contract parameter
const checkStarterPackOwnership = async (
  address: string, 
  contract: ethers.Contract | null
) => {
  try {
    if (contract && address) {
      const hasNFT = await contract.hasClaimedStarterPack(address);
      return hasNFT;
    }
    return false;
  } catch (err) {
    console.error('Error checking NFT ownership:', err);
    return false;
  }
};

// Constants for fallback only
const FALLBACK = {
  IMAGE: '/images/globe-card.png',
  METADATA: {
    name: "Wealth of Nations Pack",
    description: "A pack of cards to use in Wealth of Nations.",
    image: '/images/globe-card.png',
    attributes: [
      {
        trait_type: "Pack Type",
        value: "Unknown"
      },
      {
        trait_type: "Status",
        value: "Unknown"
      }
    ]
  }
} as const;

const CONTRACT_ABI = [
  "function mint(address to)",
  "function hasClaimedStarterPack(address) view returns (bool)",
  "function tokenURI(uint256) view returns (string)"
];

// Image URL handling
function getImageUrl(imagePath: string): string {
  if (!imagePath) return FALLBACK.IMAGE;
  
  if (imagePath.startsWith('ipfs://')) {
    const ipfsHash = imagePath.replace('ipfs://', '');
    return `https://ipfs.io/ipfs/${ipfsHash}`;
  }
  
  return imagePath;
}

// Add this type definition at the top
type NFTMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
};

// Helper function to convert IPFS URL to HTTP URL
const ipfsToHttp = (ipfsUrl: string) => {
  if (!ipfsUrl) return '';
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `https://nftstorage.link/ipfs/${hash}`;  // Using nftstorage.link as gateway
  }
  return ipfsUrl;
};

// Define a consistent color palette
const colors = {
  background: {
    main: 'bg-slate-50/95', // Light background
    card: 'bg-blue-800/20',  // Lighter blue for cards
    darker: 'bg-blue-900/90' // Darker blue for header
  },
  cards: {
    red: 'bg-rose-500',     // Total Cards
    purple: 'bg-violet-500', // Packs Opened
    emerald: 'bg-emerald-500', // Collection Value
    orange: 'bg-amber-500'   // Rank
  },
  text: {
    primary: 'text-gold-300',
    secondary: 'text-blue-100',
    muted: 'text-blue-300/70'
  },
  border: 'border-blue-400/20'
} as const;

// Update the stats cards
const statsCards = [
  {
    title: 'TOTAL CARDS',
    value: '40',
    change: 'Add cards to your deck',
    color: colors.cards.red,
    icon: ''
  },
  {
    title: 'PACKS OPENED',
    value: '1',
    change: 'Buy packs to open new cards',
    color: colors.cards.purple,
    icon: ''
  },
  {
    title: 'Diamonds',
    value: '0 💎',
    change: 'In-game currency',
    color: colors.cards.emerald,
    icon: ''
  },
  {
    title: 'RANK',
    value: 'Unranked',
    change: 'Play games to rank up',
    color: colors.cards.orange,
    icon: ''
  }
];

export default function Home() {
  // Auth states
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();

  // Contract states
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [nftMetadata, setNftMetadata] = useState<NFTMetadata | null>(null);
  const [hasNFT, setHasNFT] = useState(false);

  // UI states
  const [isChecking, setIsChecking] = useState(true);
  const [isMinting, setIsMinting] = useState(false);
  const [isTransactionPending, setIsTransactionPending] = useState(false);
  const [mintSuccess, setMintSuccess] = useState(false);
  const [mintError, setMintError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [txHash, setTxHash] = useState('');
  const [actualTxHash, setActualTxHash] = useState('');
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(true);
  const [isPackOpened, setIsPackOpened] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize contract
  useEffect(() => {
    if (user?.address) {
      // Validate environment variables
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

      if (!rpcUrl || !contractAddress) {
        console.error('Missing environment variables:', {
          rpcUrl: !!rpcUrl,
          contractAddress: !!contractAddress
        });
        return;
      }

      try {
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        const newContract = new ethers.Contract(
          contractAddress,
          CONTRACT_ABI,
          provider
        );
        setContract(newContract);
      } catch (error) {
        console.error('Error initializing contract:', error);
      }
    }
  }, [user?.address]);

  useEffect(() => {
    const checkOwnershipAndMetadata = async () => {
      if (user?.address && contract) {
        setIsChecking(true);
        try {
          const ownsNFT = await checkStarterPackOwnership(user.address, contract);
          setHasNFT(ownsNFT);
          await fetchNFTMetadata();
        } catch (err) {
          console.error('Error checking NFT ownership:', err);
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkOwnershipAndMetadata();
  }, [user?.address, contract]);

  const checkTransactionStatus = async (hash: `0x${string}`) => {
    try {
      console.log('Checking UserOperation status for hash:', hash);
      
      // Use the client's built-in method instead of raw RPC calls
      const client = await createClient();
      const receipt = await client.getUserOperationReceipt(hash);
      
      console.log('UserOperation receipt:', receipt);
      
      if (receipt) {
        // Also get the full UserOperation details
        const userOp = await client.getUserOperationByHash(hash);
        console.log('UserOperation details:', userOp);
        
        if (userOp?.transactionHash) {
          setActualTxHash(userOp.transactionHash);
        }
        
        return true;
      }
      
      return false;
    } catch (err) {
      console.error('Error checking UserOperation:', err);
      return false;
    }
  };

  const signerStatus = useSignerStatus();

  const handleClaimStarterPack = async () => {
    if (!user?.address) return;
    
    try {
      setIsMinting(true);
      setMintError(null);
      setMintSuccess(false);
      setTxHash('');
      setIsTransactionPending(false);
      setStatusMessage('Checking ownership status...');

      // Check if user already owns an NFT
      const hasNFT = await checkStarterPackOwnership(user.address, contract);
      if (hasNFT) {
        setMintError("You've already claimed a starter pack!");
        setIsMinting(false);
        return;
      }

      setStatusMessage('Initiating transaction...');
      
      try {
        const client = await createClient();
        console.log('Client config:', {
          address: user.address,
          entryPoint: await client.account?.getEntryPoint(),
          accountAddress: client.account?.address
        });
        
        const targetAddress = process.env.NEXT_PUBLIC_STARTER_PACK_ADDRESS as `0x${string}`;
        const mintInterface = new ethers.Interface(['function mint(address to)']);
        const data = mintInterface.encodeFunctionData('mint', [user.address]) as `0x${string}`;
        
        setStatusMessage('Sending transaction to network...');
        console.log('Preparing UserOperation with data:', {
          target: targetAddress,
          data: data,
          value: '0'
        });

        const { hash } = await client.sendUserOperation({
          uo: {
            target: targetAddress,
            data: data,
            value: BigInt(0),
          },
        });
        
        console.log('UserOperation hash:', hash);
        setTxHash(hash);
        setIsTransactionPending(true);
        setStatusMessage('Transaction submitted. Waiting for confirmation...');

        let attempts = 0;
        const maxAttempts = 20; // Reduce to 20 attempts but check more frequently
        
        const pollInterval = setInterval(async () => {
          attempts++;
          console.log(`Polling attempt ${attempts}...`);
          const isConfirmed = await checkTransactionStatus(hash);
          
          if (isConfirmed) {
            console.log('UserOperation confirmed!');
            clearInterval(pollInterval);
            setIsTransactionPending(false);
            setMintSuccess(true);
            setStatusMessage('Transaction confirmed! Your Starter Pack has been claimed.');
          } else if (attempts >= maxAttempts) {
            console.log('Max attempts reached. Checking final status...');
            clearInterval(pollInterval);
            setIsTransactionPending(false);
            setStatusMessage('Transaction may have failed. Please check your wallet or try again.');
            setMintError('Transaction unsuccessful. Please verify in your wallet.');
          }
        }, 1500); // Check every 1.5 seconds instead
        
      } catch (err) {
        console.error('Minting error:', err);
        setMintError(err instanceof Error ? err.message : "Failed to claim Starter Pack");
        setStatusMessage('Error occurred during claiming.');
      } finally {
        setIsMinting(false);
      }
    } catch (err) {
      console.error('Error:', err);
      setMintError(err instanceof Error ? err.message : "Failed to check mint status");
    }
  };

  // Fetch metadata from contract and IPFS
  const fetchNFTMetadata = async () => {
    setIsLoadingMetadata(true);
    try {
      if (!contract) {
        console.log('Contract not initialized');
        return;
      }

      // Get tokenURI from contract
      const tokenUri = await contract.tokenURI(0);
      console.log('Token URI from contract:', tokenUri);

      if (tokenUri) {
        const ipfsHash = tokenUri.replace('ipfs://', '');
        
        // Try our API route
        const metadataResponse = await fetch(`/api/ipfs?hash=${ipfsHash}`);
        
        if (metadataResponse.ok) {
          const metadata = await metadataResponse.json();
          console.log('Successfully fetched metadata:', metadata);
          setNftMetadata(metadata as NFTMetadata);
          return;
        }
      }

      // Fallback metadata with correct type
      const fallbackMetadata: NFTMetadata = {
        name: "Wealth of Nations Pack",
        description: "A pack of cards to use in Wealth of Nations.",
        image: '/images/globe-card.png',
        attributes: [
          {
            trait_type: "Pack Type",
            value: "Unknown"
          },
          {
            trait_type: "Status",
            value: "Unknown"
          }
        ]
      };
      
      setNftMetadata(fallbackMetadata);
      
    } catch (err) {
      console.error('Error fetching NFT metadata:', err);
      setNftMetadata(null);
    } finally {
      setIsLoadingMetadata(false);
    }
  };

  return (
    <AuthLayout>
      {user && (
        <div className="space-y-8">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-4 gap-6">
            {statsCards.map((card, index) => (
              <div key={index} className={`${card.color} rounded-2xl p-6 text-white`}>
                <div className="flex justify-between">
                  <div>
                    <div className="text-sm">{card.title}</div>
                    <div className="text-3xl font-bold mt-2">{card.value}</div>
                    <div className="text-sm mt-2">{card.change}</div>
                  </div>
                  <span className="text-2xl">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Main Card Grid */}
          <div className="grid grid-cols-3 gap-6">
            {/* Starter Pack Card */}
            <div className="col-span-2 bg-blue-900 p-8 rounded-2xl">
              {isLoadingMetadata ? (
                // Loading state
                <div className="animate-pulse space-y-4">
                  <div className="h-8 bg-blue-800/50 rounded w-64"></div>
                  <div className="h-4 bg-blue-800/50 rounded w-96"></div>
                  <div className="h-64 bg-blue-800/50 rounded"></div>
                </div>
              ) : !hasNFT ? (
                // Unclaimed state - Show claim button
                <>
                  <h2 className="text-2xl font-bold text-gold-300 mb-4">
                    Wealth of Nations Starter Pack
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Your first set of cards to start your journey in Wealth of Nations.
                  </p>
                  
                  <div className="max-w-[210px] mx-auto">
                    <div className="relative w-full pb-[150%] mb-6 rounded-xl overflow-hidden bg-blue-900/30">
                      <img 
                        src={ipfsToHttp(nftMetadata?.image || FALLBACK.IMAGE)}
                        alt="Starter Pack"
                        className="absolute inset-0 w-full h-full object-contain rounded-xl"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleClaimStarterPack}
                    disabled={isProcessing}
                    className={`
                      w-full px-8 py-4 rounded-xl font-bold transition-all duration-300
                      ${isProcessing 
                        ? 'bg-amber-500/50 cursor-not-allowed' 
                        : 'bg-amber-500 hover:bg-amber-400 shadow-lg hover:shadow-amber-500/20'
                      }
                      text-white
                    `}
                  >
                    {isProcessing ? 'Processing...' : 'Claim Your Starter Pack'}
                  </button>
                  
                  {statusMessage && (
                    <p className="text-blue-200 text-center mt-4">{statusMessage}</p>
                  )}
                </>
              ) : !isPackOpened ? (
                // Claimed but unopened state - Show open pack button
                <>
                  <h2 className="text-2xl font-bold text-gold-300 mb-4">
                    Wealth of Nations Starter Pack
                  </h2>
                  <p className="text-blue-100 mb-6">
                    Your first set of cards to start your journey in Wealth of Nations.
                  </p>

                  <div className="max-w-[210px] mx-auto">
                    <div className="relative w-full pb-[150%] mb-6 rounded-xl overflow-hidden bg-blue-900/30">
                      <img 
                        src={ipfsToHttp(nftMetadata?.image || FALLBACK.IMAGE)}
                        alt="Starter Pack"
                        className="absolute inset-0 w-full h-full object-contain rounded-xl"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-blue-300">40 cards</span>
                    <button
                      onClick={() => setIsPackOpened(true)}
                      className="px-6 py-3 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors text-white font-semibold"
                    >
                      Open Pack
                    </button>
                  </div>
                </>
              ) : (
                // Opened state - Show next steps
                <>
                  <h2 className="text-2xl font-bold text-gold-300 mb-4">
                    Welcome to Wealth of Nations!
                  </h2>
                  <p className="text-blue-100 mb-8">
                    Your starter pack has been added to your collection. Here's what you can do next:
                  </p>
                  
                  <div className="space-y-4">
                    <Link
                      href="/play"
                      className="flex items-center justify-between w-full p-4 bg-blue-800/40 rounded-lg hover:bg-blue-800/60 transition-colors group"
                    >
                      <div>
                        <h3 className="text-gold-300 font-semibold mb-1">Play Your First Game</h3>
                        <p className="text-blue-200 text-sm">Test your deck in an actual match</p>
                      </div>
                      <span className="text-gold-300 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>

                    <Link
                      href="/deck"
                      className="flex items-center justify-between w-full p-4 bg-blue-800/40 rounded-lg hover:bg-blue-800/60 transition-colors group"
                    >
                      <div>
                        <h3 className="text-gold-300 font-semibold mb-1">Edit Your Deck</h3>
                        <p className="text-blue-200 text-sm">Customize your deck strategy</p>
                      </div>
                      <span className="text-gold-300 group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Recent Activity Card */}
            <div className="bg-blue-900 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-gold-300 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {/* Show Pack Claim if user has claimed */}
                {hasNFT && (
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-gold-300"></div>
                    <div>
                      <div className="text-white font-medium">Pack Opened</div>
                      <div className="text-sm text-blue-200">Wealth of Nations Starter Pack</div>
                    </div>
                  </div>
                )}
                
                {/* Always show account creation */}
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 mt-2 rounded-full bg-gold-300"></div>
                  <div>
                    <div className="text-white font-medium">Account Created</div>
                    <div className="text-sm text-blue-200 font-mono break-all">
                      {user?.email || 'Email Unavailable'} | {user?.address || 'Address Unavailable'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}