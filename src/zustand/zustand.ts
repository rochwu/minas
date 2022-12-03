import create from 'zustand';
import {combine, subscribeWithSelector} from 'zustand/middleware';
import {immer} from 'zustand/middleware/immer';
import {fieldToState} from './fieldToState';
import {lay} from './layer';
import {getNeighbors, neighborSelector} from './getNeighbors';
import {State, Id, Identifier} from './types';
import {AppStatus, Status} from './constants';

const initial: State = {
  byId: {},
  field: undefined,
  clears: 0,
  mines: 0,
  opened: 0,
  rows: 0,
  columns: 0,
  status: AppStatus.Unset,
  difficulty: 0.22, // expert
};

export const useZustand = create(
  subscribeWithSelector(
    immer(
      combine(initial, (set, get) => ({
        define: (settings: {
          rows: number;
          columns: number;
          difficulty?: number;
        }) => {
          set({
            ...settings,
            status: AppStatus.Defined,
          });
        },
        start: (center: Identifier) =>
          set((state) => {
            const {rows, columns, difficulty} = state;
            const config = {rows, columns, difficulty, center};

            const field = lay(config);

            const next = fieldToState({field, center});

            return {
              ...next,
              // From the opening move
              opened: 1,
            };
          }),
        open: (...ids: Id[]) => {
          set((state) => {
            const open = (id: Id) => {
              const cell = state.byId[id];

              const {status, contains} = cell;

              const numeric = !Number.isNaN(contains);

              if (status !== Status.Opened && numeric) {
                state.opened += 1;
              }

              if (status === Status.Unopened) {
                cell.status = Status.Opened;
              } else if (status === Status.Flagged && numeric) {
                cell.status = Status.Wrong;
              }
            };

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
        neighbors: (identifier: Identifier) => {
          const field = get().field!;

          const maybeNeighbors = getNeighbors(identifier);

          return maybeNeighbors.reduce<Id[]>((neighbors, [x, y]) => {
            const id = field[x]?.[y];

            if (id !== undefined) {
              neighbors.push(id);
            }

            return neighbors;
          }, []);
        },
      })),
    ),
  ),
);
