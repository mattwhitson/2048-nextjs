import { v4 as uuidv4 } from "uuid";

export interface TileState {
  id: string;
  value: number;
  position: number;
  hasChanged: boolean;
}

export interface BoardState {
  boardSize: number;
  tiles: TileState[];
  currentGameState: "Lost" | "Won" | "Playing";
  currentScore: number;
}

interface ResizeBoard {
  type: "resizeBoard";
  payload: number;
}

interface UpdateTiles {
  type: "updateGameState";
  payload: { tiles: TileState[]; points: number };
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
  boardSize: 4,
  tiles: initBoardState(4),
  currentGameState: "Playing",
  currentScore: 0,
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

  return tiles;
}

export function initTiles(dimensions: number) {
  const tiles = new Array(dimensions * dimensions);

  for (let i = 0; i < dimensions * dimensions; i++) {
    tiles[i] = generateNewTile(i, -1);
  }

  return tiles;
}

export function generateNewTile(position: number, value?: number) {
  return {
    id: uuidv4(),
    value: value ? value : Math.random() > 0.1 ? 2 : 4,
    position,
    hasChanged: false,
  };
}

export function boardReducer(state: BoardState, action: BoardActions) {
  switch (action.type) {
    case "resizeBoard":
      return { ...state, boardSize: action.payload };
    case "updateGameState":
      return {
        ...state,
        tiles: action.payload.tiles,
        currentScore: state.currentScore + action.payload.points,
      };
    case "endGame":
      return { ...state, currentGameState: action.payload };
    case "restartGame":
      return {
        boardSize: action.payload,
        tiles: initBoardState(action.payload),
        currentGameState: "Playing",
        currentScore: 0,
      };
    case "wonGame":
      return { ...state, currentGameState: action.payload };
    default:
      throw Error("Unknown action type");
  }
}
