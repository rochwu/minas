export type Identifier = [number, number];

export enum Status {
  Unopened,
  Opened,
  Flagged,
  Wrong,
}

export type Entry = {
  contains: number;
  status: Status;
};

export type Field = Entry[][];
