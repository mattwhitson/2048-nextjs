"use client";

import { useEffect, useState } from "react";
import { useBoardStateContext } from "@/components/providers/board-state-provider";
import { cn } from "@/lib/utils";
import { Tiles } from "@/components/tiles";
import { useModal } from "@/lib/modal-store";

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
  const { onOpen } = useModal();
  const { boardSize, currentGameState, currentScore } = boardState;
  const [grid, setGrid] = useState<number[][]>(initGrid(boardSize));

  useEffect(() => {
    setGrid(initGrid(boardSize));
  }, [boardSize]);

  useEffect(() => {
    if (currentGameState === "Lost") {
      onOpen("EndGame", currentScore);
    } else if (currentGameState === "Won") {
      // TODO: open winning modal
    }
  }, [currentGameState, onOpen, currentScore]);

  return (
    <main className="mt-24">
      <section className="flex flex-col relative p-2 bg-[hsl(var(--border))]">
        {grid.map((row, i) => (
          <div className="flex flex-row" key={i}>
            {row.map((col, j) => (
              <div
                className={cn(
                  "w-[200px] h-[200px] bg-background m-2 rounded-sm"
                )}
                key={i + j}
              ></div>
            ))}
          </div>
        ))}
        <Tiles />
      </section>
    </main>
  );
}
