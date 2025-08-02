import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { hashPassword, signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db('contentcraft');

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username already exists' },
        { status: 400 }
      );
    }

    // Hash password and create user
    const hashedPassword = await hashPassword(password);
    const now = new Date();
    
    const result = await db.collection('users').insertOne({
      username,
      password: hashedPassword,
      credits: 5, // New users get 5 credits
      lastCreditDate: now,
      createdAt: now,
    });

    // Generate JWT token
    const token = signToken({ userId: result.insertedId });

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: result.insertedId,
        username,
        credits: 5,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}