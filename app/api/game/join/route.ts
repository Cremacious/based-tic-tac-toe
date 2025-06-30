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

    if (game.playerOId) {
      return NextResponse.json({ error: 'Game is full' }, { status: 400 });
    }

    const randomStart = Math.random() < 0.5;

    const updatedGame = await prisma.game.update({
      where: { roomId },
      data: {
        playerOId: playerId,
        status: 'playing',
        currentTurn: randomStart ? 'X' : 'O',
      },
    });

    return NextResponse.json(updatedGame);
  } catch (error) {
    console.log('Error joining game:', error);
    return NextResponse.json({ error: 'Failed to join game' }, { status: 500 });
  }
}
