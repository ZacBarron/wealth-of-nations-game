import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('API Route hit!');
  
  try {
    const { searchParams } = new URL(request.url);
    const hash = searchParams.get('hash');
    
    console.log('API Route: Received request for hash:', hash);

    if (!hash) {
      return NextResponse.json({ error: 'No IPFS hash provided' }, { status: 400 });
    }

    // Try web3.storage gateway first
    try {
      const w3sUrl = `https://${hash}.ipfs.w3s.link`;
      console.log('Trying web3.storage URL:', w3sUrl);
      
      const response = await fetch(w3sUrl);
      console.log('Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched metadata:', data);
        return NextResponse.json(data);
      }
    } catch (err) {
      console.error('Failed to fetch from web3.storage:', err);
    }

    // Fallback gateways
    const gateways = [
      'https://w3s.link/ipfs/',
      'https://ipfs.io/ipfs/',
      'https://cloudflare-ipfs.com/ipfs/'
    ];

    for (const gateway of gateways) {
      try {
        const url = `${gateway}${hash}`;
        console.log('Trying fallback URL:', url);
        
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        console.error(`Failed to fetch from ${gateway}:`, err);
      }
    }

    return NextResponse.json(
      { error: 'Failed to fetch from all IPFS gateways' }, 
      { status: 500 }
    );
  } catch (err) {
    console.error('API Route Error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to fetch from IPFS' }, 
      { status: 500 }
    );
  }
} 