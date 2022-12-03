import styled from '@emotion/styled';
import React from 'react';
import shallow from 'zustand/shallow';
import {Cell} from './Cell/Cell';
import {useZustand, Identifier} from './zustand';

const Grid = styled.div({
  display: 'grid',
});

export const Game: React.FC = () => {
  // field cannot be undefined at this point
  const dimensions = useZustand(({rows, columns}) => [rows, columns], shallow);

  const [rows, columns] = React.useMemo(() => {
    return dimensions.map((size) => Array.from({length: size}));
  }, [dimensions]);

  return (
    <Grid>
      {rows.map((_row, x) => {
        return columns.map((_column, y) => {
          const identifier: Identifier = [x, y];

          return <Cell key={identifier.toString()} identifier={identifier} />;
        });
      })}
    </Grid>
  );
};
