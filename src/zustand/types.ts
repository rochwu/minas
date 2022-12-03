import {AppStatus, Status} from './constants';

export type Field = number[][];

export type Identifier = [number, number];

export type Cell = {
  contains: number; // mines are NaN
  status: Status;
  neighbors?: Id[];
};

export type Id = number;

type Stats = {
  clears: number;
  mines: number;
  opened: number;
};

type Settings = {
  rows: number;
  columns: number;
  difficulty: number; // [0, 1] percentage of mines
};

export type State = Stats &
  Settings & {
    byId: Record<Id, Cell>;
    field?: Id[][];
    status: AppStatus;
  };
