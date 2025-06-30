// import { getCurrentUser } from '@/lib/server/auth.actions';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import NewGameButton from '@/components/NewGameButton';

const DashboardPage = () => {
  // const user = await getCurrentUser();
  // if (!user) {
  //   return (
  //     <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
  //       <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
  //       <p className="text-red-500">You must be signed in to view this page.</p>
  //     </div>
  //   );
  // }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-green-500 p-8 rounded-xl shadow-lg w-80 h-96 flex flex-col justify-center items-center space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Tic Tac Toe</h2>
        <NewGameButton />
        <Button
          asChild
          className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold w-48 hover:bg-green-700 transition-colors"
        >
          <Link href="/game">Join Game</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          className=" text-slate-800 px-6 py-3 rounded-lg font-semibold w-48"
        >
          <Link href="/stats">View Stats</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
