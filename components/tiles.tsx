"use client";

import { useEffect, useState } from "react";
import { useBoardStateContext } from "@/components/providers/board-state-provider";
import { cn } from "@/lib/utils";
import { generateNewTile, TileState } from "@/lib/store";
import { Tile } from "./tile";

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
  e: KeyboardEvent,
  tiles: TileState[],
  dimensions: number,
  before: boolean = true
): TileState[] {
  if (e.key === "ArrowRight") {
    mirrorXAxis(tiles, dimensions);
  } else if (e.key === "ArrowUp") {
    mirrorYAxis(tiles, dimensions);
  } else if (e.key === "ArrowDown") {
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
  e: KeyboardEvent,
  originalTiles: TileState[],
  dimensions: number
) {
  const tiles = reorientTiles(e, originalTiles.slice(), dimensions);
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
          tiles[candidatePos] = tiles[currentPos];
          tiles[candidatePos].value *= 2;
          tiles[candidatePos].hasChanged = true;
          tiles[currentPos] = generateNewTile(currentPos, -1);
        } else {
          insertIntoEmptyGridSquare(tiles, currentPos, candidatePos + 1);
        }
        break;
      }
    }
  }

  reorientTiles(e, tiles, dimensions, false);
  return tiles;
}

function getRandomTile(range: number) {
  return Math.floor(Math.random() * range);
}

export function Tiles() {
  const { boardState, dispatch } = useBoardStateContext();
  const { tiles, boardSize } = boardState;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleKeyPress = (e: KeyboardEvent) => {
      if (
        e.key !== "ArrowRight" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowUp" &&
        e.key !== "ArrowDown"
      )
        return;

      const tempCopy = calculateMove(e, tiles, boardSize);
      const freePositions = [];

      let hasChanged = false;
      for (let i = 0; i < boardSize * boardSize; i++) {
        if (tempCopy[i] !== tiles[i]) hasChanged = true;
      }

      if (!hasChanged) return;
      console.log(JSON.parse(JSON.stringify(tempCopy)));
      for (let i = 0; i < boardSize * boardSize; i++) {
        tempCopy[i].position = i;
        tempCopy[i].hasChanged = false;
        if (tempCopy[i].value === -1) {
          freePositions.push(i);
        }
      }

      const nextTilePosition =
        freePositions[getRandomTile(freePositions.length)];
      tempCopy[nextTilePosition] = generateNewTile(nextTilePosition);
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
      dispatch({ type: "updateTiles", payload: tempCopy });
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [tiles, boardSize, dispatch]);

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
