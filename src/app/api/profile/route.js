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
    const profile = await db.collection('profiles').findOne({ userId: user._id })

    return NextResponse.json({
      profile: profile || {
        userId: user._id,
        displayName: user.username,
        bio: '',
        avatarUrl: '',
        preferences: { topics: [], creators: [], formats: [], mutedTopics: [] },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  } catch (error) {
    console.error('Profile GET error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await request.json()
    const { displayName, bio, avatarUrl, preferences } = body || {}

    const db = await getDb()
    const now = new Date()
    await db.collection('profiles').updateOne(
      { userId: user._id },
      {
        $set: {
          displayName: displayName ?? user.username,
          bio: bio ?? '',
          avatarUrl: avatarUrl ?? '',
          preferences: preferences ?? { topics: [], creators: [], formats: [] },
          updatedAt: now,
        },
        $setOnInsert: { createdAt: now, userId: user._id },
      },
      { upsert: true }
    )

    const profile = await db.collection('profiles').findOne({ userId: user._id })
    return NextResponse.json({ profile })
  } catch (error) {
    console.error('Profile PUT error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


