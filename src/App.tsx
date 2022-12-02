import styled from '@emotion/styled';
import React from 'react';

import {Game} from './Game';
import {useZustand} from './zustand';

const Container = styled.div({
  display: 'grid',
  placeItems: 'center',
});

export const App = () => {
  const field = useZustand((state) => state.field);
  const start = useZustand((state) => state.start);

  React.useEffect(() => {
    start({rows: 30, columns: 20});
  }, []);

  if (!field) {
    return <pre>L O A D I N G . . .</pre>;
  }

  return (
    <Container>
      <Game field={field} />
    </Container>
  );
};
