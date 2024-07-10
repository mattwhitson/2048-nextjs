import { Board } from "@/components/board";
import { BoardSizeSelector } from "@/components/board-size-selector";

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center p-8 md:p-24 bg-background sm:md:lg:xl:pb-0">
      <h1 className="text-6xl font-bold mb-12">2048</h1>
      <BoardSizeSelector />
      <Board />
    </main>
  );
}
