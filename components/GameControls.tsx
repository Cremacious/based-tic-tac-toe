'use client';
import useGameStore from '@/stores/useGameStore';
import { Button } from './ui/button';

const GameControls = () => {
  const { newGame, resetGame, scores, winner, gameResult, gameStatus, roomId } = useGameStore();

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg">
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Scores: X: {scores.X} | O: {scores.O} | Draws: {scores.draws}
        </p>
      </div>
      
      {gameResult && (
        <div className="text-center p-2 bg-blue-50 rounded">
          <p className="font-semibold text-blue-800">
            Game Over! {winner ? `${winner} wins!` : 'Draw!'}
          </p>
        </div>
      )}
      
      <div className="flex gap-2 justify-center">
        {roomId && gameStatus === 'finished' && (
          <Button 
            onClick={resetGame}
            variant="outline"
            className="px-4 py-2"
          >
            Reset Game
          </Button>
        )}
        <Button 
          onClick={newGame}
          className="px-4 py-2"
        >
          New Game
        </Button>
      </div>
    </div>
  );
};

export default GameControls;
