import { getSteamAuthUrl } from '@/lib/auth/steam';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  
  const returnTo = `${baseUrl}/auth/steam/return`;
  const realm = baseUrl;

  const authUrl = getSteamAuthUrl(returnTo, realm);
  
  return NextResponse.redirect(authUrl);
}
