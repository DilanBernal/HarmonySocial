import ColorsContainer from '../../types/colorsContainer';

const defaultColors: ColorsContainer = {
  background: '#0b0c16',
  borderDark: '#242b37',
};

export const postColors: ColorsContainer = {
  background: '#171b23',
  border: defaultColors.borderDark,
};

Object.freeze(defaultColors);

export default defaultColors;
