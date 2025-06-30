'use client';

import useGameStore from '@/stores/useGameStore';

const GameBoard = () => {
  const { board, makeMove, currentPlayer, gameStatus } = useGameStore();
  console.log(currentPlayer);

  return (
    <div className="grid grid-cols-3 gap-2">
      {board.map((cell, index) => (
        <button
          key={index}
          onClick={() => makeMove(index)}
          disabled={gameStatus !== 'playing'}
          className="w-16 h-16 border-2 text-2xl font-bold"
        >
          {cell}
        </button>
      ))}
    </div>
  );
};

export default GameBoard;
