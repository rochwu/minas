import create from 'zustand';
import {combine} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {Identifier} from '../types';
import {lay} from './layer';
import {neighborSelector} from './neighbors';
import {State, Status, Id, Cell} from './types';

const initial: State = {
  byId: {},
  field: undefined,
  clears: 0,
  mines: 0,
  opened: 0,
};

type FilledState = Required<State>;

export const useZustand = create(
  immer(
    combine(initial, (set) => ({
      start: (config: {rows: number; columns: number; difficulty?: number}) =>
        set(() => {
          let id = 0;

          return lay(config).reduce<State>(
            (byRow, fieldRow, index) => {
              return fieldRow.reduce<State>(
                (byCell, value) => {
                  const cell: Cell = {
                    contains: value,
                    status: Status.Unopened,
                  };

                  if (value === 0 && byCell.zero === undefined) {
                    byCell.zero = id;
                  }

                  if (Number.isNaN(value)) {
                    byCell.mines += 1;
                  } else {
                    byCell.clears += 1;
                  }

                  byCell.field![index].push(id);
                  byCell.byId[id] = cell;

                  id += 1;

                  return byCell;
                },
                {
                  ...byRow,
                  field: [...byRow.field!, []],
                },
              );
            },
            {
              byId: {},
              field: [],
              clears: 0,
              mines: 0,
              opened: 0,
            },
          );
        }),
      meet: (identifier: Identifier) => {
        set((state) => {
          const [x, y] = identifier;

          const id = state.field![x][y];

          const adjacentIds = neighborSelector(identifier)(state);

          state.byId[id].neighbors = adjacentIds;
        });
      },
      open: (...ids: Id[]) => {
        set((state) => {
          const open = (id: Id) => {
            const cell = state.byId[id];

            const status = cell.status;

            if (status === Status.Unopened) {
              cell.status = Status.Opened;
            } else if (
              status === Status.Flagged &&
              !Number.isNaN(cell.contains)
            ) {
              cell.status = Status.Wrong;
            }

            state.opened += 1;
          };

          if (state.opened === 0 && state.byId[ids[0]].contains !== 0) {
            open(state.zero!);
            return;
          }

          ids.forEach(open);
        });
      },
      flag: (id: Id) => {
        set((state) => {
          const cell = state.byId[id];

          const previous = cell.status;

          if (previous === Status.Flagged) {
            cell.status = Status.Unopened;
            return;
          }

          if (previous === Status.Unopened) {
            cell.status = Status.Flagged;
            return;
          }
        });
      },
    })),
  ),
);
