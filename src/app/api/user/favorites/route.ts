import { sessionOptions } from '@/lib/auth/session';
import { getIronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserBySteamId, saveUser } from '@/lib/data/db';

export async function GET() {
  const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await getUserBySteamId(session.user.steamId);
  return NextResponse.json(user?.favoritos || []);
}

export async function POST(request: NextRequest) {
  const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { gameId } = await request.json();
  if (!gameId) return NextResponse.json({ error: 'Missing gameId' }, { status: 400 });

  const user = await getUserBySteamId(session.user.steamId);
  if (user) {
    const index = user.favoritos.indexOf(gameId);
    if (index === -1) {
      user.favoritos.push(gameId);
    } else {
      user.favoritos.splice(index, 1);
    }
    await saveUser(user);
    return NextResponse.json({ isFavorite: index === -1 });
  }

  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
