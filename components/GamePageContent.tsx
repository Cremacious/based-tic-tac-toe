'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useGameStore from '@/stores/useGameStore';

const GamePageContent = () => {
  const searchParams = useSearchParams();
  const { setRoomId, roomId, pollGameState } = useGameStore();

  useEffect(() => {
    const roomIdFromUrl = searchParams.get('roomId');
    if (roomIdFromUrl && roomIdFromUrl !== roomId) {
      setRoomId(roomIdFromUrl);
      // Immediately poll for game state when room ID is set
      pollGameState();
    }
  }, [searchParams, setRoomId, roomId, pollGameState]);

  return null; // This component doesn't render anything
};

export default GamePageContent;
