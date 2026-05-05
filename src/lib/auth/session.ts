import { SessionOptions } from 'iron-session';

export interface UserSession {
  steamId: string;
  name: string;
  avatar: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD || 'complex_password_at_least_32_characters_long',
  cookieName: 'steam_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  },
};

declare module 'iron-session' {
  interface IronSessionData {
    user?: UserSession;
  }
}
