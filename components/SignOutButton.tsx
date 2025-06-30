'use client';
import { Button } from './ui/button';
import { logOutUser } from '@/lib/server/auth.actions';

const SignOutButton = () => {
  const handleSignOut = async () => {
    const result = await logOutUser();
    if (result.success) {
      console.log('User signed out successfully');
      // Optionally, redirect or update UI state
    } else {
      console.error('Error signing out:', result.error);
    }
  };

  return (
    <div>
      <Button onClick={handleSignOut}>Sign Out</Button>
    </div>
  );
};

export default SignOutButton;
