import { create } from "zustand";
import pictures from "../classnames";

type UserStore = {
  round: number;
  picture: string[];
  points: number;
  highScore: number;
  setPoints: (v: number) => void;
  setRound: (v: number) => void;
  setHighScore: (v: number) => void;
};

export const useGame = create<UserStore>((set, get) => ({
  round: 1,
  picture:
    Array(5)
      .fill(0)
      .map(
        (_) => pictures.at(Math.floor(Math.random() * (99 - 0 + 1))) || ""
      ) || [],
  points: 0,
  highScore: 0,
  setPoints: (v: number) => set({ points: v }),
  setRound: (v: number) => set({ round: v }),
  setHighScore: (v: number) => set({ highScore: v }),
}));

type AIStore = {
  predictions: string[];
  predictionsPrec: number[];
  setPredictions: (v: string[]) => void;
  setPredictionsPrec: (v: number[]) => void;
};

export const useAI = create<AIStore>((set, get) => ({
  predictions: [],
  predictionsPrec: [],
  setPredictionsPrec: (v: number[]) => set({ predictionsPrec: v }),
  setPredictions: (v: string[]) => set({ predictions: v }),
}));

type TimerStore = {
  time: number;
  setTime: (v: number) => void;
};

export const useTimer = create<TimerStore>((set, get) => ({
  time: 30,
  setTime: (v: number) => set({ time: v }),
}));
