"use client";
import AuthLayout from "./components/layout/AuthLayout";
import {
  useAuthModal,
  useLogout,
  useSignerStatus,
  useUser,
} from "@account-kit/react";
import { ethers } from 'ethers';
import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from "@/src/lib/client";
import Link from 'next/link';
import Image from 'next/image';
import { useDiamondStore } from './lib/store';

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

// Make StatsCards a proper React component
const StatsCards: React.FC<{ hasNFT: boolean; isPackOpened: boolean }> = ({ hasNFT, isPackOpened }) => {
  const diamonds = useDiamondStore();
  
  const cards = [
    {
      title: 'TOTAL CARDS',
      value: isPackOpened ? '40' : '0',
      change: isPackOpened ? 'Cards in your collection' : 'Open your starter pack',
      color: colors.cards.red,
      icon: ''
    },
    {
      title: 'PACKS CLAIMED',
      value: hasNFT ? '1' : '0',
      change: hasNFT 
        ? 'Starter pack claimed' 
        : 'Claim your first pack',
      color: colors.cards.purple,
      icon: ''
    },
    {
      title: 'DIAMONDS',
      value: `${diamonds.balance} 💎`,
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

  return (
    <>
      {cards.map((card, index) => (
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
    </>
  );
};

// Create a custom event for pack claiming
const PACK_CLAIMED_EVENT = 'packClaimed';

// Add a new type for activities
type ActivityType = 'ACCOUNT_CREATED' | 'PACK_CLAIMED' | 'PACK_OPENED';

type Activity = {
  type: ActivityType;
  title: string;
  description: string;
  timestamp: Date;
};

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
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);
  const [isPackOpened, setIsPackOpened] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const metadataFetchedRef = useRef(false);
  const [isPackClaimed, setIsPackClaimed] = useState(false);

  // Add state for activities
  const [activities, setActivities] = useState<Activity[]>([]);

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

  // First, memoize the fetch function to prevent it from changing on every render
  const fetchNFTMetadata = useCallback(async () => {
    if (!contract || metadataFetchedRef.current) {
      return;
    }

    setIsLoadingMetadata(true);
    try {
      const tokenUri = await contract.tokenURI(0);
      console.log('Token URI from contract:', tokenUri);

      if (tokenUri) {
        const ipfsHash = tokenUri.replace('ipfs://', '');
        const metadataResponse = await fetch(`/api/ipfs?hash=${ipfsHash}`);
        
        if (metadataResponse.ok) {
          const metadata = await metadataResponse.json();
          setNftMetadata(metadata as NFTMetadata);
          metadataFetchedRef.current = true;
        }
      }
    } catch (err) {
      console.error('Error fetching NFT metadata:', err);
      setNftMetadata(null);
    } finally {
      setIsLoadingMetadata(false);
    }
  }, [contract]); // Only depend on contract

  // Then use a single useEffect for fetching
  useEffect(() => {
    if (user?.address && contract && !metadataFetchedRef.current) {
      fetchNFTMetadata();
    }
  }, [user?.address, contract, fetchNFTMetadata]);

  // Add function to check pack status
  const checkPackStatus = async () => {
    if (!user?.address) return;
    
    try {
      // Replace with your actual contract call
      const response = await fetch(`/api/pack-status?address=${user.address}`);
      const data = await response.json();
      setIsPackClaimed(data.claimed);
      setIsPackOpened(data.opened);
    } catch (error) {
      console.error('Error checking pack status:', error);
    }
  };

  // Add event listener for transaction success
  const handlePackClaimed = () => {
    setIsPackClaimed(true);
    checkPackStatus(); // Recheck status after claim
  };

  // Check status on mount and when user changes
  useEffect(() => {
    checkPackStatus();
  }, [user?.address]);

  useEffect(() => {
    // Function to handle the custom event
    const handlePackClaimed = () => {
      setIsPackClaimed(true);
      // Update your activity list here
    };

    // Add event listener
    window.addEventListener(PACK_CLAIMED_EVENT, handlePackClaimed);

    // Cleanup
    return () => {
      window.removeEventListener(PACK_CLAIMED_EVENT, handlePackClaimed);
    };
  }, []);

  // Add useEffect to initialize activities
  useEffect(() => {
    if (user) {
      const initialActivities: Activity[] = [
        {
          type: 'ACCOUNT_CREATED' as const,
          title: 'Account Created',
          description: `${user.email || 'Email Unavailable'} | ${user.address || 'Address Unavailable'}`,
          timestamp: new Date()
        }
      ];

      if (hasNFT) {
        initialActivities.unshift({
          type: 'PACK_CLAIMED' as const,
          title: 'Pack Claimed',
          description: 'Wealth of Nations Starter Pack',
          timestamp: new Date()
        });
      }

      setActivities(initialActivities);
    }
  }, [user, hasNFT]);

  // Update the pack opening handler
  const handlePackOpen = () => {
    setIsPackOpened(true);
    setActivities(prev => [{
      type: 'PACK_OPENED' as const,
      title: 'Pack Opened',
      description: '40 cards added to your collection',
      timestamp: new Date()
    }, ...prev]);
  };

  return (
    <AuthLayout>
      {user && (
        <div className="space-y-8">
          {/* Stats Cards Grid */}
          <div className="grid grid-cols-4 gap-6">
            <StatsCards hasNFT={hasNFT} isPackOpened={isPackOpened} />
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
                  
                  <div className="max-w-[210px] mx-auto mb-6">
                    <div className="relative rounded-xl overflow-hidden bg-blue-900/30">
                      <Image 
                        src={ipfsToHttp(nftMetadata?.image || FALLBACK.IMAGE)}
                        alt="Starter Pack"
                        width={300}
                        height={450}
                        className="object-contain w-full h-auto"
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

                  <div className="max-w-[210px] mx-auto mb-6">
                    <div className="relative rounded-xl overflow-hidden bg-blue-900/30">
                      <Image 
                        src={ipfsToHttp(nftMetadata?.image || FALLBACK.IMAGE)}
                        alt="Starter Pack"
                        width={300}
                        height={450}
                        className="object-contain w-full h-auto"
                      />
                    </div>
                  </div>

                  {/* Pack Contents Info */}
                  <div className="bg-blue-800/30 rounded-lg p-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-200 font-medium">Pack Contents:</span>
                      <span className="text-blue-300">40 cards</span>
                    </div>
                    <p className="text-blue-200 text-sm">
                      Contains a balanced mix of resources, industries, and trade cards to build your first deck.
                    </p>
                  </div>

                  <button
                    onClick={handlePackOpen}
                    className={`
                      w-full px-8 py-4 rounded-xl font-bold transition-all duration-300
                      bg-amber-500 hover:bg-amber-400 shadow-lg hover:shadow-amber-500/20
                      text-white
                    `}
                  >
                    Open Pack
                  </button>
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
                {activities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 mt-2 rounded-full bg-gold-300 flex-shrink-0"></div>
                    <div className="min-w-0">
                      <div className="text-white font-medium">{activity.title}</div>
                      <div className="text-sm text-blue-200 break-all">{activity.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </AuthLayout>
  );
}