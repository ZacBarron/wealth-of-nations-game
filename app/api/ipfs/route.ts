import { NextResponse } from 'next/server';

// Add caching
const metadataCache = new Map<string, any>();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hash = searchParams.get('hash');

  if (!hash) {
    return new Response('Hash parameter is required', { status: 400 });
  }

  // Check cache first
  if (metadataCache.has(hash)) {
    return new Response(JSON.stringify(metadataCache.get(hash)), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  console.log('API Route: Received request for hash:', hash);
  
  try {
    const url = `https://${hash}.ipfs.w3s.link`;
    console.log('Trying web3.storage URL:', url);
    
    const response = await fetch(url);
    console.log('Response status:', response.status);
    
    if (response.ok) {
      const metadata = await response.json();
      console.log('Successfully fetched metadata:', metadata);
      
      // Cache the result
      metadataCache.set(hash, metadata);
      
      return new Response(JSON.stringify(metadata), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    return new Response('Failed to fetch from IPFS', { status: 502 });
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    return new Response('Error fetching from IPFS', { status: 500 });
  }
} 