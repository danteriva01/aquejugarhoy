import { getSteamAuthUrl } from '@/lib/auth/steam';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'localhost:3000';
  const proto = request.headers.get('x-forwarded-proto') || 'http';
  
  // Use env var if available, otherwise reconstruct from headers
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`;
  
  const returnTo = `${baseUrl}/auth/steam/return`;
  const realm = baseUrl;

  const authUrl = getSteamAuthUrl(returnTo, realm);
  
  return NextResponse.redirect(authUrl);
}
