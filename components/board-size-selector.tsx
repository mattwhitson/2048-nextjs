"use client";

import { Slider } from "@/components/ui/slider";
import { useBoardStateContext } from "./providers/board-state-provider";

export function BoardSizeSelector() {
  const { boardState, dispatch } = useBoardStateContext();
  return (
    <section className="flex flex-col gap-y-6 w-full max-w-[600px] items-center text-center">
      <p className="text-sm font-semibold">
        Choose the board size you want and away you go!
      </p>
      <p className="text-sm font-semibold">
        Current grid size:{" "}
        <span className="text-lg">{boardState.boardSize}</span>
      </p>
      <Slider
        defaultValue={[boardState.boardSize]}
        max={16}
        min={2}
        step={1}
        onValueChange={(value) =>
          dispatch({ type: "resizeBoard", payload: value[0] })
        }
      />
    </section>
  );
}
