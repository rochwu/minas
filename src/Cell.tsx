import React from 'react';
import styled from '@emotion/styled';
import {Identifier, Status} from './types';

import {useZustand} from './zustand';
import shallow from 'zustand/shallow';

type Props = {
  identifier: Identifier;
};

const size = '1.5em';

const colors = [
  '#0000ff',
  '#008100',
  '#ff1300',
  '#000083',
  '#810500',
  '#2a9494',
  '#000000',
  '#808080',
];

const Container = styled.div<Props & {opened: boolean; contains: number}>(
  {
    display: 'grid',
    placeItems: 'center',
    width: size,
    height: size,
    border: '1px solid black',
    fontSize: '1.5em',
    userSelect: 'none',
    ':hover': {
      backgroundColor: '#FCF1DD',
    },
  },
  ({identifier: [x, y]}) => {
    return {
      gridRow: x + 1,
      gridColumn: y + 1,
    };
  },
  ({opened}) => {
    if (!opened) {
      return {
        backgroundColor: '#D5D5D5',
      };
    }
  },
  ({contains}) => {
    if (contains > 0 && contains <= 9) {
      return {
        fontFamily: 'Verdana',
        fontWeight: 'bold',
        color: colors[contains - 1],
      };
    }
  },
);

//
export const Cell: React.FC<Props> = ({identifier}) => {
  const [x, y] = identifier;

  const id = useZustand((state) => state.field![x][y]);

  const cell = useZustand((state) => state.byId[id]);

  const neighbors = useZustand((state) => state.byId[id].neighbors);

  const meet = useZustand((state) => state.meet);

  React.useEffect(() => {
    if (!neighbors) {
      meet(identifier);
    }
  }, [neighbors]);

  const [open, flag] = useZustand((state) => [state.open, state.flag], shallow);

  const {status, contains} = cell;

  let display;
  switch (status) {
    case Status.Opened: {
      display = Number.isNaN(contains) ? '💣' : contains || undefined;
      break;
    }
    case Status.Flagged: {
      display = '⛔';
      break;
    }
    case Status.Wrong: {
      display = '🙅‍♂️';
      break;
    }
  }

  const opened = status !== Status.Unopened;

  React.useEffect(() => {
    if (status === Status.Opened && contains === 0) {
      open(...neighbors!);
    }
  }, [status]);

  const click = () => {
    if (status === Status.Opened) {
      open(...neighbors!);
    } else {
      open(id);
    }
  };

  const rightClick: React.MouseEventHandler<Element> = (event) => {
    event.preventDefault(); // Don't open context menu

    flag(id);
  };

  return (
    <Container
      contains={contains}
      opened={opened}
      onClick={click}
      onContextMenu={rightClick}
      identifier={identifier}
    >
      {display}
    </Container>
  );
};
