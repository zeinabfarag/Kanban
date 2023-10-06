export type Id = string | number;

export type Card = {
  id: Id;
  text: string;
  columnId: Id;
  isActive: boolean;
};

export type Column = {
  id: Id;
  title: string;
  isActive: boolean;
};

export type BoardState = {
  columns: Column[];
  cards: Card[];
};
