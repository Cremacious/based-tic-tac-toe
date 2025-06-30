import { Button } from '@/components/ui/button';

const NewGamePage = () => {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="bg-green-500 p-8 rounded-xl shadow-lg w-80 h-96 flex flex-col justify-center items-center space-y-6">
        <div>Game Code:</div>
        <div>Give Your Friend This Code to invite them</div>
        <Button>Go To Game</Button>
      </div>
    </div>
  );
};

export default NewGamePage;
