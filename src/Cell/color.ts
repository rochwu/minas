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

export const color = (number: number) => {
  if (number > 0 && number <= 9) {
    return {
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      color: colors[number - 1],
    };
  }
};
