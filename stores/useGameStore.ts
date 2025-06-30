import { create } from 'zustand';

type Player = 'X' | 'O';
type Cell = Player | null;
type GameStatus = 'waiting' | 'playing' | 'finished';
type GameResult = 'win' | 'draw' | null;

interface GameState {
  // Game board (3x3 grid)
  board: Cell[];

  // Game state
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  gameResult: GameResult;

  // Game stats
  scores: {
    X: number;
    O: number;
    draws: number;
  };

  // Multiplayer state

  playerId: string | null;
  opponentId: string | null;
  roomId: string | null;

  // Actions
  makeMove: (index: number) => void;
  resetGame: () => void;
  newGame: () => void;
  joinRoom: (roomId: string, playerId: string) => void;
  leaveRoom: () => void;
}

const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  board: Array(9).fill(null),
  currentPlayer: 'X',
  gameStatus: 'waiting',
  winner: null,
  gameResult: null,
  scores: { X: 0, O: 0, draws: 0 },
  isMultiplayer: false,
  playerId: null,
  opponentId: null,
  roomId: null,

  // Actions
  makeMove: (index: number) => {
    const state = get();

    // Validate move
    if (state.board[index] || state.gameStatus !== 'playing') return;

    const newBoard = [...state.board];
    newBoard[index] = state.currentPlayer;

    // Check for winner
    const winner = checkWinner(newBoard);
    const isDraw = newBoard.every((cell) => cell !== null) && !winner;

    set({
      board: newBoard,
      currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
      winner,
      gameResult: winner ? 'win' : isDraw ? 'draw' : null,
      gameStatus: winner || isDraw ? 'finished' : 'playing',
      scores:
        winner || isDraw
          ? {
              ...state.scores,
              [winner || 'draws']: winner
                ? state.scores[winner] + 1
                : state.scores.draws + 1,
            }
          : state.scores,
    });
  },

  resetGame: () => {
    set({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameStatus: 'waiting',
      winner: null,
      gameResult: null,
    });
  },

  newGame: () => {
    set({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameStatus: 'playing',
      winner: null,
      gameResult: null,
    });
  },


  joinRoom: (roomId: string, playerId: string) => {
    set({
      roomId,
      playerId,
      gameStatus: 'waiting',
    });
  },

  leaveRoom: () => {
    set({
      roomId: null,
      playerId: null,
      opponentId: null,
      gameStatus: 'waiting',
    });
  },
}));

// Helper function to check winner
function checkWinner(board: Cell[]): Player | null {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], 
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], 
    [0, 4, 8],
    [2, 4, 6], 
  ];

  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

export default useGameStore;
