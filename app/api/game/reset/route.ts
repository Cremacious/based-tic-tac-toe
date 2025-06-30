import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { roomId, playerId } = await request.json();

    const game = await prisma.game.findUnique({
      where: { roomId },
    });

    if (!game) {
      return NextResponse.json({ error: 'Game not found' }, { status: 404 });
    }

    // Check if the player is part of this game
    if (game.playerXId !== playerId && game.playerOId !== playerId) {
      return NextResponse.json(
        { error: 'Not authorized to reset this game' },
        { status: 403 }
      );
    }

    // Random starting player for the new game
    const randomStart = Math.random() < 0.5;

    const updatedGame = await prisma.game.update({
      where: { roomId },
      data: {
        board: '000000000', // Reset board
        currentTurn: randomStart ? 'X' : 'O',
        status: 'playing',
        winner: null,
        result: null,
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.error('Error resetting game:', error);
    return NextResponse.json(
      { error: 'Failed to reset game' },
      { status: 500 }
    );
  }
}
