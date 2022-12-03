import styled from '@emotion/styled';
import React from 'react';
import shallow from 'zustand/shallow';
import {Cell, Status, useZustand, Identifier} from '../zustand';
import {color} from './color';
import {display} from './display';

type Props = {id: number; cell: Cell; identifier: Identifier};

const Container = styled.div<{
  opened: boolean;
  contains: number;
  interactive: boolean;
}>(
  {
    display: 'grid',
    placeItems: 'center',
    width: 'inherit',
    height: 'inherit',
  },
  ({opened}) => {
    if (opened) {
      return {
        backgroundColor: 'white',
      };
    }
  },
  ({contains}) => color(contains),
  ({interactive}) => {
    if (interactive) {
      return {cursor: 'pointer'};
    }
  },
);

export const Actual: React.FC<Props> = ({identifier, cell, id}) => {
  const [open, flag, getNeighbors] = useZustand(
    (state) => [state.open, state.flag, state.neighbors],
    shallow,
  );

  const neighbors = React.useMemo(() => getNeighbors(identifier), [identifier]);

  const neighborStatus = useZustand(
    ({byId}) => neighbors.map((id) => byId[id].status),
    shallow,
  );

  const {status, contains} = cell;

  const expandable = React.useMemo(() => {
    const flagged = neighborStatus.filter(
      (status) => status === Status.Flagged,
    ).length;

    return flagged >= contains;
  }, [neighborStatus]);

  const opened = status === Status.Opened;

  const interactive = !opened || expandable;

  React.useEffect(() => {
    if (opened && contains === 0) {
      open(...neighbors);
    }
  }, [opened]);

  const click = () => {
    if (opened) {
      if (expandable) {
        open(...neighbors);
      }
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
      interactive={interactive}
      contains={contains}
      opened={opened}
      onClick={click}
      onContextMenu={rightClick}
    >
      {display(cell)}
    </Container>
  );
};
