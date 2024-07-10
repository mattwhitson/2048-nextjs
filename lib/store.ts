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
}

interface InitBoard {
  type: "initBoard";
  payload: BoardState;
}

interface ResizeBoard {
  type: "resizeBoard";
  payload: number;
}

interface InitTiles {
  type: "initTiles";
  payload: TileState[];
}

interface UpdateTiles {
  type: "updateTiles";
  payload: TileState[];
}

export type BoardActions = ResizeBoard | InitTiles | InitBoard | UpdateTiles;

export const defaultBoardState: BoardState = {
  boardSize: 4,
  tiles: initBoardState(4),
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
    case "initTiles":
      return { ...state, tiles: action.payload };
    case "initBoard":
      return { ...state };
    case "updateTiles":
      return { ...state, tiles: action.payload };
    default:
      throw Error("Unknown action type");
  }
}
