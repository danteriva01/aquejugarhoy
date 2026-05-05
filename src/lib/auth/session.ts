import { SessionOptions } from 'iron-session';

export interface UserSession {
  steamId: string;
  name: string;
  avatar: string;
  isLoggedIn: boolean;
}

export const sessionOptions: SessionOptions = {
  password: process.env.SESSION_PASSWORD || 'secret-password-must-be-32-chars-long-min',
  cookieName: 'steam_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

declare module 'iron-session' {
  interface IronSessionData {
    user?: UserSession;
  }
}
