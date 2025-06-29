import Link from 'next/link';

const Homepage = () => {
  return (
    <>
      <h1 className="text-3xl font-bold underline">
        Welcome to Based Tic Tac Toe!
      </h1>
      <p className="mt-4 text-lg">
        This is a simple Tic Tac Toe game built with Next.js, TypeScript, and
        Tailwind CSS.
      </p>
      <p className="mt-2">
        <Link href="/auth/sign-up" className="text-blue-500 hover:underline">
          Sign Up
        </Link>{' '}
        or{' '}
        <Link href="/auth/login" className="text-blue-500 hover:underline">
          Sign In
        </Link>
      </p>
    </>
  );
};

export default Homepage;
