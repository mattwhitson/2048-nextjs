import { v4 as uuidv4 } from "uuid";

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
  currentGameState: "Lost" | "Won" | "Playing";
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

interface GameOver {
  type: "endGame";
  payload: "Lost";
}

interface RestartGame {
  type: "restartGame";
  payload: number;
}

interface WonGame {
  type: "wonGame";
  payload: "Won";
}

export type BoardActions =
  | ResizeBoard
  | UpdateTiles
  | GameOver
  | RestartGame
  | WonGame;

export const defaultBoardState: BoardState = {
  ...initBoardState(4),
  boardSize: 4,
  currentGameState: "Playing",
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

  // const tile1 = generateNewTile(0, 2);
  // const tile2 = generateNewTile(1, 4);
  // const tile3 = generateNewTile(2, 8);
  // const tile4 = generateNewTile(4, 4);
  // const tile5 = generateNewTile(5, 8);
  const tile6 = generateNewTile(6, 16);
  const tile7 = generateNewTile(7, 4);
  const tile8 = generateNewTile(8, 16);
  const tile9 = generateNewTile(9, 128);
  const tile10 = generateNewTile(10, 4);
  const tile11 = generateNewTile(11, 2);
  const tile12 = generateNewTile(12, 2);
  const tile13 = generateNewTile(13, 4);
  const tile14 = generateNewTile(14, 16);
  const tile15 = generateNewTile(15, 4);

  while (tile2.position === tile1.position)
    tile2.position = Math.floor(Math.random() * dimensions * dimensions);

  tiles[tile1.position] = tile1;
  tiles[tile2.position] = tile2;

  // tiles[tile1.position] = tile1;
  // tiles[tile2.position] = tile2;
  // tiles[tile3.position] = tile3;
  // tiles[tile4.position] = tile4;
  // tiles[tile5.position] = tile5;
  tiles[tile6.position] = tile6;
  tiles[tile7.position] = tile7;
  tiles[tile8.position] = tile8;
  tiles[tile9.position] = tile9;
  tiles[tile10.position] = tile10;
  tiles[tile11.position] = tile11;
  tiles[tile12.position] = tile12;
  tiles[tile13.position] = tile13;
  tiles[tile14.position] = tile14;
  tiles[tile15.position] = tile15;

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
    case "endGame":
      return { ...state, currentGameState: action.payload };
    case "restartGame":
      return {
        ...initBoardState(action.payload),
        boardSize: action.payload,
        currentGameState: "Playing",
        currentScore: 0,
        currentlyMovingTiles: false,
      };
    case "wonGame":
      return { ...state, currentGameState: action.payload };
    default:
      throw Error("Unknown action type");
  }
}
