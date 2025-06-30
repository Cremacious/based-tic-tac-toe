import { getCurrentUser } from '@/lib/server/auth.actions';
import Link from 'next/link';
import SignOutButton from '@/components/SignOutButton';

const DashboardPage = async () => {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="text-red-500">You must be signed in to view this page.</p>
      </div>
    );
  }
  return (
    <>
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p className="text-gray-600">Welcome to your dashboard!</p>
        <p className="text-gray-600">
          This page will display your game statistics and other relevant
          information. <Link href="/dashboard">Dashboard</Link>
        </p>
        {user.email}
      </div>
      <Link href="/game">Game</Link>
      <div className="mt-4">
        <SignOutButton />
      </div>
    </>
  );
};

export default DashboardPage;
