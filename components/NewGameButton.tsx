'use client';
import { Button } from './ui/button';
import useGameStore from '@/stores/useGameStore';
import { generateRoomId } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const NewGameButton = () => {
  const router = useRouter();
  const { setRoomId } = useGameStore();
  const handleNewGame = () => {
    setRoomId(generateRoomId());
    router.push('/game');
  };
  return (
    <>
      <Button
        className="bg-white text-slate-800 px-6 py-3 rounded-lg font-semibold w-48 hover:bg-gray-50 transition-colors"
        onClick={handleNewGame}
      >
        <span>New Game</span>
      </Button>
    </>
  );
};

export default NewGameButton;
