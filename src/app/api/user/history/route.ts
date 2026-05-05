import { sessionOptions, UserSession } from '@/lib/auth/session';
import { getIronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { getUserBySteamId, saveUser } from '@/lib/data/db';

export async function POST(request: NextRequest) {
  const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
  
  if (!session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { gameId, accion } = await request.json();
  if (!gameId || !accion) return NextResponse.json({ error: 'Missing data' }, { status: 400 });

  const user = await getUserBySteamId(session.user.steamId);
  if (user) {
    // Add new entry
    user.historial.push({
      juego: gameId,
      accion: accion as "visto" | "click",
      timestamp: Date.now()
    });

    // Limit history size to avoid massive files (keep last 200 entries)
    if (user.historial.length > 200) {
      user.historial = user.historial.slice(-200);
    }

    await saveUser(user);
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: 'User not found' }, { status: 404 });
}
