import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const env = (globalThis as any).cloudflare?.env
    if (!env?.DB) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
    }
    const result = await env.DB.prepare('SELECT * FROM habitats ORDER BY name').all()
    return NextResponse.json(result.results)
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
