import styled from '@emotion/styled';
import React from 'react';

import {Game} from './Game';
import {System} from './System';
import {AppStatus, useZustand} from './zustand';

const Container = styled.div({
  display: 'grid',
  placeItems: 'center',
});

export const App = () => {
  const define = useZustand((state) => state.define);
  const unset = useZustand((state) => state.status === AppStatus.Unset);

  React.useEffect(() => {
    if (unset) {
      define({rows: 40, columns: 40});
    }
  }, []);

  if (unset) {
    return <pre>L O A D I N G . . .</pre>;
  }

  return (
    <>
      <System />
      <Container>
        <Game />
      </Container>
    </>
  );
};
