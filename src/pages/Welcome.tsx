import { Button } from "../components/ui/button";
import { useGame } from "../lib/store";

type Props = {};

const Welcome = (props: Props) => {
  const { points } = useGame();
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center gap-8">
      <h1 className="font-semibold text-xl">PROYEK KB AI GAMBAR</h1>
      <p>High score: {points}</p>
      <Button asChild>
        <a href="/game">Play game</a>
      </Button>
    </div>
  );
};

export default Welcome;
