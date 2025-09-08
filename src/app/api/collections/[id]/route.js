import { NextResponse } from 'next/server'
import { getDb } from '@/lib/api'
import { getUserFromToken } from '@/lib/auth'
import { ObjectId } from 'mongodb'

export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, description, items } = await request.json()
    const db = await getDb()
    const now = new Date()
    const _id = new ObjectId(params.id)

    // Ensure ownership
    const collection = await db.collection('collections').findOne({ _id, userId: user._id })
    if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    await db.collection('collections').updateOne(
      { _id },
      { $set: { name, description, items, updatedAt: now } }
    )
    const updated = await db.collection('collections').findOne({ _id })
    return NextResponse.json({ collection: updated })
  } catch (error) {
    console.error('Collection PUT error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const user = await getUserFromToken(token)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const db = await getDb()
    const _id = new ObjectId(params.id)
    const result = await db.collection('collections').deleteOne({ _id, userId: user._id })
    if (result.deletedCount === 0) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Collection DELETE error', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}


