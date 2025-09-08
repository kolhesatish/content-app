import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { getDb } from '@/lib/api'
import { getSummaryFor } from '@/lib/summarize'

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { text, mode = 'eli5' } = await request.json()
    if (!text || text.trim().length === 0) {
      return NextResponse.json({ error: 'text is required' }, { status: 400 })
    }

    const db = await getDb()
    const key = `${mode}:${hashKey(text)}`

    const cached = await db.collection('summaries').findOne({ key, userId: user._id })
    if (cached) {
      return NextResponse.json({ summary: cached.summary })
    }

    const summary = await getSummaryFor(text, mode)

    await db.collection('summaries').insertOne({
      key,
      userId: user._id,
      summary,
      createdAt: new Date(),
    })

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Summaries POST error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function hashKey(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return String(h >>> 0)
}


