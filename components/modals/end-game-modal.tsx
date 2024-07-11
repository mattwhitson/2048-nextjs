"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModal } from "@/lib/modal-store";
import { useBoardStateContext } from "../providers/board-state-provider";

export function EndGameModal() {
  const { boardState, dispatch } = useBoardStateContext();
  const { isOpen, onClose, type } = useModal();
  const { currentScore, boardSize } = boardState;
  const isModalOpen = isOpen && type === "EndGame";
  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent
        className="dark:bg-black"
        hideCloseButton={true}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">Game Over</DialogTitle>
          <DialogDescription className="text-center">
            Better luck next time!
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-center items-center my-12">
          <h3>You&apos;re score was:</h3>
          <p className="text-4xl">{currentScore}</p>
        </div>
        <Button
          className="w-[50%] mx-auto"
          variant="outline"
          onClick={() => {
            dispatch({ type: "restartGame", payload: boardSize });
            onClose();
          }}
        >
          Play Again?
        </Button>
      </DialogContent>
    </Dialog>
  );
}
