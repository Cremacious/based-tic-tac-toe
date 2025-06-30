import { create } from 'zustand';

type Player = 'X' | 'O';
type Cell = Player | null;
type GameStatus = 'waiting' | 'playing' | 'finished';
type GameResult = 'win' | 'draw' | null;

interface GameState {
  board: Cell[];
  currentPlayer: Player;
  gameStatus: GameStatus;
  winner: Player | null;
  gameResult: GameResult;
  scores: { X: number; O: number; draws: number };
  playerId: string | null;
  opponentId: string | null;
  roomId: string | null;
  playerSymbol: Player | null; // What symbol this player is (X or O)
  isMyTurn: boolean;

  // Actions
  setRoomId: (roomId: string) => void;
  clearRoomId: () => void;
  setPlayerId: (playerId: string) => void;
  makeMove: (index: number) => Promise<void>;
  resetGame: () => void;
  newGame: () => void;
  joinRoom: (roomId: string, playerId: string) => Promise<boolean>;
  leaveRoom: () => void;
  syncGameState: (gameData: any) => void;
  pollGameState: () => Promise<void>;
}

const useGameStore = create<GameState>((set, get) => ({
  board: Array(9).fill(null),
  currentPlayer: 'X',
  gameStatus: 'waiting',
  winner: null,
  gameResult: null,
  scores: { X: 0, O: 0, draws: 0 },
  playerId: null,
  opponentId: null,
  roomId: null,
  playerSymbol: null,
  isMyTurn: false,

  setRoomId: (roomId: string) => set({ roomId }),
  clearRoomId: () => set({ roomId: null }),
  setPlayerId: (playerId: string) => set({ playerId }),

  makeMove: async (index: number) => {
    const state = get();
    if (!state.isMyTurn || state.board[index] || state.gameStatus !== 'playing')
      return;

    try {
      const response = await fetch('/api/game/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: state.roomId,
          playerId: state.playerId,
          position: index,
        }),
      });

      if (response.ok) {
        const gameData = await response.json();
        get().syncGameState(gameData);
      }
    } catch (error) {
      console.error('Failed to make move:', error);
    }
  },

  joinRoom: async (roomId: string, playerId: string) => {
    try {
      const response = await fetch('/api/game/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomId, playerId }),
      });

      if (response.ok) {
        const gameData = await response.json();
        get().syncGameState(gameData);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to join room:', error);
      return false;
    }
  },

  syncGameState: (gameData: any) => {
    const state = get();
    const board = gameData.board
      .split('')
      .map((cell: string) => (cell === '0' ? null : (cell as Player)));

    const playerSymbol = gameData.playerXId === state.playerId ? 'X' : 'O';
    const isMyTurn =
      gameData.currentTurn === playerSymbol && gameData.status === 'playing';

    set({
      board,
      currentPlayer: gameData.currentTurn as Player,
      gameStatus: gameData.status as GameStatus,
      winner: gameData.winner as Player | null,
      gameResult: gameData.result as GameResult,
      playerSymbol,
      isMyTurn,
      opponentId:
        playerSymbol === 'X' ? gameData.playerOId : gameData.playerXId,
    });
  },

  pollGameState: async () => {
    const state = get();
    if (!state.roomId) return;

    try {
      const response = await fetch(`/api/game/${state.roomId}`);
      if (response.ok) {
        const gameData = await response.json();
        get().syncGameState(gameData);
      }
    } catch (error) {
      console.error('Failed to poll game state:', error);
    }
  },

  resetGame: () => {
    set({
      board: Array(9).fill(null),
      currentPlayer: 'X',
      gameStatus: 'playing',
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

  leaveRoom: () => {
    set({
      roomId: null,
      playerId: null,
      opponentId: null,
      gameStatus: 'waiting',
      playerSymbol: null,
      isMyTurn: false,
    });
  },
}));

export default useGameStore;
