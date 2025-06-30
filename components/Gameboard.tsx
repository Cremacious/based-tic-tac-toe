'use client';

import useGameStore from '@/stores/useGameStore';

const GameBoard = () => {
  const { board, makeMove, currentPlayer, gameStatus, roomId } = useGameStore();
  console.log(currentPlayer);

  return (
    <div className="min-h-screen flex justify-center items-center">
      <p>Status : {gameStatus}</p>
      <p>Room Id: {roomId}</p>

      <div className="grid grid-cols-3">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => makeMove(index)}
            disabled={gameStatus !== 'playing'}
            className="w-32 h-32 border-2 text-5xl font-bold text-green-500"
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
