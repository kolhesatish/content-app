import { NextResponse } from 'next/server'
import { getUserFromToken } from '@/lib/auth'
import { getDb } from '@/lib/api'

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    const user = token ? await getUserFromToken(token) : null

    const { searchParams } = new URL(request.url)
    const q = (searchParams.get('q') || '').trim()
    const type = searchParams.get('type') || '' // post | reel | story
    const topic = searchParams.get('topic') || ''
    const recency = parseInt(searchParams.get('recency') || '0', 10) // days
    const minLen = parseInt(searchParams.get('minLen') || '0', 10)
    const maxLen = parseInt(searchParams.get('maxLen') || '0', 10)
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
    const pageSize = Math.min(Math.max(parseInt(searchParams.get('pageSize') || '20', 10), 1), 50)
    const sort = searchParams.get('sort') || 'new' // new | short | long

    const db = await getDb()
    const query = {}
    if (q) {
      query.$or = [
        { caption: { $regex: escapeRegex(q), $options: 'i' } },
        { hashtags: { $elemMatch: { $regex: escapeRegex(q), $options: 'i' } } },
        { topic: { $regex: escapeRegex(q), $options: 'i' } },
      ]
    }
    if (type) query.type = type
    if (topic) query.topic = { $regex: escapeRegex(topic), $options: 'i' }
    if (recency > 0) {
      const since = new Date(Date.now() - recency * 24 * 60 * 60 * 1000)
      query.createdAt = { $gte: since }
    }
    if (minLen > 0 || maxLen > 0) {
      query.length = {}
      if (minLen > 0) query.length.$gte = minLen
      if (maxLen > 0) query.length.$lte = maxLen
    }

    const skip = (page - 1) * pageSize
    const sortSpec = sort === 'short' ? { length: 1 } : sort === 'long' ? { length: -1 } : { createdAt: -1 }
    const cursor = db.collection('generations').find(query).sort(sortSpec).skip(skip).limit(pageSize)
    const results = await cursor.toArray()
    const total = await db.collection('generations').countDocuments(query)

    // facet counts (simple)
    const typesAgg = await db.collection('generations').aggregate([
      { $match: query },
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]).toArray()
    const topicsAgg = await db.collection('generations').aggregate([
      { $match: query },
      { $group: { _id: '$topic', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 20 },
    ]).toArray()

    return NextResponse.json({
      results,
      page,
      pageSize,
      total,
      facets: {
        type: typesAgg.map((t) => ({ value: t._id, count: t.count })),
        topics: topicsAgg.filter(t => t._id).map((t) => ({ value: t._id, count: t.count })),
      },
      userId: user?._id || null,
    })
  } catch (error) {
    console.error('Search GET error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}


