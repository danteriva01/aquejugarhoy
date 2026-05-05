import { NextResponse } from 'next/server';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { sessionOptions } from '@/lib/auth/session';
import { getRoomByCode, saveRoom, Participant, GameVote } from '@/lib/data/db';
import { getGames } from '@/lib/api/rawg';
import { enrichGamesWithSteamData } from '@/lib/api/steam';
import curatedGamesData from '@/lib/data/curated_games.json';
import { Game } from '@/lib/api/types';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const room = await getRoomByCode(code);
  if (!room) {
    return NextResponse.json({ error: 'Sala no encontrada' }, { status: 404 });
  }
  return NextResponse.json(room);
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;
  const body = await req.json();
  const { action, payload } = body;

  const session = await getIronSession<any>(await cookies(), sessionOptions);
  if (!session.user) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const room = await getRoomByCode(code);
  if (!room) {
    return NextResponse.json({ error: 'Sala no encontrada' }, { status: 404 });
  }

  const userId = session.user.steamId;

  switch (action) {
    case 'START_VOTING':
      if (room.hostId !== userId) return NextResponse.json({ error: 'Solo el host puede iniciar' }, { status: 403 });
      room.status = 'selecting_type';
      break;

    case 'SELECT_TYPE':
      if (room.hostId !== userId) return NextResponse.json({ error: 'Solo el host puede elegir el tipo' }, { status: 403 });
      room.type = payload.type;
      room.status = 'voting';
      room.round = 1;
      
      // Load initial 6 games based on type
      const allCurated = curatedGamesData as unknown as Game[];
      const filtered = allCurated.filter(g => {
        const cat = (g as any)._curatedContext?.categoria_web || [];
        if (room.type === 'cooperativo') return cat.includes('coop_divertido') || cat.includes('pareja');
        if (room.type === 'competitivo') return cat.includes('matchmaking');
        if (room.type === 'party') return cat.includes('party');
        return true;
      });
      
      // Randomize and pick 6
      room.currentGames = filtered.sort(() => 0.5 - Math.random()).slice(0, 6);
      room.votes = room.currentGames.map(g => ({ gameId: g.slug, positives: [], negatives: [] }));
      room.participants.forEach(p => p.hasVoted = false);
      break;

    case 'VOTE':
      const { votes } = payload; // { gameId: string, value: 'up' | 'down' }[]
      
      votes.forEach((v: { gameId: string, value: 'up' | 'down' }) => {
        const gameVote = room.votes.find(gv => gv.gameId === v.gameId);
        if (gameVote) {
          if (v.value === 'up') {
            if (!gameVote.positives.includes(userId)) gameVote.positives.push(userId);
            gameVote.negatives = gameVote.negatives.filter(id => id !== userId);
          } else {
            if (!gameVote.negatives.includes(userId)) gameVote.negatives.push(userId);
            gameVote.positives = gameVote.positives.filter(id => id !== userId);
          }
        }
      });

      const participant = room.participants.find(p => p.steamId === userId);
      if (participant) participant.hasVoted = true;

      // Check if everyone voted
      const everyoneVoted = room.participants.every(p => p.hasVoted);
      if (everyoneVoted) {
        // Process round results
        const results = room.votes.map(gv => {
          const game = room.currentGames.find(g => g.slug === gv.gameId);
          return {
            game,
            score: gv.positives.length - gv.negatives.length,
            isNegativeMajority: gv.negatives.length > gv.positives.length
          };
        });

        // Eliminate majority negatives
        let remaining = results.filter(r => !r.isNegativeMajority).map(r => r.game);
        
        // If everything was negative, keep the top 2
        if (remaining.length === 0) {
          remaining = results.sort((a, b) => b.score - a.score).slice(0, 2).map(r => r.game);
        }

        if (remaining.length <= 1) {
          room.winner = remaining[0] || results.sort((a, b) => b.score - a.score)[0].game;
          room.status = 'finished';
        } else if (remaining.length <= 3) {
          room.currentGames = remaining;
          room.votes = room.currentGames.map(g => ({ gameId: g.slug, positives: [], negatives: [] }));
          room.participants.forEach(p => p.hasVoted = false);
          room.round++;
        } else {
          // Still too many, pick top 3 for next round
          room.currentGames = results.sort((a, b) => b.score - a.score).slice(0, 3).map(r => r.game);
          room.votes = room.currentGames.map(g => ({ gameId: g.slug, positives: [], negatives: [] }));
          room.participants.forEach(p => p.hasVoted = false);
          room.round++;
        }
      }
      break;

    case 'RESTART':
       if (room.hostId !== userId) return NextResponse.json({ error: 'Solo el host puede reiniciar' }, { status: 403 });
       room.status = 'lobby';
       room.round = 1;
       room.currentGames = [];
       room.votes = [];
       room.winner = null;
       room.participants.forEach(p => p.hasVoted = false);
       break;
  }

  await saveRoom(room);
  return NextResponse.json(room);
}
