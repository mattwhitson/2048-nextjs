"use client";

import { useEffect, useState } from "react";
import { useBoardStateContext } from "@/components/providers/board-state-provider";
import { GameState, generateNewTile, TileState } from "@/lib/board-store";
import { Tile } from "./tile";
import {
  findDeletedTiles,
  finishMoveCallback,
  handleMove,
  hasNextMove,
  hasWonGame,
  invalidMove,
  reorderTiles,
} from "@/lib/move-logic";
import { useModal } from "@/lib/modal-store";

export function Tiles() {
  const { boardState, dispatch } = useBoardStateContext();
  const { tiles, tilesMap, boardSize, currentGameState, currentlyMovingTiles } =
    boardState;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        (e.key !== "ArrowRight" &&
          e.key !== "ArrowLeft" &&
          e.key !== "ArrowUp" &&
          e.key !== "ArrowDown") ||
        currentGameState === GameState.Lost ||
        currentGameState === GameState.Won ||
        currentlyMovingTiles
      )
        return;

      const tempTilesCopy = tiles.slice();

      reorderTiles(tiles, tilesMap, boardSize);
      const points = handleMove(e.key, tiles, tilesMap, boardSize);

      if (!invalidMove(tiles, tempTilesCopy, boardSize)) return;

      dispatch({
        type: "updateGameState",
        payload: {
          points,
          tiles,
          tilesMap,
          currentlyMovingTiles: true,
        },
      });

      const deletedPositions = findDeletedTiles(tiles, boardSize);

      setTimeout(() => {
        finishMoveCallback(tiles, tilesMap, deletedPositions, boardSize);

        if (currentGameState === GameState.Playing && hasWonGame(tiles)) {
          dispatch({ type: "updateCurrentGameState", payload: GameState.Won });
        }

        dispatch({
          type: "updateGameState",
          payload: {
            points: 0,
            tiles,
            tilesMap,
            currentlyMovingTiles: false,
          },
        });

        if (!hasNextMove(tiles, boardSize)) {
          dispatch({ type: "updateCurrentGameState", payload: GameState.Lost });
        }
      }, 150); // sliding animation is 150ms long

      for (let i = 0; i < boardSize * boardSize; i++) {
        tiles[i] = tilesMap.get(i)!;
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [
    currentGameState,
    tiles,
    tilesMap,
    boardSize,
    dispatch,
    currentlyMovingTiles,
  ]);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      {tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} />
      ))}
    </>
  );
}
