import { TileState } from "@/lib/store";
import { cn } from "@/lib/utils";

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
  const xOffset = (tile.position % 4) * 100;
  const xBorderOffset = borderPaddingOffset * (xOffset / 100);
  const yOffset = Math.floor(tile.position / 4) * 100;
  const yBorderOffset = borderPaddingOffset * (yOffset / 100);

  // when recalcuting board size, we will need to take into account top and left values for padding/margin of grid
  // also will need to calculate the width of the squares dynamically and yeah, prpobably something else im forgetting

  return (
    <div
      className={cn(
        `absolute w-[200px] h-[200px] flex items-center justify-center text-3xl text-black font-semibold top-4 left-4`,
        COLORS[(Math.log(tile.value) / Math.log(2) - 1) % COLORS.length]
      )}
      style={{
        transform: `translate(calc(${xOffset}% + ${xBorderOffset}rem), calc(${yOffset}% + ${yBorderOffset}rem))`,
      }}
    >
      {tile.value !== -1 && tile.value}
    </div>
  );
}
