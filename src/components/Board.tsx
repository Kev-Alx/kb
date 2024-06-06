import { useEffect, useState } from "react";
import * as tf from "@tensorflow/tfjs";
type Props = {};
//@ts-ignore
import pictures from "./classnames";
async function loadModel() {
  const model = await tf.loadLayersModel("model.json");
  // model.summary();
  return model;
}
const GRID_SIZE = 28;
const list = new Array(GRID_SIZE).fill(0);

const Board = ({}: Props) => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  useEffect(() => {
    const model = loadModel();
    //@ts-ignore
    model.then((m) => {
      // m.summary();
      setModel(m);
    });
  }, []);

  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const color = (el: any) => {
    if (isDrawing) {
      console.log("el");
      if (!isErasing) {
        el.target.style.backgroundColor = "black";
      } else {
        el.target.style.backgroundColor = "transparent";
      }
    }
  };

  const getTensor = () => {
    const pixels = document.querySelectorAll(".pixel");
    console.log(pixels[10].getAttribute("style"));
    const tensorData: any = [];
    pixels.forEach((pixel) => {
      tensorData.push(
        pixel.getAttribute("style")?.split(" ")[1] === "black;" ? 1 : 0
      );
    });
    console.log(tensorData);
    const tensor = new Float32Array(tensorData);
    // console.log(tf.tensor(tensor, [1, GRID_SIZE, GRID_SIZE, 1]));
    //@ts-ignore
    const pred = model.predict(tf.tensor(tensor, [1, GRID_SIZE, GRID_SIZE, 1]));
    let predictions;
    if (Array.isArray(pred)) {
      predictions = pred[0].dataSync(); // Assuming we need the first tensor
    } else {
      predictions = pred.dataSync();
    }
    const predArray = Array.from(predictions);
    const sortedIndices = predArray
      .map((value, index) => [value, index])
      .sort((a, b) => b[0] - a[0])
      .slice(0, 5)
      .map((item) => item[1]);
    const top5Classes = sortedIndices.map((index) => pictures[index]);

    console.log(top5Classes);
    //@ts-ignore
    // const ind = tf.topk(tf.neg(pred), 5);
    // const latex = ind.values.dataSync();
    // const la = latex.map((i) => pictures[i]);
    // console.log(latex);
    // const ind = (-pred).a;
  };

  return (
    <>
      <div>{isDrawing + ""}</div>
      <div>{isErasing + ""}</div>
      <div className="grid grid-cols-[repeat(28,minmax(0,1fr))] border-b-[0.1px] border-l-[0.1px] border-neutral-900">
        {list.map((_, i) =>
          list.map((_, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                setIsDrawing((p) => !p);
              }}
              onMouseEnter={(el) => color(el)}
              className="aspect-square border-neutral-900 border-t-[0.1px] border-r-[0.1px] h-4 pixel"
            />
          ))
        )}
      </div>
      <section className="my-4">
        <div className="flex gap-4">
          <button onClick={() => setIsErasing((e) => !e)}>Eraser</button>
          <button
            onClick={() => {
              //@ts-ignore
              Array.from(document.querySelectorAll(".pixel")).map((el: any) => {
                el.style.backgroundColor = "transparent";
              });
            }}
          >
            Clear
          </button>
          <button onClick={() => getTensor()}>Data</button>
          <button onClick={() => console.log("hi")}>hi</button>
        </div>
      </section>
    </>
  );
};

export default Board;
