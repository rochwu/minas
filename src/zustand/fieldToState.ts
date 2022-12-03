import {Status} from './constants';
import {Cell, Field, State, Identifier} from './types';

type PartialState = Required<
  Pick<State, 'byId' | 'field' | 'clears' | 'mines'>
>;

const equals = ([ax, ay]: Identifier, [bx, by]: Identifier) => {
  return ax === bx && ay === by;
};

const createCell = ({
  value,
  identifier,
  center,
}: {
  value: number;
  identifier: Identifier;
  center?: Identifier;
}): Cell => {
  let status = Status.Unopened;

  if (center && equals(identifier, center)) {
    status = Status.Opened;
  }

  return {contains: value, status};
};

export const fieldToState = ({
  field,
  center,
}: {
  field: Field;
  center?: Identifier;
}): PartialState => {
  const initial: PartialState = {
    byId: {},
    field: [],
    clears: 0,
    mines: 0,
  };

  let id = 0;

  return field.reduce<PartialState>((previous, row, x) => {
    previous.field.push([]);

    return row.reduce<PartialState>((next, value, y) => {
      if (Number.isNaN(value)) {
        next.mines += 1;
      } else {
        next.clears += 1;
      }

      next.field![x].push(id);
      next.byId[id] = createCell({value, identifier: [x, y], center});

      id += 1;

      return next;
    }, previous);
  }, initial);
};
