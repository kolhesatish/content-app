import { ObjectId } from 'mongodb'
import clientPromise from './mongodb.js'
import { verifyToken } from './auth.js'

export async function getDb() {
  const client = await clientPromise
  return client.db('contentcraft')
}

export async function getAuthedUser(request) {
  const authHeader = request.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return null

  const decoded = verifyToken(token)
  if (!decoded?.userId) return null

  let userId
  try {
    userId = new ObjectId(decoded.userId)
  } catch {
    return null
  }

  const db = await getDb()
  const user = await db.collection('users').findOne({ _id: userId })
  return user
}

export function toObjectId(id) {
  try {
    return new ObjectId(id)
  } catch {
    return null
  }
}


