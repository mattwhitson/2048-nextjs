import { Board } from "@/components/board";
import { Header } from "@/components/header";

export default function Home() {
  return (
    <div className="flex h-full flex-col items-center p-8 md:p-12 bg-background sm:md:lg:xl:pb-0 max-w-[1075px] mx-auto">
      <Header />
      <Board />
    </div>
  );
}
