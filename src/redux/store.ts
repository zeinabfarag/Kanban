import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice";
import { BoardState } from "../types";

const store = configureStore({
  reducer: {
    board: boardReducer,
  },
});

export default store;

export interface RootState {
  board: BoardState;
}
