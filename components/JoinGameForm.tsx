'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function JoinGameForm() {
  const [roomId, setRoomId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleJoinGame = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/game/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId: roomId.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join game');
      }

      toast.success('Joined game successfully!');
      router.push(`/game?roomId=${roomId.trim()}`);
    } catch (error) {
      console.error('Error joining game:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to join game'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleJoinGame} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="roomId">Room ID</Label>
        <Input
          id="roomId"
          type="text"
          placeholder="Enter room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          disabled={isLoading}
          className="w-full"
        />
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !roomId.trim()}
      >
        {isLoading ? 'Joining...' : 'Join Game'}
      </Button>
    </form>
  );
}
