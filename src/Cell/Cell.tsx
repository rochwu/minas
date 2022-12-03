import React from 'react';
import styled from '@emotion/styled';

import {useZustand, Identifier, Status} from '../zustand';

import {Actual} from './Actual';

type Props = {
  identifier: Identifier;
};

const size = '1.5em';

const Container = styled.div<Props>(
  {
    position: 'relative',
    width: size,
    height: size,
    border: '1px solid black',
    fontSize: size,
    ':hover': {
      backgroundColor: '#FCF1DD',
    },
    backgroundColor: '#D5D5D5',
    boxSizing: 'border-box',
    userSelect: 'none',
  },
  ({identifier: [x, y]}) => {
    return {
      gridRow: x + 1,
      gridColumn: y + 1,
    };
  },
);

const NotStarted = styled(Container)({
  cursor: 'pointer',
});

export const Cell: React.FC<Props> = ({identifier}) => {
  const [x, y] = identifier;

  const start = useZustand(({start}) => start);

  const id = useZustand(({field}) => field?.[x]?.[y]);
  const cell = useZustand(({byId}) =>
    id !== undefined ? byId[id] : undefined,
  );

  const ready = id !== undefined && cell !== undefined;

  if (ready) {
    return (
      <Container identifier={identifier}>
        <Actual identifier={identifier} id={id} cell={cell} />
      </Container>
    );
  }

  const click = () => {
    start(identifier);
  };

  return <NotStarted identifier={identifier} onClick={click} />;
};
