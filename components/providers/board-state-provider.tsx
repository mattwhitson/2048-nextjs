"use client";

import {
  BoardActions,
  boardReducer,
  BoardState,
  defaultBoardState,
} from "@/lib/board-store";
import {
  Context,
  createContext,
  Dispatch,
  useContext,
  useReducer,
} from "react";

export interface BoardContext {
  boardState: BoardState;
  dispatch: Dispatch<BoardActions>;
}

export const BoardStateContext: Context<BoardContext> = createContext(
  {} as BoardContext
);

export function useBoardStateContext() {
  return useContext(BoardStateContext);
}

export function BoardContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [boardState, dispatch] = useReducer(boardReducer, defaultBoardState);
  return (
    <BoardStateContext.Provider value={{ boardState, dispatch }}>
      {children}
    </BoardStateContext.Provider>
  );
}
