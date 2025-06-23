import { MantineTheme, createTheme } from '@mantine/core';

export const theme: MantineTheme = createTheme({
  colors: {
    'aqua-blue': [
      '#e6f7ff',
      '#b3ebff',
      '#80dfff',
      '#4dd2ff',
      '#1ac6ff',
      '#00b4e6',
      '#0091b3',
      '#006d80',
      '#004a4d',
      '#00261a'
    ],
    'dark-teal': [
      '#e6f2f0',
      '#bfdddb',
      '#99c8c5',
      '#72b3af',
      '#4c9e99',
      '#35a388',
      '#2c8c76',
      '#247563',
      '#1b5e51',
      '#13473e'
    ]
  },
  primaryColor: 'aqua-blue',
  fontFamily: 'Inter, system-ui, sans-serif',
});