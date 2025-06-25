





///   THIS API is not used in the app, but it is kept for reference if needed in the future.





import { NextResponse } from 'next/server';
import { signInUser } from '@/lib/firebase/auth';
import { getUserProfile } from '@/lib/firebase/db';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Use your existing Firebase auth logic
    const { user: firebaseUser, role } = await signInUser(email, password);
    const userProfile = await getUserProfile(firebaseUser.uid);

    if (!userProfile) {
      return NextResponse.json(
        { error: 'User profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: userProfile,
      message: 'Sign in successful'
    });

  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: error.message || 'Sign in failed' },
      { status: 401 }
    );
  }
}