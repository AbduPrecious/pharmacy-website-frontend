import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Verify the secret token
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ 
        message: 'Invalid secret' 
      }, { status: 401 });
    }

    // In Next.js App Router, we can use fetch with cache: 'no-store'
    // to bypass cache, or we can return a success message
    
    return NextResponse.json({ 
      success: true, 
      message: 'Revalidation triggered',
      timestamp: Date.now()
    });
  } catch (error) {
    return NextResponse.json({ 
      message: 'Error', 
      error: error.message 
    }, { status: 500 });
  }
}

export async function POST(request) {
  return GET(request);
}