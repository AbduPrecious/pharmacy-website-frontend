// Replace your entire route.js with this SIMPLE version
export async function GET() {
  return new Response(
    JSON.stringify({ 
      success: true, 
      message: 'API is working',
      timestamp: Date.now() 
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

export async function POST() {
  return GET();
}