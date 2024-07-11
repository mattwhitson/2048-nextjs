"use client";

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import { useModal } from "@/lib/modal-store";
import { useBoardStateContext } from "@/components/providers/board-state-provider";
import { BoardSizeSelector } from "../board-size-selector";
import { useState } from "react";

export function SettingsModal() {
  const { dispatch, boardState } = useBoardStateContext();
  const { isOpen, onClose, type } = useModal();
  const { boardSize: size } = boardState;

  const [boardSize, setBoardSize] = useState(size);

  const isSettingsOpen = isOpen && type === "Settings";
  return (
    <Dialog open={isSettingsOpen} onOpenChange={onClose}>
      <DialogContent className="dark:bg-black">
        <DialogHeader>
          <DialogTitle className="text-center text-3xl">Settings</DialogTitle>
          <DialogDescription className="text-center text-sm font-semibold">
            Choose the board size you want and away you go!
          </DialogDescription>
        </DialogHeader>
        <BoardSizeSelector
          boardSize={boardSize}
          handleSizeChange={setBoardSize}
        />
        <Button
          className="w-[50%] mx-auto"
          variant="destructive"
          onClick={() => {
            dispatch({ type: "restartGame", payload: boardSize });
            onClose();
          }}
        >
          Restart game
        </Button>
      </DialogContent>
    </Dialog>
  );
}
