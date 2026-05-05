import { sessionOptions } from '@/lib/auth/session';
import { getIronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
  
  if (session.user) {
    return NextResponse.json(session.user);
  }
  
  return NextResponse.json({ isLoggedIn: false }, { status: 401 });
}

export async function DELETE() {
  const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
  session.destroy();
  return NextResponse.json({ ok: true });
}
