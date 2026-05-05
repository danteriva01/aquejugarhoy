import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import { getRoomByCode, saveRoom, Participant } from '@/lib/data/db';

export async function POST(req: Request) {
  try {
    const { code } = await req.json();
    if (!code) {
      return NextResponse.json({ error: 'Código requerido' }, { status: 400 });
    }

    const session = await getIronSession<any>(await cookies(), sessionOptions);
    if (!session.user) {
      return NextResponse.json({ error: 'Debes iniciar sesión' }, { status: 401 });
    }

    const room = await getRoomByCode(code.toUpperCase());
    if (!room) {
      return NextResponse.json({ error: 'Sala no encontrada' }, { status: 404 });
    }

    if (room.status !== 'lobby') {
      return NextResponse.json({ error: 'La partida ya ha comenzado' }, { status: 400 });
    }

    // Check if user is already in room
    const isAlreadyIn = room.participants.some(p => p.steamId === session.user.steamId);
    if (!isAlreadyIn) {
      const newParticipant: Participant = {
        steamId: session.user.steamId,
        name: session.user.name,
        avatar: session.user.avatar,
        hasVoted: false
      };
      room.participants.push(newParticipant);
      await saveRoom(room);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error joining room:', error);
    return NextResponse.json({ error: 'Error al unirse a la sala' }, { status: 500 });
  }
}
