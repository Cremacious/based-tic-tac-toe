'use client';
import useGameStore from '@/stores/useGameStore';
import { Button } from './ui/button';

const GameControls = () => {
  const { newGame, resetGame, scores, winner, gameResult } = useGameStore();

  return (
    <div>
      <div>
        Scores: X: {scores.X} | O: {scores.O} | Draws: {scores.draws}
      </div>
      {gameResult && (
        <div>Game Over! {winner ? `${winner} wins!` : 'Draw!'}</div>
      )}
      <Button onClick={newGame}>New Game</Button>
      <Button onClick={resetGame}>Reset</Button>
    </div>
  );
};

export default GameControls;
