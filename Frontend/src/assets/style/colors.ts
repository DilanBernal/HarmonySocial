import ColorsContainer from '../../core/types/colorsContainer';

const defaultColors: ColorsContainer = {
  background: '#0b0c16',
  lightBackground: '#272a4dff',
  borderDark: '#242b37',
};

export const postColors: ColorsContainer = {
  background: '#171b23',
  border: defaultColors.borderDark,
};

Object.freeze(defaultColors);

export default defaultColors;
