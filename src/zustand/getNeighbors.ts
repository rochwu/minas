import {Id, State, Identifier} from './types';

export const getNeighbors = ([x, y]: Identifier): Identifier[] => {
  // TODO: Maybe a randomizer instead of a predefined pattern of expansion?

  const inner: Identifier[] = [
    [x - 1, y],
    [x, y + 1],
    [x + 1, y],
    [x, y - 1],
  ];

  const outer: Identifier[] = [
    [x + 1, y - 1],
    [x + 1, y + 1],
    [x - 1, y - 1],
    [x - 1, y + 1],
  ];

  return inner.concat(outer);
};

export const neighborSelector = (identifier: Identifier) => (state: State) => {
  const identifiers = getNeighbors(identifier);

  const field = state.field;

  return identifiers.reduce<Id[]>((result, [x, y]) => {
    const id = field?.[x]?.[y];

    if (id) {
      result.push(id);
    }

    return result;
  }, []);
};
