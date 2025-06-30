'use client';
import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import useGameStore from '@/stores/useGameStore';
import { useRouter } from 'next/navigation';

const JoinGameButton = () => {
  const [roomId, setRoomIdInput] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const router = useRouter();
  const { joinRoom, setRoomId, setPlayerId } = useGameStore();

  const handleJoinGame = async () => {
    if (!roomId.trim()) return;

    setIsJoining(true);
    const playerId = 'user-' + Math.random().toString(36).substr(2, 9);

    const success = await joinRoom(roomId.toUpperCase(), playerId);

    if (success) {
      setRoomId(roomId.toUpperCase());
      setPlayerId(playerId);
      router.push('/game');
    } else {
      alert('Failed to join game. Room may not exist or be full.');
    }

    setIsJoining(false);
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomIdInput(e.target.value.toUpperCase())}
        className="text-center"
        maxLength={5}
      />
      <Button
        onClick={handleJoinGame}
        disabled={isJoining || !roomId.trim()}
        className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold w-48 hover:bg-green-700 transition-colors"
      >
        {isJoining ? 'Joining...' : 'Join Game'}
      </Button>
    </div>
  );
};

export default JoinGameButton;
