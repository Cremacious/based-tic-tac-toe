'use client';
import { useEffect } from 'react';
import useGameStore from '@/stores/useGameStore';

const GameBoard = () => {
  const {
    board,
    makeMove,
    currentPlayer,
    gameStatus,
    roomId,
    playerSymbol,
    isMyTurn,
    pollGameState,
  } = useGameStore();

  // Poll for game state updates every 2 seconds
  useEffect(() => {
    if (roomId && gameStatus !== 'finished') {
      const interval = setInterval(pollGameState, 2000);
      return () => clearInterval(interval);
    }
  }, [roomId, gameStatus, pollGameState]);

  const getStatusMessage = () => {
    if (gameStatus === 'waiting') {
      return playerSymbol === 'X'
        ? 'Waiting for opponent to join...'
        : 'Joined game! Waiting to start...';
    }
    if (gameStatus === 'playing') {
      return isMyTurn ? 'Your turn!' : `Opponent's turn (${currentPlayer})`;
    }
    if (gameStatus === 'finished') {
      return 'Game finished!';
    }
    return '';
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center space-y-4">
      <div className="text-center space-y-2">
        <p className="text-lg font-semibold">{getStatusMessage()}</p>
        <p className="text-sm text-gray-600">Room ID: {roomId}</p>
        {playerSymbol && (
          <p className="text-sm text-gray-600">You are: {playerSymbol}</p>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        {board.map((cell, index) => (
          <button
            key={index}
            onClick={() => makeMove(index)}
            disabled={!isMyTurn || gameStatus !== 'playing' || cell !== null}
            className={`w-24 h-24 border-2 text-4xl font-bold rounded-lg transition-colors
              ${
                isMyTurn && !cell && gameStatus === 'playing'
                  ? 'border-green-500 hover:bg-green-50 cursor-pointer'
                  : 'border-gray-300 cursor-not-allowed'
              }
              ${
                cell === 'X'
                  ? 'text-blue-600'
                  : cell === 'O'
                  ? 'text-red-600'
                  : ''
              }
            `}
          >
            {cell}
          </button>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
