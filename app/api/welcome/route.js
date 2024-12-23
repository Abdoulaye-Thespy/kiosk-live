export async function GET() {
    try {
      // Fetch a random post from JSONPlaceholder
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1')
      
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
  
      const data = await response.json()
  
      // Return the fetched data as JSON
      return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' },
      })
    } catch (error) {
      // If there's an error, return it with a 500 status code
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }
  }
  
  