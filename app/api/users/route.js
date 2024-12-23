export async function GET() {
    return new Response('Welcome to users endpointd', {
      headers: { 'Content-Type': 'text/plain' },
    })
  }
  
  