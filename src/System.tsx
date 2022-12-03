import React from 'react';
import {useZustand} from './zustand';

export const System: React.FC = () => {
  const check = (won: boolean) => {
    if (won) {
      console.log('WON!');
    }
  };

  useZustand.subscribe((state) => state.clears === state.opened, check);

  return <></>;
};
