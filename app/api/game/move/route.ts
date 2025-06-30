import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { roomId, playerId, position } = await request.json();

    const game = await prisma.game.findUnique({
      where: { roomId },
    });

    if (!game || game.status !== 'playing') {
      return NextResponse.json(
        { error: 'Invalid game state' },
        { status: 400 }
      );
    }

    // Verify it's the player's turn
    const isPlayerX = game.playerXId === playerId;
    const currentPlayerSymbol = isPlayerX ? 'X' : 'O';

    if (game.currentTurn !== currentPlayerSymbol) {
      return NextResponse.json({ error: 'Not your turn' }, { status: 400 });
    }

    // Update board
    const boardArray = game.board.split('');
    if (boardArray[position] !== '0') {
      return NextResponse.json(
        { error: 'Position already taken' },
        { status: 400 }
      );
    }

    boardArray[position] = currentPlayerSymbol;
    const newBoard = boardArray.join('');

    // Check for winner
    const winner = checkWinner(boardArray);
    const isDraw = boardArray.every((cell) => cell !== '0') && !winner;

    const updatedGame = await prisma.game.update({
      where: { roomId },
      data: {
        board: newBoard,
        currentTurn: currentPlayerSymbol === 'X' ? 'O' : 'X',
        status: winner || isDraw ? 'finished' : 'playing',
        winner: winner,
        result: winner ? 'win' : isDraw ? 'draw' : null,
      },
    });

    // Update scores if game is finished
    // TODO: Implement proper user authentication and score tracking
    // if (winner || isDraw) {
    //   await updatePlayerScores(game.playerXId!, game.playerOId!, winner);
    // }

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.log('Error making move:', error);
    return NextResponse.json({ error: 'Failed to make move' }, { status: 500 });
  }
}

function checkWinner(board: string[]): string | null {
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
    if (board[a] !== '0' && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

// TODO: Implement proper user authentication and score tracking
/*
async function updatePlayerScores(
  playerXId: string,
  playerOId: string,
  winner: string | null
) {
  if (winner === 'X') {
    await prisma.score.upsert({
      where: { userId: playerXId },
      update: { wins: { increment: 1 } },
      create: { userId: playerXId, wins: 1, losses: 0, draws: 0 },
    });
    await prisma.score.upsert({
      where: { userId: playerOId },
      update: { losses: { increment: 1 } },
      create: { userId: playerOId, wins: 0, losses: 1, draws: 0 },
    });
  } else if (winner === 'O') {
    await prisma.score.upsert({
      where: { userId: playerOId },
      update: { wins: { increment: 1 } },
      create: { userId: playerOId, wins: 1, losses: 0, draws: 0 },
    });
    await prisma.score.upsert({
      where: { userId: playerXId },
      update: { losses: { increment: 1 } },
      create: { userId: playerXId, wins: 0, losses: 1, draws: 0 },
    });
  } else {
    // Draw
    await prisma.score.upsert({
      where: { userId: playerXId },
      update: { draws: { increment: 1 } },
      create: { userId: playerXId, wins: 0, losses: 0, draws: 1 },
    });
    await prisma.score.upsert({
      where: { userId: playerOId },
      update: { draws: { increment: 1 } },
      create: { userId: playerOId, wins: 0, losses: 0, draws: 1 },
    });
  }
}
*/
