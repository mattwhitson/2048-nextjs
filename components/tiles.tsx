"use client";

import { useEffect, useState } from "react";
import { useBoardStateContext } from "@/components/providers/board-state-provider";
import { generateNewTile, TileState } from "@/lib/board-store";
import { Tile } from "./tile";

const moves = ["ArrowRight", "ArrowUp", "ArrowDown", "ArrowLeft"] as const;
type PossibleMoves = (typeof moves)[number];

function insertIntoEmptyGridSquare(
  tiles: TileState[],
  currentPos: number,
  candidatePos: number
) {
  if (currentPos === candidatePos) return;
  tiles[candidatePos] = tiles[currentPos];
  tiles[currentPos] = generateNewTile(currentPos, -1);
}

function mirrorXAxis(tiles: TileState[], dimensions: number) {
  for (let row = 0; row < dimensions; row++) {
    for (let col = 0; col < dimensions / 2 + (dimensions % 2); col++) {
      let temp = tiles[row * dimensions + col];
      tiles[row * dimensions + col] =
        tiles[row * dimensions + dimensions - col - 1];
      tiles[row * dimensions + dimensions - col - 1] = temp;
    }
  }
  return tiles;
}

function mirrorYAxis(tiles: TileState[], dimensions: number) {
  for (let row = 0; row < dimensions; row++) {
    for (let col = row; col < dimensions; col++) {
      if (row === col) continue;
      let temp = tiles[row * dimensions + col];
      tiles[row * dimensions + col] = tiles[dimensions * col + row];
      tiles[dimensions * col + row] = temp;
    }
  }
  return tiles;
}

function reorientTiles(
  direction: PossibleMoves,
  tiles: TileState[],
  dimensions: number,
  before: boolean = true
): TileState[] {
  if (direction === "ArrowRight") {
    mirrorXAxis(tiles, dimensions);
  } else if (direction === "ArrowUp") {
    mirrorYAxis(tiles, dimensions);
  } else if (direction === "ArrowDown") {
    if (before) {
      mirrorYAxis(tiles, dimensions);
      mirrorXAxis(tiles, dimensions);
    } else {
      mirrorXAxis(tiles, dimensions);
      mirrorYAxis(tiles, dimensions);
    }
  }
  return tiles;
}

function calculateMove(
  direction: PossibleMoves,
  originalTiles: TileState[],
  dimensions: number
) {
  const tiles = reorientTiles(direction, originalTiles.slice(), dimensions);

  let pointsGainedThisMove = 0;
  for (let row = 0; row < dimensions; row++) {
    for (let col = 0; col < dimensions; col++) {
      if (tiles[row * dimensions + col].value === -1) {
        continue;
      }
      const currentPos = row * dimensions + col;
      for (let currentIndex = 1; currentIndex <= col; currentIndex++) {
        const candidatePos = currentPos - currentIndex;

        if (tiles[candidatePos].value === -1 && currentIndex !== col) {
          continue;
        }

        if (tiles[candidatePos].value === -1 && currentIndex === col) {
          insertIntoEmptyGridSquare(tiles, currentPos, candidatePos);
        } else if (
          tiles[candidatePos].value === tiles[currentPos].value &&
          !tiles[candidatePos].hasChanged
        ) {
          // !!!!!!!!Never forget that you have to clone objects when you assign them, i wasted something like 30 minutes on this stupid bug!!!!!!!!
          tiles[candidatePos] = structuredClone(tiles[currentPos]);
          tiles[candidatePos].value *= 2;
          pointsGainedThisMove += tiles[candidatePos].value;

          tiles[candidatePos].hasChanged = true;
          tiles[currentPos] = generateNewTile(tiles[currentPos].position, -1);
        } else {
          insertIntoEmptyGridSquare(tiles, currentPos, candidatePos + 1);
        }
        break;
      }
    }
  }

  reorientTiles(direction, tiles, dimensions, false);

  return { tiles, pointsGainedThisMove };
}

function getRandomTile(range: number) {
  return Math.floor(Math.random() * range);
}

function hasNextMove(tiles: TileState[], dimensions: number) {
  for (const move of moves) {
    const returnedBoardState = calculateMove(
      move as PossibleMoves,
      tiles,
      dimensions
    );

    if (hasBoardStateChanged(tiles, returnedBoardState.tiles, dimensions))
      return true;
  }
  return false;
}

function hasBoardStateChanged(
  tiles: TileState[],
  tempCopy: TileState[],
  dimensions: number
) {
  for (let i = 0; i < dimensions * dimensions; i++) {
    if (tempCopy[i] !== tiles[i]) return true;
  }

  return false;
}

export function Tiles() {
  const { boardState, dispatch } = useBoardStateContext();
  const { tiles, boardSize, currentGameState } = boardState;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        (e.key !== "ArrowRight" &&
          e.key !== "ArrowLeft" &&
          e.key !== "ArrowUp" &&
          e.key !== "ArrowDown") ||
        currentGameState === "Lost"
      )
        return;

      const tempCopy = calculateMove(e.key, tiles, boardSize);
      const freePositions = [];

      if (!hasBoardStateChanged(tiles, tempCopy.tiles, boardSize)) return;

      for (let i = 0; i < boardSize * boardSize; i++) {
        tempCopy.tiles[i].position = i;
        tempCopy.tiles[i].hasChanged = false;
        if (tempCopy.tiles[i].value === -1) {
          freePositions.push(i);
        }
      }

      const nextTilePosition =
        freePositions[getRandomTile(freePositions.length)];
      tempCopy.tiles[nextTilePosition] = generateNewTile(nextTilePosition);
      // When i want to add animations, I'll need to do some sort of transition between old and new state before just updating the state
      // because as it is right now, the old ones will immediately be deleted from the DOM as soon as I update the state, which
      // is not something i want to have happen
      /**
       * It'll be something along the lines of:
       * for (let i = 0; i < boardSize * boardSize; i++) {
       *    if (tempCopy[i].position !== i)
       *        originalList[tempCopy[i].position] = i;
       *
       * dispatch({ type: "updateTiles", payload: originalList });
       * // WAIT FOR ANIMATIONS TO FINISH
       * for (let i = 0; i < boardSize * boardSize; i++) {
       *     tempCopy[i].position = i;
       *}
       * dispatch({ type: "updateTiles", payload: tempCopy });
       */

      if (!hasNextMove(tempCopy.tiles, boardSize)) {
        dispatch({ type: "endGame", payload: "Lost" });
      }

      dispatch({
        type: "updateGameState",
        payload: {
          tiles: tempCopy.tiles,
          points: tempCopy.pointsGainedThisMove,
        },
      });
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [tiles, boardSize, dispatch, currentGameState]);

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
