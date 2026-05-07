export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    // Access D1 through Cloudflare's env
    const env = (process.env as any).DB || (globalThis as any).cloudflare?.env?.DB
    if (!env) {
      return new Response(JSON.stringify({ error: 'DB not configured', env: typeof process.env }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }
    const result = await env.prepare('SELECT * FROM pokemon ORDER BY name').all()
    return new Response(JSON.stringify(result.results), {
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: 'Database error', details: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
