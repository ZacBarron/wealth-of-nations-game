"use client";
import AuthLayout from "../components/layout/AuthLayout";
import { useState, useEffect } from "react";
import { ShoppingCartIcon, GiftIcon } from "@heroicons/react/24/outline";
import { useUser } from "@account-kit/react";
import { ethers } from 'ethers';

// Import the same constants and helper functions
const CONTRACT_ABI = [
  "function mint(address to)",
  "function hasClaimedStarterPack(address) view returns (bool)",
  "function tokenURI(uint256) view returns (string)"
];

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

// Helper functions
const ipfsToHttp = (ipfsUrl: string) => {
  if (!ipfsUrl) return '';
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `https://nftstorage.link/ipfs/${hash}`;
  }
  return ipfsUrl;
};

export default function PacksPage() {
  const user = useUser();
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [hasStarterPack, setHasStarterPack] = useState(false);
  const [nftMetadata, setNftMetadata] = useState<typeof FALLBACK.METADATA | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize contract
  useEffect(() => {
    if (user?.address) {
      const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
      const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

      if (!rpcUrl || !contractAddress) {
        console.error('Missing environment variables');
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

  // Check pack ownership and metadata
  useEffect(() => {
    const checkOwnership = async () => {
      if (user?.address && contract) {
        setIsLoading(true);
        try {
          const hasNFT = await contract.hasClaimedStarterPack(user.address);
          setHasStarterPack(hasNFT);

          if (hasNFT) {
            const tokenUri = await contract.tokenURI(0);
            if (tokenUri) {
              const ipfsHash = tokenUri.replace('ipfs://', '');
              const metadataResponse = await fetch(`/api/ipfs?hash=${ipfsHash}`);
              
              if (metadataResponse.ok) {
                const metadata = await metadataResponse.json();
                setNftMetadata(metadata);
              } else {
                setNftMetadata(FALLBACK.METADATA);
              }
            }
          }
        } catch (err) {
          console.error('Error checking pack ownership:', err);
          setNftMetadata(FALLBACK.METADATA);
        } finally {
          setIsLoading(false);
        }
      }
    };

    checkOwnership();
  }, [user?.address, contract]);

  return (
    <AuthLayout title="Packs">
      <div className="space-y-8">
        {/* My Packs Section */}
        <div className="bg-blue-900 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gold-300 flex items-center gap-2">
              <GiftIcon className="w-6 h-6" />
              My Packs
            </h2>
            <span className="text-blue-200">
              {hasStarterPack ? '1' : '0'} pack{hasStarterPack ? '' : 's'} available
            </span>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-pulse text-blue-200">Loading packs...</div>
            </div>
          ) : hasStarterPack ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-blue-800/50 rounded-xl p-6 border border-blue-700">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-amber-400">
                    {nftMetadata?.name || "Starter Pack"}
                  </h3>
                  <span className="px-3 py-1 rounded-full text-sm bg-blue-900/50 text-blue-400">
                    STARTER
                  </span>
                </div>
                
                <div className="max-w-[210px] mx-auto">
                  <div className="relative w-full pb-[150%] mb-4 rounded-xl overflow-hidden bg-blue-900/30">
                    <img 
                      src={ipfsToHttp(nftMetadata?.image || FALLBACK.IMAGE)}
                      alt="Starter Pack"
                      className="absolute inset-0 w-full h-full object-contain rounded-xl"
                    />
                  </div>
                </div>
                
                <p className="text-blue-200 mb-4">
                  Your first set of cards to start your journey in Wealth of Nations.
                </p>
                
                <div className="flex justify-between items-center">
                  <span className="text-blue-300 text-sm">40 cards</span>
                  <button className="px-4 py-2 bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors">
                    Open Pack
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-blue-200 text-center py-8">
              No packs available. Visit the store to get some!
            </p>
          )}
        </div>

        {/* Store Section */}
        <div className="bg-blue-900 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gold-300 flex items-center gap-2">
              <ShoppingCartIcon className="w-6 h-6" />
              Store
            </h2>
            <span className="text-blue-200">
              💎 0 diamonds
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Premium Pack */}
            <div className="bg-blue-800/50 rounded-xl p-6 border border-blue-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-amber-400">Premium Pack</h3>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-900/50 text-blue-400">
                  RARE
                </span>
              </div>
              <p className="text-blue-200 mb-4">
                High-quality cards with guaranteed rare drops.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-sm">10 cards</span>
                <button className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2">
                  💎 100
                </button>
              </div>
            </div>

            {/* Legendary Pack */}
            <div className="bg-blue-800/50 rounded-xl p-6 border border-blue-700">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-amber-400">Legendary Pack</h3>
                <span className="px-3 py-1 rounded-full text-sm bg-amber-900/50 text-amber-400">
                  LEGENDARY
                </span>
              </div>
              <p className="text-blue-200 mb-4">
                Contains the most powerful cards in the game.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-blue-300 text-sm">5 cards</span>
                <button className="px-4 py-2 bg-blue-700 hover:bg-blue-600 rounded-lg transition-colors flex items-center gap-2">
                  💎 500
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}