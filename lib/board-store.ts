import { v4 as uuidv4 } from "uuid";

export enum GameState {
  Lost = "Lost",
  Won = "Won",
  Playing = "Playing",
  ContinuingToPlay = "ContinuingToPlay",
}

export interface TileState {
  id: string;
  value: number;
  position: number;
  hasMerged: boolean;
  toBeDeleted: boolean;
  arrayIndex: number;
  placeholderPosition: number;
}

export type TileStateMap = Map<number, TileState>; // Key is going to be the arrayIndex
export interface BoardState {
  boardSize: number;
  tiles: TileState[];
  tilesMap: TileStateMap;
  currentGameState: GameState;
  currentScore: number;
  currentlyMovingTiles: boolean;
}

interface ResizeBoard {
  type: "resizeBoard";
  payload: number;
}

interface UpdateTiles {
  type: "updateGameState";
  payload: {
    tiles: TileState[];
    points: number;
    currentlyMovingTiles: boolean;
    tilesMap: TileStateMap;
  };
}

interface RestartGame {
  type: "restartGame";
  payload: number;
}

interface UpdateCurrentGameState {
  type: "updateCurrentGameState";
  payload: GameState;
}

export type BoardActions =
  | ResizeBoard
  | UpdateTiles
  | RestartGame
  | UpdateCurrentGameState;

export const defaultBoardState: BoardState = {
  ...initBoardState(4),
  boardSize: 4,
  currentGameState: GameState.Playing,
  currentScore: 0,
  currentlyMovingTiles: false,
};

export function initBoardState(dimensions: number) {
  const tiles: TileState[] = initTiles(dimensions);

  const tile1 = generateNewTile(
    Math.floor(Math.random() * dimensions * dimensions)
  );
  const tile2 = generateNewTile(
    Math.floor(Math.random() * dimensions * dimensions)
  );

  while (tile2.position === tile1.position)
    tile2.position = Math.floor(Math.random() * dimensions * dimensions);

  tiles[tile1.position] = tile1;
  tiles[tile2.position] = tile2;

  const tilesMap: TileStateMap = new Map();

  for (const tile of tiles) {
    tilesMap.set(tile.arrayIndex, tile);
  }

  return { tiles, tilesMap };
}

export function initTiles(dimensions: number) {
  const tiles = new Array(dimensions * dimensions);

  for (let i = 0; i < dimensions * dimensions; i++) {
    tiles[i] = generateNewTile(i, -1);
  }

  return tiles;
}

export function generateNewTile(position: number, value?: number): TileState {
  return {
    id: uuidv4(),
    value: value ? value : Math.random() > 0.1 ? 2 : 4,
    position,
    hasMerged: false,
    toBeDeleted: false,
    arrayIndex: position,
    placeholderPosition: -1,
  };
}

export function boardReducer(
  state: BoardState,
  action: BoardActions
): BoardState {
  switch (action.type) {
    case "resizeBoard":
      return { ...state, boardSize: action.payload };
    case "updateGameState":
      return {
        ...state,
        tiles: action.payload.tiles,
        tilesMap: action.payload.tilesMap,
        currentScore: state.currentScore + action.payload.points,
        currentlyMovingTiles: action.payload.currentlyMovingTiles,
      };

    case "restartGame":
      return {
        ...initBoardState(action.payload),
        boardSize: action.payload,
        currentGameState: GameState.Playing,
        currentScore: 0,
        currentlyMovingTiles: false,
      };
    case "updateCurrentGameState":
      return { ...state, currentGameState: action.payload };
    default:
      throw Error("Unknown action type");
  }
}
