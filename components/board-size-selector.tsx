"use client";

import { Slider } from "@/components/ui/slider";
import { useBoardStateContext } from "./providers/board-state-provider";

interface BoardSizeSelectorProps {
  boardSize: number;
  handleSizeChange: (boardSize: number) => void;
}

export function BoardSizeSelector({
  boardSize,
  handleSizeChange,
}: BoardSizeSelectorProps) {
  const { dispatch } = useBoardStateContext();
  return (
    <section className="flex flex-col gap-y-4 w-full max-w-[600px] items-center text-center my-6">
      <p className="text-sm font-semibold">
        Current grid size: <span className="text-lg">{boardSize}</span>
      </p>
      <Slider
        defaultValue={[boardSize]}
        max={16}
        min={2}
        step={1}
        onValueChange={(value) => handleSizeChange(value[0])}
      />
    </section>
  );
}
