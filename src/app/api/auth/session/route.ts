import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';

export async function GET() {
  const session = await getIronSession<any>(await cookies(), sessionOptions);
  return NextResponse.json({ user: session.user || null });
}
