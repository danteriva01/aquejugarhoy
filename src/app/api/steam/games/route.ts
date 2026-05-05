import { sessionOptions } from '@/lib/auth/session';
import { getIronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getUserBySteamId, saveUser } from '@/lib/data/db';

export async function GET() {
  const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
  if (!session.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const steamId = session.user.steamId;
  const apiKey = process.env.STEAM_API_KEY;

  if (!apiKey) return NextResponse.json({ error: 'Steam API Key not configured' }, { status: 500 });

  try {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
    
    const res = await fetch(url);
    const data = await res.json();

    if (!data.response || !data.response.games) {
      // Might be a private profile
      return NextResponse.json({ 
        games: [], 
        isPrivate: true,
        message: 'No se pudieron obtener juegos. Asegurate de que tu perfil sea público.' 
      });
    }

    const games = data.response.games.map((g: any) => ({
      appid: g.appid,
      name: g.name,
      playtime_forever: g.playtime_forever,
      img_icon_url: g.img_icon_url
    }));

    // Update DB
    const user = await getUserBySteamId(steamId);
    if (user) {
      user.juegosSteam = games;
      user.lastSync = Date.now();
      await saveUser(user);
    }

    return NextResponse.json({ games, isPrivate: false });
  } catch (error) {
    console.error('Error fetching Steam games:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
