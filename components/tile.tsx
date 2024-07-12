"use client";

import { TileState } from "@/lib/board-store";
import { cn } from "@/lib/utils";
import { useBoardStateContext } from "./providers/board-state-provider";

const COLORS = [
  "bg-slate-300",
  "bg-green-200",
  "bg-green-500",
  "bg-emerald-200",
  "bg-emerald-500",
  "bg-teal-200",
  "bg-teal-500",
  "bg-blue-200",
  "bg-blue-500",
  "bg-cyan-200",
  "bg-cyan-500",
];

interface TileProps {
  tile: TileState;
  borderPaddingOffset?: number;
}

export function Tile({ tile, borderPaddingOffset = 1 }: TileProps) {
  const { boardState } = useBoardStateContext();
  const { boardSize } = boardState;
  const xOffset = (tile.position % boardSize) * 100;
  const xBorderOffset = borderPaddingOffset * (xOffset / 100);
  const yOffset = Math.floor(tile.position / boardSize) * 100;
  const yBorderOffset = borderPaddingOffset * (yOffset / 100);

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
        width: `${200 * (4 / boardSize)}px`,
        height: `${200 * (4 / boardSize)}px`,
      }}
    >
      {tile.value !== -1 && tile.value}
    </div>
  );
}
