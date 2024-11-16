import { NextResponse } from 'next/server';
import { getContract } from '@/src/lib/contract';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 });
  }

  try {
    const contract = await getContract();
    const claimed = await contract.hasClaimedPack(address);
    const opened = await contract.hasOpenedPack(address);

    return NextResponse.json({
      claimed,
      opened
    });
  } catch (error) {
    console.error('Error checking pack status:', error);
    return NextResponse.json({ error: 'Failed to check pack status' }, { status: 500 });
  }
}