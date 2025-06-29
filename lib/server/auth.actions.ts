'use server';

import { z } from 'zod';
import { signUpFormSchema } from '@/lib/validators/auth.validator';
import { createClient } from '../supabase/server';
import { prisma } from '../prisma';

async function createPrismaUser(userData: {
  email: string;
  username: string;
  supabaseId: string;
}) {
  return await prisma.user.create({
    data: {
      email: userData.email,
      username: userData.username,
      score: {
        create: {
          wins: 0,
          losses: 0,
          draws: 0,
        },
      },
    },
    include: {
      score: true,
    },
  });
}

export async function signUpNewUser(values: z.infer<typeof signUpFormSchema>) {
  try {
    const user = signUpFormSchema.parse(values);
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: user.password,
      options: {
        data: {
          username: user.username,
        },
      },
    });

    if (error) {
      console.error('Error signing up:', error);
      return { success: false, error: error.message };
    }
    if (data.user) {
      try {
        await createPrismaUser({
          email: data.user.email!,
          username: user.username,
          supabaseId: data.user.id,
        });
        console.log('User created in Prisma database');
      } catch (prismaError) {
        console.error('Error creating user in Prisma:', prismaError);
      }
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.log('Error parsing form data:', error);
    return { success: false, error: 'Invalid form data' };
  }
}

export async function getSupabaseUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error('Error fetching current user:', error);
    return null;
  }

  return user;
}

export async function getCurrentUser() {
  try {
    const supabaseUser = await getSupabaseUser();
    if (!supabaseUser) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        email: supabaseUser.email!,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function getCurrentUserWithScore() {
  try {
    // Get the current user from Supabase
    const supabaseUser = await getSupabaseUser();

    if (!supabaseUser) {
      return null;
    }

    // Try to get the user from Prisma database with their score
    let userWithScore = await prisma.user.findUnique({
      where: {
        email: supabaseUser.email!,
      },
      include: {
        score: true,
      },
    });

    // If user doesn't exist in Prisma, create them
    if (!userWithScore) {
      console.log('User not found in Prisma, creating...');
      userWithScore = await createPrismaUser({
        email: supabaseUser.email!,
        username:
          supabaseUser.user_metadata?.username ||
          supabaseUser.email!.split('@')[0],
        supabaseId: supabaseUser.id,
      });
    }

    return userWithScore;
  } catch (error) {
    console.error('Error fetching user with score:', error);
    return null;
  }
}

export async function updateUserScore(
  wins: number,
  losses: number,
  draws: number
) {
  try {
    const supabaseUser = await getSupabaseUser();

    if (!supabaseUser) {
      throw new Error('User not authenticated');
    }

    // Find the user in Prisma
    const user = await prisma.user.findUnique({
      where: {
        email: supabaseUser.email!,
      },
    });

    if (!user) {
      throw new Error('User not found in database');
    }

    // Update the user's score
    const updatedScore = await prisma.score.upsert({
      where: {
        userId: user.id,
      },
      update: {
        wins,
        losses,
        draws,
      },
      create: {
        userId: user.id,
        wins,
        losses,
        draws,
      },
    });

    return { success: true, score: updatedScore };
  } catch (error) {
    console.error('Error updating user score:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
