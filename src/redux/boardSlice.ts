import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Card, Column, BoardState, Id } from "../types";

const initialState: BoardState = {
  columns: [
    { id: 1, title: "To Do", isActive: false },
    {
      id: 2,
      title: "In Progress",
      isActive: false,
    },
    {
      id: 3,
      title: "Review",
      isActive: false,
    },

    {
      id: 4,
      title: "Done",
      isActive: false,
    },
  ],
  cards: [],
};

const generateId = () => {
  return Date.now().toString();
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    addColumn: (state) => {
      const newColumn: Column = {
        id: generateId(),
        title: `Column ${state.columns.length + 1}`,
        isActive: false,
      };
      state.columns.push(newColumn);
    },

    editColumn: (state, action: PayloadAction<{ id: Id; title: string }>) => {
      const { id, title } = action.payload;
      const column = state.columns.find((col) => col.id === id);
      if (column) {
        column.title = title;
      }
    },

    deleteColumn: (state, action: PayloadAction<{ id: Id }>) => {
      const { id } = action.payload;
      state.columns = state.columns.filter((col) => col.id !== id);
      state.cards = state.cards.filter((card) => card.columnId !== id);
    },

    setActiveColumn: (state, action: PayloadAction<{ id: Id }>) => {
      const { id } = action.payload;
      const column = state.columns.find((col) => col.id === id);

      if (column) {
        column.isActive = true;
        state.columns.forEach((col) => {
          if (col.id !== id) {
            col.isActive = false;
          }
        });
      }
    },

    setColumns: (
      state,
      action: PayloadAction<{ columns: BoardState["columns"] }>
    ) => {
      const { columns } = action.payload;
      state.columns = columns;
    },

    addCard: (state, action: PayloadAction<{ columnId: Id }>) => {
      const { columnId } = action.payload;
      const column = state.columns.find((col) => col.id === columnId);
      if (column) {
        const newCard: Card = {
          id: generateId(),
          text: `Task ${state.cards.length + 1}`,
          columnId,
          isActive: false,
        };
        state.cards.push(newCard);
      }
    },

    editCard: (state, action: PayloadAction<{ id: Id; text: string }>) => {
      const { id, text } = action.payload;
      const card = state.cards.find((c) => c.id === id);

      if (card) {
        card.text = text;
      }
    },

    deleteCard: (state, action: PayloadAction<{ id: Id }>) => {
      const { id } = action.payload;
      state.cards = state.cards.filter((card) => card.id !== id);
    },
    setCards: (
      state,
      action: PayloadAction<{ cards: BoardState["cards"] }>
    ) => {
      const { cards } = action.payload;
      state.cards = cards;
    },
    setActiveCard: (state, action: PayloadAction<{ id: Id }>) => {
      const { id } = action.payload;
      const card = state.cards.find((card) => card.id === id);

      if (card) {
        card.isActive = true;
        state.cards.forEach((card) => {
          if (card.id !== id) {
            card.isActive = false;
          }
        });
      }
    },
    moveCard: (
      state,
      action: PayloadAction<{
        cardId: Id;
        targetColumnId: Id;
        targetIndex: number;
      }>
    ) => {
      const { cardId, targetColumnId, targetIndex } = action.payload;
      const sourceIndex = state.cards.findIndex((card) => card.id === cardId);
      const draggedCard = {
        ...state.cards[sourceIndex],
        columnId: targetColumnId,
      };

      state.cards.splice(sourceIndex, 1);
      state.cards.splice(targetIndex, 0, draggedCard);
    },

    deactivate: (state) => {
      state.cards.forEach((card) => {
        card.isActive = false;
      });
      state.columns.forEach((column) => {
        column.isActive = false;
      });
    },
  },
});

export const {
  addColumn,
  editColumn,
  deleteColumn,
  setActiveColumn,
  setColumns,
  addCard,
  editCard,
  deleteCard,
  setCards,
  setActiveCard,
  moveCard,
  deactivate,
} = boardSlice.actions;

export default boardSlice.reducer;
