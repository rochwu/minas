import {neighbors} from './neighbors';

const expert = 0.22;

type Config = {
  rows: number;
  columns: number;
  difficulty?: number;
};

type Field = number[][];

const random = (max: number) => {
  max = Math.floor(max);
  return Math.floor(Math.random() * max);
};

const mines = ({rows, columns, difficulty = expert}: Config) => {
  const possible = rows * columns;

  return Math.ceil(possible * difficulty);
};

const defaultFill = 0;

const count = ({field, ...id}: {x: number; y: number; field: Field}) => {
  let total = 0;

  neighbors([id.x, id.y]).forEach(([x, y]) => {
    if (Number.isNaN(field[x]?.[y])) {
      total += 1;
    }
  });

  return total;
};

export const fill = (field: Field) => {
  const rows = field.length;
  const columns = field[0].length;

  const filled: Field = field.map((row) => row.slice());

  for (let x = 0; x < rows; x += 1) {
    for (let y = 0; y < columns; y += 1) {
      if (Number.isNaN(field[x][y])) {
        continue;
      }

      filled[x][y] = count({x, y, field});
    }
  }

  return filled;
};

export const lay = ({rows, columns, difficulty}: Config) => {
  const total = mines({rows, columns, difficulty});

  const field: Field = Array.from({length: rows}, () =>
    Array.from({length: columns}, () => defaultFill),
  );

  const rower = () => random(rows);
  const columner = () => random(columns);

  let it = 0;
  while (it < total) {
    const x = rower();
    const y = columner();

    if (field[x][y] === defaultFill) {
      field[x][y] = NaN;

      it += 1;
    }
  }

  return fill(field);
};
