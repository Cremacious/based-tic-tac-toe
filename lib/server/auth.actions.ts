'use server';

import { z } from 'zod';
import {
  signUpFormSchema,
  loginFormSchema,
} from '@/lib/validators/auth.validator';
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

export async function logInWithEmailAndPassword(
  values: z.infer<typeof loginFormSchema>
) {
  try {
    const user = loginFormSchema.parse(values);
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: user.password,
    });

    if (error) {
      console.error('Error logging in:', error);
      return { success: false, error: error.message };
    }

    if (data.user) {
      const prismaUser = await prisma.user.findUnique({
        where: { email: data.user.email! },
      });

      if (!prismaUser) {
        console.error('User not found in Prisma database');
        return { success: false, error: 'User not found' };
      }

      return { success: true, user: prismaUser };
    }

    return { success: false, error: 'No user data returned' };
  } catch (error) {
    console.error('Error parsing form data:', error);
    return { success: false, error: 'Invalid form data' };
  }
}

export async function logOutUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Error logging out:', error);
        return { success: false, error: error.message };
    }
    return { success: true };
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
