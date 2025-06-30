import { Button } from '@/components/ui/button';
import NewGameButton from '@/components/NewGameButton';
import JoinGameForm from '@/components/JoinGameForm';
import Link from 'next/link';

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-green-500 p-8 rounded-xl shadow-lg w-96 min-h-96 flex flex-col justify-center items-center space-y-6">
        <h2 className="text-2xl font-bold text-white mb-4">Tic Tac Toe</h2>
        <NewGameButton />
        <JoinGameForm />
        <Button
          asChild
          variant="outline"
          className="text-slate-800 px-6 py-3 rounded-lg font-semibold w-48"
        >
          <Link href="/stats">View Stats</Link>
        </Button>
      </div>
    </div>
  );
};

export default DashboardPage;
