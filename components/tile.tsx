"use client";

import { TileState } from "@/lib/board-store";
import { cn } from "@/lib/utils";
import { useBoardStateContext } from "./providers/board-state-provider";
import { useEffect } from "react";

const COLORS = [
  "bg-slate-300",
  "bg-green-200",
  "bg-green-300",
  "bg-emerald-400",
  "bg-emerald-500",
  "bg-teal-400",
  "bg-teal-500",
  "bg-blue-400",
  "bg-blue-500",
  "bg-cyan-500",
  "bg-cyan-600",
];

interface TileProps {
  tile: TileState;
  tileWidth: number;
  borderPaddingOffset?: number;
}

export function Tile({ tile, tileWidth, borderPaddingOffset = 1 }: TileProps) {
  const { boardState } = useBoardStateContext();
  const { boardSize } = boardState;
  const xOffset = (tile.position % boardSize) * 100;
  const xBorderOffset = borderPaddingOffset * (xOffset / 100);
  const yOffset = Math.floor(tile.position / boardSize) * 100;
  const yBorderOffset = borderPaddingOffset * (yOffset / 100);

  useEffect(() => {
    // TODO: change font size depending on tile width
  }, [tileWidth]);

  // when recalcuting board size, we will need to take into account top and left values for padding/margin of grid
  // also will need to calculate the width of the squares dynamically and yeah, prpobably something else im forgetting
  return (
    <div
      className={cn(
        `absolute flex items-center justify-center text-3xl text-black font-semibold top-4 left-4 rounded-sm transition-all`,
        COLORS[(Math.log(tile.value) / Math.log(2) - 1) % COLORS.length]
      )}
      style={{
        transform: `translate(calc(${xOffset}% + ${xBorderOffset}rem), calc(${yOffset}% + ${yBorderOffset}rem))`,
        width: `${tileWidth * (4 / boardSize)}px`,
        height: `${tileWidth * (4 / boardSize)}px`,
        top: `${borderPaddingOffset}rem`,
        left: `${borderPaddingOffset}rem`,
      }}
    >
      {tile.value !== -1 && tile.value}
    </div>
  );
}
