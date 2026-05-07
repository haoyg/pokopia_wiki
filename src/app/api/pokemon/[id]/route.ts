import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const env = (globalThis as any).cloudflare?.env
    if (!env?.DB) {
      return NextResponse.json({ error: 'DB not configured' }, { status: 500 })
    }
    const result = await env.DB.prepare('SELECT * FROM pokemon WHERE id = ?').bind(id).first()
    if (!result) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
