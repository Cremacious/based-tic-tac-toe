import { Button } from '@/components/ui/button';
import Link from 'next/link';

const StatsPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Game Statistics</h1>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Games Played</p>
            <p className="text-2xl font-bold text-gray-800">0</p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-xs text-blue-600">X Wins</p>
              <p className="text-lg font-bold text-blue-800">0</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <p className="text-xs text-red-600">O Wins</p>
              <p className="text-lg font-bold text-red-800">0</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-xs text-gray-600">Draws</p>
              <p className="text-lg font-bold text-gray-800">0</p>
            </div>
          </div>
        </div>

        <Button asChild variant="outline" className="w-full">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

export default StatsPage;
