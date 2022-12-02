export type Field = number[][];

export enum Status {
  Unopened,
  Opened,
  Flagged,
  Wrong,
}

export type Cell = {
  contains: number; // mines are NaN
  status: Status;
  neighbors?: Id[];
};

export type Id = number;

export type State = {
  byId: Record<Id, Cell>;
  field?: Id[][];
  clears: number;
  mines: number;
  opened: number;
  zero?: Id;
};
