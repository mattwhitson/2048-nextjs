"use client";

import { useEffect, useState } from "react";
import { useBoardStateContext } from "@/components/providers/board-state-provider";
import { generateNewTile, TileState } from "@/lib/board-store";
import { Tile } from "./tile";
import {
  findDeletedTiles,
  finishMoveCallback,
  handleMove,
  invalidMove,
  reorderTiles,
} from "@/lib/move-logic";

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
        currentGameState === "Lost" ||
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

        dispatch({
          type: "updateGameState",
          payload: {
            points: 0,
            tiles,
            tilesMap,
            currentlyMovingTiles: false,
          },
        });
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
