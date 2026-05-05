import { getSteamAuthUrl } from '@/lib/auth/steam';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Priority: Environment Variable -> Header -> Fallback
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
    || (request.headers.get('x-forwarded-proto') && request.headers.get('host') 
        ? `${request.headers.get('x-forwarded-proto')}://${request.headers.get('host')}` 
        : null)
    || (request.headers.get('host') ? `http://${request.headers.get('host')}` : 'http://localhost:3000');
  
  const returnTo = `${baseUrl}/auth/steam/return`;
  const realm = baseUrl;

  const authUrl = getSteamAuthUrl(returnTo, realm);
  
  return NextResponse.redirect(authUrl);
}
