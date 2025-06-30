'use client';
import { useState } from 'react';

const GameBoard = () => {
  const [clickedSquares, setClickedSquares] = useState<Set<number>>(new Set());

  const handleClickedSquare = (index: number) => {
    setClickedSquares((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };
  const renderSquare = (index: number) => {
    const isClicked = clickedSquares.has(index);

    return (
      <button
        key={index}
        onClick={() => handleClickedSquare(index)}
        className={`
          w-24 h-24 border-2 border-gray-400 
          flex items-center justify-center 
          text-2xl font-bold
          transition-colors duration-200
          hover:bg-gray-100 dark:hover:bg-gray-800
          ${isClicked ? 'bg-red-500 text-white' : 'bg-white dark:bg-gray-900'}
        `}
      >
        X or O
      </button>
    );
  };

  return (
    <>
      <div></div>{' '}
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-8 text-center">Tic Tac Toe</h1>

        <div className="grid grid-cols-3 gap-1 bg-gray-600 p-2 rounded-lg shadow-lg">
          {Array.from({ length: 9 }, (_, index) => renderSquare(index))}
        </div>

        <button
          onClick={() => setClickedSquares(new Set())}
          className="mt-8 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Reset Board
        </button>
      </div>
    </>
  );
};

export default GameBoard;
