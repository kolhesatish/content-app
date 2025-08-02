import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import clientPromise from './mongodb.js';

const JWT_SECRET = process.env.JWT_SECRET;

export async function hashPassword(password) {
  return await bcrypt.hash(password, 12);
}

export async function verifyPassword(password, hashedPassword) {
  return await bcrypt.compare(password, hashedPassword);
}

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getUserFromToken(token) {
  if (!token) return null;
  
  const decoded = verifyToken(token);
  if (!decoded) return null;

  const client = await clientPromise;
  const db = client.db('contentcraft');
  const user = await db.collection('users').findOne({ _id: decoded.userId });
  
  return user;
}

export async function updateUserCredits(userId) {
  const client = await clientPromise;
  const db = client.db('contentcraft');
  
  const now = new Date();
  const user = await db.collection('users').findOne({ _id: userId });
  
  if (!user) return null;

  // Check if it's a new day since last credit update
  const lastCreditDate = user.lastCreditDate ? new Date(user.lastCreditDate) : new Date(0);
  const isNewDay = now.toDateString() !== lastCreditDate.toDateString();

  let newCredits = user.credits || 0;
  
  if (isNewDay) {
    // Add 2 daily credits (max 5 total)
    newCredits = Math.min(newCredits + 2, 5);
    
    await db.collection('users').updateOne(
      { _id: userId },
      { 
        $set: { 
          credits: newCredits, 
          lastCreditDate: now 
        } 
      }
    );
  }

  return newCredits;
}

export async function useCredit(userId) {
  const client = await clientPromise;
  const db = client.db('contentcraft');
  
  // First update daily credits
  await updateUserCredits(userId);
  
  const user = await db.collection('users').findOne({ _id: userId });
  
  if (!user || user.credits <= 0) {
    return false;
  }

  await db.collection('users').updateOne(
    { _id: userId },
    { $inc: { credits: -1 } }
  );

  return true;
}