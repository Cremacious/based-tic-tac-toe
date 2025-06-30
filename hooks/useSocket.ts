import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import useGameStore from '@/stores/useGameStore';

export function useSocket() {
  const socketRef = useRef<Socket | null>(null);
  const { 
    setBoard, 
    setCurrentPlayer, 
    setGameStatus, 
    setWinner,
    setRoomId,
    playerId 
  } = useGameStore();

  useEffect(() => {
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001');
    
    const socket = socketRef.current;

    // Listen for game events
    socket.on('game-created', (data) => {
      setRoomId(data.roomId);
    });

    socket.on('game-start', (data) => {
      setGameStatus('playing');
      // Set player symbols based on position
      const isPlayer1 = data.game.player1Id === playerId;
      setCurrentPlayer(isPlayer1 ? 'X' : 'O');
    });

    socket.on('move-made', (data) => {
      setBoard(data.board);
      setCurrentPlayer(data.currentTurn === 'player1' ? 'X' : 'O');
      setGameStatus(data.gameStatus.toLowerCase());
      if (data.winner) {
        setWinner(data.winner === 'player1' ? 'X' : 'O');
      }
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [playerId]);

  const createGame = (userId: string) => {
    socketRef.current?.emit('create-game', userId);
  };

  const joinGame = (roomId: string, userId: string) => {
    socketRef.current?.emit('join-game', { roomId, userId });
  };

  const makeSocketMove = (gameId: string, userId: string, position: number) => {
    socketRef.current?.emit('make-move', { gameId, userId, position });
  };

  return { createGame, joinGame, makeSocketMove };
}