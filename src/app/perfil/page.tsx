import { sessionOptions } from '@/lib/auth/session';
import { getIronSession, IronSessionData } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getUserBySteamId } from '@/lib/data/db';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const session = await getIronSession<IronSessionData>(await cookies(), sessionOptions);
  
  if (!session.user) {
    redirect('/');
  }

  const user = await getUserBySteamId(session.user.steamId);

  return (
    <div className="pt-24 min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <ProfileClient initialUser={JSON.parse(JSON.stringify(user))} />
      </div>
    </div>
  );
}
