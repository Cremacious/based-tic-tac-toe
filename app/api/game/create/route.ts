import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { roomId, playerId } = await request.json();
    console.log('Received data:', { roomId, playerId });

    console.log('Attempting to create game...');
    const game = await prisma.game.create({
      data: {
        roomId,
        playerXId: playerId,
        status: 'waiting',
      },
    });
    console.log('Game created successfully:', game);

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error creating game:', error);
    console.error(
      'Error details:',
      error instanceof Error ? error.message : 'Unknown error'
    );
    console.error(
      'Stack trace:',
      error instanceof Error ? error.stack : 'No stack trace'
    );
    return NextResponse.json(
      {
        error: 'Failed to create game',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
