import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import { saveRoom, Participant, Room } from '@/lib/data/db';
import { nanoid } from 'nanoid';

export async function POST() {
  try {
    const session = await getIronSession<any>(await cookies(), sessionOptions);
    if (!session.user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    const code = nanoid(6).toUpperCase();
    
    const host: Participant = {
      steamId: session.user.steamId,
      name: session.user.name,
      avatar: session.user.avatar,
      hasVoted: false
    };

    const newRoom: Room = {
      code,
      hostId: session.user.steamId,
      status: 'lobby',
      type: null,
      round: 1,
      participants: [host],
      currentGames: [],
      votes: [],
      winner: null,
      lastUpdate: Date.now()
    };

    await saveRoom(newRoom);
    return NextResponse.json({ code });
  } catch (error) {
    console.error('Error creating room:', error);
    return NextResponse.json({ error: 'Error al crear la sala' }, { status: 500 });
  }
}
