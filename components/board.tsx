"use client";

import { useEffect, useState } from "react";
import { useBoardStateContext } from "./providers/board-state-provider";
import { cn } from "@/lib/utils";
import { Tiles } from "./tiles";

function initGrid(dimensions: number) {
  const grid = new Array(dimensions);

  for (let i = 0; i < dimensions; i++) {
    grid[i] = new Array(dimensions);
    for (let j = 0; j < dimensions; j++) grid[i][j] = 1;
  }

  return grid;
}

export function Board() {
  const { boardState } = useBoardStateContext();
  const { boardSize } = boardState;
  const [grid, setGrid] = useState<number[][]>(initGrid(boardSize));

  useEffect(() => {
    setGrid(initGrid(boardSize));
  }, [boardSize]);

  return (
    <section className="mt-24">
      <div className="flex flex-col relative p-2 bg-[hsl(var(--border))]">
        {grid.map((row, i) => (
          <div className="flex flex-row" key={i}>
            {row.map((col, j) => (
              <div
                className={cn("w-[200px] h-[200px] bg-background m-2")}
                key={i + j}
              ></div>
            ))}
          </div>
        ))}
        <Tiles />
      </div>
    </section>
  );
}
