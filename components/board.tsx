"use client";

import { useEffect, useState } from "react";
import { useBoardStateContext } from "@/components/providers/board-state-provider";
import { cn, lerp } from "@/lib/utils";
import { Tiles } from "@/components/tiles";
import { useModal } from "@/lib/modal-store";
import { GameState } from "@/lib/board-store";

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
  const [tileWidth, setTileWidth] = useState(200);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setGrid(initGrid(boardSize));
  }, [boardSize]);

  useEffect(() => {
    if (currentGameState === GameState.Lost) {
      onOpen("EndGame", currentScore);
    } else if (currentGameState === "Won") {
      onOpen("WonGame");
    }
  }, [currentGameState, onOpen, currentScore]);

  useEffect(() => {
    const handleWindowResize = (e: Event) => {
      if (window.innerWidth > 950 && tileWidth === 200) return;

      // I am lerping the board width from 900px -> 300px,
      // i don't really care about screens narrower than that
      // (i'm also assuming that viewports > 950px have at least 1080px in height)
      setTileWidth(
        Math.min(200, 200 - lerp(0, 150, (950 - window.innerWidth) / 650))
      );
    };

    window.addEventListener("resize", handleWindowResize);
    return () => window.removeEventListener("resize", handleWindowResize);
  }, [tileWidth]);

  // I have this use effect here so that the board size will readjust when app is opened
  // on a screen smaller than 950px across
  useEffect(() => {
    if (isMounted) return;
    setIsMounted(true);
    if (window.innerWidth > 950 && tileWidth === 200) return;

    setTileWidth(
      Math.min(200, 200 - lerp(0, 150, (950 - window.innerWidth) / 650))
    );
  }, [tileWidth, isMounted]);

  if (!isMounted) return null;

  return (
    <main className="m-24 sm:none">
      <section
        className="flex flex-col relative bg-[hsl(var(--border))] rounded-sm"
        style={{
          padding: `${0.5 - lerp(0.0, 0.4, (boardSize - 4) / boardSize)}rem`,
        }}
      >
        {grid.map((row, i) => (
          <div className="flex flex-row" key={i}>
            {row.map((col, j) => (
              <div
                className={cn(`bg-background rounded-sm`)}
                style={{
                  width: `${tileWidth * (4 / boardSize)}px`,
                  height: `${tileWidth * (4 / boardSize)}px`,
                  margin: `${
                    0.5 - lerp(0.0, 0.4, (boardSize - 4) / boardSize)
                  }rem`,
                }}
                key={i + j}
              ></div>
            ))}
          </div>
        ))}
        <Tiles tileWidth={tileWidth} />
      </section>
    </main>
  );
}
