import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { getDb } from '@/lib/api'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const db = await getDb()
    const profile = await db.collection('profiles').findOne({ userId: user._id })
    const prefs = profile?.preferences || { topics: [], creators: [], formats: [] }

    const query = {}
    const or = []
    if (prefs.topics?.length) {
      or.push({ topic: { $in: prefs.topics } })
    }
    if (prefs.formats?.length) {
      or.push({ type: { $in: prefs.formats } })
    }
    if (prefs.creators?.length) {
      query.creatorId = { $in: prefs.creators }
    }
    if (prefs.mutedTopics?.length) {
      query.topic = query.topic || {}
      query.topic.$nin = prefs.mutedTopics
    }
    if (or.length) query.$or = or

    // Blend with trending fallback
    const results = await db
      .collection('generations')
      .find(or.length ? query : {})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray()

    return NextResponse.json({ results })
  } catch (error) {
    console.error('Feed GET error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


