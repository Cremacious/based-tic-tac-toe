'use client';

import { Suspense } from 'react';
import GameBoard from '@/components/Gameboard';
import GameControls from '@/components/GameControls';
import GamePageContent from '@/components/GamePageContent';

const GamePage = () => {
  return (
    <Suspense fallback={<div>Loading game...</div>}>
      <GamePageContent />
      <GameBoard />
      <GameControls />
    </Suspense>
  );
};

export default GamePage;
