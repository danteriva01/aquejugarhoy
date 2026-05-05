import { verifySteamAuth, getSteamPlayerSummary } from '@/lib/auth/steam';
import { getUserBySteamId, saveUser, User } from '@/lib/data/db';
import { sessionOptions } from '@/lib/auth/session';
import { getIronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.url;
  
  try {
    const steamId = await verifySteamAuth(url) as string;
    const apiKey = process.env.STEAM_API_KEY;

    if (!apiKey) {
      throw new Error('STEAM_API_KEY is not configured');
    }

    const player = await getSteamPlayerSummary(steamId, apiKey);
    
    // Get or create user in our DB
    let user = await getUserBySteamId(steamId);
    
    if (!user) {
      user = {
        steamId,
        name: player.personaname,
        avatar: player.avatarfull,
        favoritos: [],
        historial: [],
        juegosSteam: [],
        lastSync: null,
        perfil: { tipo: null },
        preferences: {},
      };
    } else {
      // Ensure new fields exist for legacy users
      if (!user.favoritos) user.favoritos = [];
      if (!user.historial) user.historial = [];
      if (!user.perfil) user.perfil = { tipo: null };
      
      // Update name/avatar if changed
      user.name = player.personaname;
      user.avatar = player.avatarfull;
    }
    
    await saveUser(user);

    // Optional: Trigger initial sync if never synced
    if (!user.lastSync) {
      try {
        const syncUrl = `${new URL(request.url).origin}/api/steam/games`;
        // We can't await this if it takes too long, but we'll try a quick fetch
        // Or better, just let the client handle it on the first profile visit
      } catch (e) {}
    }

    // Create session
    const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
    session.user = {
      steamId: user.steamId,
      name: user.name,
      avatar: user.avatar,
      isLoggedIn: true
    };
    await session.save();

    // Redirect to home or explorer
    return NextResponse.redirect(new URL('/', request.url));
  } catch (error) {
    console.error('Steam Auth Error:', error);
    return NextResponse.redirect(new URL('/?error=auth_failed', request.url));
  }
}
