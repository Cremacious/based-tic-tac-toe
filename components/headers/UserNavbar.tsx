import SignOutButton from '../SignOutButton';

const UserNavbar = () => {
  return (
    <header>
      <nav className="bg-green-500 p-4 h-16">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-white text-lg font-semibold">
            Based Tic Tac Toe
          </div>
          <div className="flex flex-row items-center">
            <a href="/dashboard" className="text-white hover:underline mr-4">
              Dashboard
            </a>
            <SignOutButton />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default UserNavbar;
