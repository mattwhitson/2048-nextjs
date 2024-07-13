"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBoardStateContext } from "@/components/providers/board-state-provider";
import { useModal } from "@/lib/modal-store";
import { GameState } from "@/lib/board-store";

export function WonGameModal() {
  const { dispatch, boardState } = useBoardStateContext();
  const { isOpen, onClose, type } = useModal();
  const { boardSize } = boardState;

  const isWonGameModalOpen = isOpen && type === "WonGame";

  return (
    <Dialog open={isWonGameModalOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-black">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">Congrats!</DialogTitle>
          <DialogDescription className="text-center text-sm font-semibold pb-8">
            You&apos;ve won the game!
          </DialogDescription>
          <p className="text-center">
            Give yourself a pat on the back! This game can be deceptively hard
            (depending on the board size you chose, of course!)
          </p>
        </DialogHeader>
        <div className="flex w-full justify-center items-center mt-8">
          <Button
            variant="destructive"
            className="w-[40%] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus:bg-destructive/90"
            onClick={() => {
              dispatch({ type: "restartGame", payload: boardSize });
              onClose();
            }}
          >
            Restart now
          </Button>
          <span className="px-2">OR</span>
          <Button
            className="w-[40%] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-0 focus:bg-emerald-500/85"
            type="submit"
            variant="success"
            onClick={() => {
              dispatch({
                type: "updateCurrentGameState",
                payload: GameState.ContinuingToPlay,
              });
              onClose();
            }}
          >
            Continue playing
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
