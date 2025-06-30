'use client';
import { Button } from './ui/button';
import useGameStore from '@/stores/useGameStore';
import { generateRoomId } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const NewGameButton = () => {
  const router = useRouter();
  const { setRoomId, setPlayerId } = useGameStore();

  const handleNewGame = async () => {
    const roomId = generateRoomId();
    const playerId = 'user-' + Math.random().toString(36).substr(2, 9); // Generate temp user ID

    try {
      const response = await fetch('/api/game/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, playerId }),
      });

      if (response.ok) {
        setRoomId(roomId);
        setPlayerId(playerId);
        router.push('/game');
      } else {
        const errorData = await response.json();
        console.error('API Error:', errorData);
      }
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  return (
    <Button
      className="bg-white text-slate-800 px-6 py-3 rounded-lg font-semibold w-48 hover:bg-gray-50 transition-colors"
      onClick={handleNewGame}
    >
      <span>New Game</span>
    </Button>
  );
};

export default NewGameButton;
