import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    
    // Verify the secret token (set this in your environment variables)
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Get the type of content that was updated
    const { type, slug } = await request.json();
    
    // Revalidate specific paths based on content type
    switch(type) {
      case 'product':
        revalidatePath('/products');
        if (slug) revalidatePath(`/products/${slug}`);
        break;
      case 'category':
        revalidatePath('/products');
        break;
      case 'news':
        revalidatePath('/news');
        if (slug) revalidatePath(`/news/${slug}`);
        break;
      default:
        // Revalidate all main pages
        revalidatePath('/');
        revalidatePath('/products');
        revalidatePath('/news');
    }

    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
  }
}