import styled from '@emotion/styled';
import React from 'react';
import {Cell} from './Cell';
import {State} from './zustand';

const Grid = styled.div({
  display: 'grid',
});

export const Game: React.FC<{field: NonNullable<State['field']>}> = ({
  field,
}) => {
  return (
    <Grid>
      {field.map((row, x) => {
        return row.map((_, y) => {
          return <Cell key={`${x}${y}`} identifier={[x, y]} />;
        });
      })}
    </Grid>
  );
};
