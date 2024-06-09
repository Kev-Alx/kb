import React from "react";
import { useGame } from "../lib/store";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";

type Props = {};

const End = (props: Props) => {
  const { points } = useGame();
  return (
    <div className="w-full p-16 flex items-center justify-center min-h-screen flex-col gap-4">
      <h1 className="font-semibold text-xl">Game end</h1>
      <p>Your score: {points}/5</p>
      <Button asChild>
        <Link to={"/"}>Go back to home</Link>
      </Button>
    </div>
  );
};

export default End;
