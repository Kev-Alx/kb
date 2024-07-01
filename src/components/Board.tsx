import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
type Props = {};
//@ts-ignore
import pictures from "../classnames";
import { Button } from "./ui/button";
import { cn } from "../lib/utils";
import { useAI, useGame } from "../lib/store";
import Answer from "./Answer";
import { toast } from "./ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Eraser, Trash } from "lucide-react";
async function loadModel() {
  const model = await tf.loadLayersModel("model.json");
  // model.summary();
  return model;
}
const GRID_SIZE = 28;
const list = new Array(GRID_SIZE).fill(0);

const Board = ({}: Props) => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const getTensor = () => {
    const pixels = document.querySelectorAll(".pixel");
    // console.log(pixels[10].getAttribute("style"));
    const tensorData: any = [];
    pixels.forEach((pixel) => {
      tensorData.push(
        pixel.getAttribute("style")?.split(" ")[1] === "black;" ? 1 : 0
      );
    });
    // console.log(tensorData);
    const tensor = new Float32Array(tensorData);
    // console.log(tf.tensor(tensor, [1, GRID_SIZE, GRID_SIZE, 1]));
    //@ts-ignore
    const pred = model.predict(tf.tensor(tensor, [1, GRID_SIZE, GRID_SIZE, 1]));
    let predictions;
    if (Array.isArray(pred)) {
      predictions = pred[0].dataSync();
    } else {
      predictions = pred.dataSync();
    }
    const predArray = Array.from(predictions);
    const sortedResult = predArray
      .map((value, index) => [value, index])
      .sort((a, b) => b[0] - a[0])
      .slice(0, 5);
    const sortedIndices = sortedResult.map((item) => item[1]);
    const top5Classes = sortedIndices.map((index) => pictures[index]);
    const perc = sortedResult.map((item) => item[0]);
    setPredictions(top5Classes);
    setPredictionsPrec(perc);
    return top5Classes;
  };
  const navigate = useNavigate();
  useEffect(() => {
    const model = loadModel();
    //@ts-ignore
    model.then((m) => {
      // m.summary();
      setModel(m);
    });
  }, []);
  const [time, setTime] = useState(30);
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (time > 0) {
        setTime((t) => t - 1);
      } else {
        setTime(30);
        setRound(round + 1);
        clear();
        toast({
          variant: "destructive",
          title: "Waktu habis, next round",
        });
        return;
      }
      if (round > 5) {
        clearInterval(intervalId);
        if (points > highScore) {
          setHighScore(points);
        }
        navigate("/end", { replace: true });
        return;
      }
      const top5Classes = getTensor();
      if (top5Classes[0] === picture[round - 1]) {
        setRound(round + 1);
        setPoints(points + 1);
        setTime(30);
        setIsDrawing(false);
        clear();
        toast({
          title: "Benar",
        });
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [getTensor]);

  const {
    round,
    picture,
    points,
    setRound,
    setPoints,
    highScore,
    setHighScore,
  } = useGame();
  // console.log(picture);
  const { setPredictions, setPredictionsPrec } = useAI();
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  const color = (el: any) => {
    if (isDrawing) {
      if (!isErasing) {
        el.target.style.backgroundColor = "black";
      } else {
        el.target.style.backgroundColor = "transparent";
      }
    }
  };
  const clear = () => {
    setIsDrawing(false);
    //@ts-ignore
    Array.from(document.querySelectorAll(".pixel")).map((el: any) => {
      el.style.backgroundColor = "transparent";
    });
  };

  return (
    <div
      className={cn(
        "w-full p-8 flex flex-col md:flex-row md:gap-16 gap-4",
        isDrawing && " cursor-pencil",
        isErasing && "cursor-eraser"
      )}
    >
      <div className="bg-slate-100 p-4 rounded">
        <p>Round {round}</p>
        <p>
          Draw: <span>{picture[round - 1]}</span>
        </p>
        <p>Time left: {time}</p>
        <p>Points: {points}</p>
      </div>
      <div>
        <div className="grid grid-cols-[repeat(28,minmax(0,1fr))] border-b-[0.1px] border-l-[0.1px] border-neutral-400">
          {list.map((_, i) =>
            list.map((_, j) => (
              <div
                key={`${i}-${j}`}
                onClick={() => {
                  setIsDrawing((p) => !p);
                }}
                onMouseEnter={(el) => color(el)}
                className={cn(
                  "aspect-square border-neutral-400 border-t-[1px] border-r-[1px] h-4 pixel"
                )}
              />
            ))
          )}
        </div>
        <section className="my-4">
          <div className="flex gap-4">
            <Button
              variant={isErasing ? "secondary" : "default"}
              onClick={() => setIsErasing((e) => !e)}
            >
              <Eraser className="h-4 w-4 mr-2" /> Eraser
            </Button>
            <Button onClick={clear}>
              <Trash className="h-4 w-4 mr-2" /> Clear
            </Button>
          </div>
        </section>
      </div>
      <Answer />
    </div>
  );
};

export default Board;
