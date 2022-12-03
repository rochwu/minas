import {Cell, Status} from '../zustand';

export const display = (cell: Cell) => {
  const {status, contains} = cell;

  switch (status) {
    case Status.Opened: {
      return Number.isNaN(contains) ? '💣' : contains || undefined;
    }
    case Status.Flagged: {
      return '⛔';
    }
    case Status.Wrong: {
      return '🙅‍♂️';
    }
  }

  return;
};
