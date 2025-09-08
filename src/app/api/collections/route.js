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
    const collections = await db.collection('collections').find({ userId: user._id }).sort({ updatedAt: -1 }).toArray()
    return NextResponse.json({ collections })
  } catch (error) {
    console.error('Collections GET error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, description } = await request.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const db = await getDb()
    const now = new Date()
    const doc = { userId: user._id, name, description: description ?? '', items: [], createdAt: now, updatedAt: now }
    const result = await db.collection('collections').insertOne(doc)
    return NextResponse.json({ collection: { ...doc, _id: result.insertedId } })
  } catch (error) {
    console.error('Collections POST error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


