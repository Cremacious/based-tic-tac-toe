'use server';

import { z } from 'zod';
import { signUpFormSchema } from '@/lib/validators/auth.validator';
import { createClient } from '../supabase/server';

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

    return { success: true, data, error: null };
  } catch (error) {
    console.log('Error parsing form data:', error);
    return { success: false, error: 'Invalid form data' };
  }
}
