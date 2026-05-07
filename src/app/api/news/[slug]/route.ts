import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const env = (globalThis as any).cloudflare?.env
    if (!env?.DB) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
    }
    const result = await env.DB.prepare('SELECT * FROM news WHERE slug = ?').bind(slug).first()
    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
