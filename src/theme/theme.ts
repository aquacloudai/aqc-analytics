import { createTheme } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

// AquaCloud brand colors from colors.txt
const darkTeal: MantineColorsTuple = [
  '#e6f3f5',
  '#cce6eb',
  '#99d0d7',
  '#66b9c4',
  '#33a3b1',
  '#14859a', // brand primary
  '#10677b',
  '#0c4e5c',
  '#08353d',
  '#081a26'  // darkest brand color
];

const lightTeal: MantineColorsTuple = [
  '#e6f9fb',
  '#ccf2f6',
  '#99e5ed',
  '#66d8e4',
  '#33cbdb',
  '#90d0d7', // brand secondary
  '#73a6ac',
  '#567d81',
  '#395356',
  '#1c2a2b'
];

const brandBlue: MantineColorsTuple = [
  '#e6f0f8',
  '#cce0f1',
  '#99c2e3',
  '#66a3d5',
  '#3385c7',
  '#014059', // brand blue
  '#013347',
  '#012635',
  '#001a23',
  '#000d11'
];

export const theme = createTheme({
  colors: {
    'dark-teal': darkTeal,
    'light-teal': lightTeal,
    'brand-blue': brandBlue,
  },
  primaryColor: 'dark-teal',
  primaryShade: { light: 5, dark: 6 },
  other: {
    brandColors: {
      darkest: '#081a26',
      primary: '#014059', 
      secondary: '#90d0d7',
      white: '#ffffff'
    }
  },
  // Dark theme overrides
  black: '#081a26',
  white: '#ffffff',
});