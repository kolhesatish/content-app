import { NextResponse } from 'next/server'
import { getDb } from '@/lib/api'
import { getUserFromToken } from '@/lib/auth'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const db = await getDb()
    const list = await db.collection('readLater').find({ userId: user._id }).sort({ addedAt: -1 }).toArray()
    return NextResponse.json({ items: list })
  } catch (error) {
    console.error('ReadLater GET error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { contentId, title, url, metadata } = await request.json()
    if (!contentId) return NextResponse.json({ error: 'contentId required' }, { status: 400 })

    const db = await getDb()
    const now = new Date()

    await db.collection('readLater').updateOne(
      { userId: user._id, contentId },
      { $set: { title: title ?? '', url: url ?? '', metadata: metadata ?? {}, addedAt: now } },
      { upsert: true }
    )

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('ReadLater POST error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(request.url)
    const contentId = searchParams.get('contentId')
    if (!contentId) return NextResponse.json({ error: 'contentId required' }, { status: 400 })

    const db = await getDb()
    await db.collection('readLater').deleteOne({ userId: user._id, contentId })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('ReadLater DELETE error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


