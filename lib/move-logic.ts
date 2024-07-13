import { Dispatch } from "react";
import { v4 as uuidV4 } from "uuid";
import { BoardActions, TileState, TileStateMap } from "./board-store";

const moves = ["ArrowRight", "ArrowUp", "ArrowDown", "ArrowLeft"] as const;
type PossibleMoves = (typeof moves)[number];

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
) {
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
}

function placeTileInEmptyIndex(
  tiles: TileState[],
  tilesMap: TileStateMap,
  currentTileIndex: number,
  candidateTileIndex: number
) {
  const currentTileArrayIndex = tiles[currentTileIndex].arrayIndex;
  const candidateTileArrayIndex = tiles[candidateTileIndex].arrayIndex;
  const toBeDeleted = tiles[candidateTileIndex].toBeDeleted;
  const placeholderPosition = toBeDeleted
    ? tiles[currentTileIndex].position
    : -1;

  tilesMap.set(currentTileArrayIndex, {
    ...tiles[currentTileIndex],
    position: toBeDeleted
      ? tiles[candidateTileIndex].placeholderPosition
      : tiles[candidateTileIndex].position,
  });

  tilesMap.set(candidateTileArrayIndex, {
    ...tiles[candidateTileIndex],
    position: toBeDeleted
      ? tiles[candidateTileIndex].position
      : tiles[currentTileIndex].position,
    placeholderPosition: placeholderPosition,
  });

  tiles[candidateTileIndex] = tilesMap.get(currentTileArrayIndex)!;
  tiles[currentTileIndex] = tilesMap.get(candidateTileArrayIndex)!;
}

function calculateNewTilePositions(
  tiles: TileState[],
  tilesMap: TileStateMap,
  boardSize: number
): number {
  let pointsAwarded = 0;

  for (let row = 0; row < boardSize; row++) {
    for (let col = 1; col < boardSize; col++) {
      const currentTileIndex = row * boardSize + col;
      if (tiles[currentTileIndex].value === -1) continue;

      for (let currentOffset = 1; currentOffset <= col; currentOffset++) {
        const candidateTileIndex = currentTileIndex - currentOffset;

        if (
          currentOffset < col &&
          (tiles[candidateTileIndex].value === -1 ||
            tiles[candidateTileIndex].toBeDeleted)
        )
          continue;

        if (
          tiles[candidateTileIndex].value === -1 ||
          tiles[candidateTileIndex].toBeDeleted
        ) {
          placeTileInEmptyIndex(
            tiles,
            tilesMap,
            currentTileIndex,
            candidateTileIndex
          );
        } else if (
          tiles[candidateTileIndex].value !== tiles[currentTileIndex].value ||
          tiles[candidateTileIndex].hasMerged
        ) {
          if (currentOffset === 1) break;
          placeTileInEmptyIndex(
            tiles,
            tilesMap,
            currentTileIndex,
            candidateTileIndex + 1
          );
        } else {
          const currentTileArrayIndex = tiles[currentTileIndex].arrayIndex;
          const candidateTileArrayIndex = tiles[candidateTileIndex].arrayIndex;
          const prevPosition = tiles[currentTileIndex].position;

          tilesMap.set(currentTileArrayIndex, {
            ...tiles[currentTileIndex],
            position: tiles[candidateTileIndex].position,
            toBeDeleted: true,
            placeholderPosition: prevPosition,
          });

          tilesMap.set(candidateTileArrayIndex, {
            ...tiles[candidateTileIndex],
            hasMerged: true,
          });

          tiles[currentTileIndex] = tilesMap.get(currentTileArrayIndex)!;
          tiles[candidateTileIndex] = tilesMap.get(candidateTileArrayIndex)!;

          pointsAwarded += tiles[candidateTileIndex].value * 2;
        }

        break;
      }
    }
  }
  return pointsAwarded;
}

function canPerformAnotherMove(tiles: TileState[], boardSize: number) {
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      if (
        (col + 1 < boardSize &&
          tiles[row * boardSize + col].value ===
            tiles[row * boardSize + col + 1].value) ||
        (row + 1 < boardSize &&
          tiles[row * boardSize + col].value ===
            tiles[(row + 1) * boardSize + col].value) ||
        tiles[row * boardSize + col].value === -1 ||
        (col + 1 < boardSize &&
          tiles[row * boardSize + col + 1].value === -1) ||
        (row + 1 < boardSize && tiles[(row + 1) * boardSize + col].value === -1)
      ) {
        return true;
      }
    }
  }

  return false;
}

export function handleMove(
  key: PossibleMoves,
  tiles: TileState[],
  tilesMap: TileStateMap,
  boardSize: number
): number {
  reorientTiles(key, tiles, boardSize);

  const pointsAwarded = calculateNewTilePositions(tiles, tilesMap, boardSize);

  reorientTiles(key, tiles, boardSize, false);

  return pointsAwarded;
}

export function invalidMove(
  tiles: TileState[],
  tempTilesCopy: TileState[],
  boardSize: number
) {
  tempTilesCopy.sort((a, b) => a.position - b.position);
  for (let i = 0; i < boardSize * boardSize; i++) {
    if (tempTilesCopy[i] !== tiles[i]) return true;
  }

  return false;
}

export function hasNextMove(tiles: TileState[], boardSize: number) {
  const copy = tiles.slice();
  copy.sort((a, b) => a.position - b.position);
  for (const move in moves) {
    if (canPerformAnotherMove(copy, boardSize)) return true;
  }

  return false;
}

export function findDeletedTiles(tiles: TileState[], boardSize: number) {
  const positionsPresent: Set<number> = new Set();
  for (let i = 0; i < boardSize * boardSize; i++) {
    positionsPresent.add(tiles[i].position);
  }

  const deletedPositions: number[] = [];
  for (let i = 0; i < boardSize * boardSize; i++) {
    if (!positionsPresent.has(i)) deletedPositions.push(i);
  }

  return deletedPositions;
}

export function reorderTiles(
  tiles: TileState[],
  tilesMap: TileStateMap,
  boardSize: number
) {
  const temp = [];
  for (let i = 0; i < boardSize * boardSize; i++) {
    const tile = tilesMap.get(tiles[i].arrayIndex)!;
    temp[tile.position] = tile;
  }
  for (let i = 0; i < boardSize * boardSize; i++) {
    tiles[i] = temp[i];
  }
}

export function finishMoveCallback(
  tiles: TileState[],
  tilesMap: TileStateMap,
  deletedPositions: number[],
  boardSize: number
) {
  const freePositions = [];
  for (let i = 0; i < boardSize * boardSize; i++) {
    if (tiles[i].toBeDeleted) {
      tiles[i] = {
        ...tiles[i],
        toBeDeleted: false,
        value: -1,
        position: deletedPositions.pop()!,
        id: uuidV4(),
      };
      freePositions.push(i);
    } else if (tiles[i].value === -1) {
      freePositions.push(i);
    } else if (tiles[i].hasMerged) {
      tiles[i].hasMerged = false;
      tiles[i].value *= 2;
    }

    tilesMap.set(tiles[i].arrayIndex, tiles[i]);
  }

  const newTilePosition =
    freePositions[Math.floor(Math.random() * freePositions.length)];

  tiles[newTilePosition].value = Math.random() < 0.1 ? 4 : 2;
  tilesMap.set(tiles[newTilePosition].arrayIndex, tiles[newTilePosition]);
}

export function hasWonGame(tiles: TileState[]) {
  for (let i = 0; i < tiles.length; i++)
    if (tiles[i].value === 2048) return true;

  return false;
}
