import { useState, useEffect } from 'react';
import Image from 'next/image';

export function IPFSImage({ ipfsUrl, alt }: { ipfsUrl: string; alt: string }) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (ipfsUrl) {
      const httpsUrl = ipfsUrl.replace("ipfs://", "https://ipfs.io/ipfs/");
      setImageUrl(httpsUrl);
    }
  }, [ipfsUrl]);

  return (
    <div className="relative w-full aspect-square">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          className="object-contain rounded-lg"
          onError={() => {
            setError('Failed to load image');
            setImageUrl('/images/card-pack.png'); // Fallback image
          }}
        />
      ) : (
        <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
          {error || 'Loading...'}
        </div>
      )}
    </div>
  );
} 