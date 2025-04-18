const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
    fontSize: {
      ...defaultTheme.fontSize,
      xs: ['.75rem', { lineHeight: '1.25rem' }], // Small text 12px
      sm: ['.875rem', { lineHeight: '1.375rem' }], // Small text 12px
      base: ['.875rem', { lineHeight: '1.5rem' }], // 16px
      lg: ['1rem', { lineHeight: '1.5rem' }], // 16px,
      'head-7': ['.75rem', { lineHeight: '1.1875rem' }], // Heading 7 14px
      'head-6': ['1rem', { lineHeight: '1.3125rem' }], // Heading 6 16px
      'head-5': ['1.5rem', { lineHeight: '2rem' }], // Heading 5 24px
      'head-4': ['1.75rem', { lineHeight: '2.0625rem' }], // Heading 4 28px
      'head-3': ['2rem', { lineHeight: '2.5rem' }], // Heading 3 32px
      'head-2': ['2.375rem', { lineHeight: '2.5rem' }], // Heading 2 38px
      'head-1': ['2.625rem', { lineHeight: '2.5rem' }] // Heading 1 42px
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: {
        SIDEBAR: '#161922',
        DEFAULT: '#072245',
        50: '#DBDFE1',
        100: '#E3E7EB',
        200: '#E6E6E8',
        250: '#F7F8F8',
        300: '#F3F5F8',
        400: '#CFD6E4',
        500: '#717C8D',
        600: '#617296',
        700: '#072245',
        800: '#000000'
      },
      red: {
        DEFAULT: '#F84259',
        ...colors.red
      },
      green: {
        DEFAULT: '#268334',
        hover: '#1C7029',
        ...colors.green
      },
      white: colors.white,
      info: {
        DEFAULT: '#0363C2',
        ...colors.blue
      },
      warning: {
        DEFAULT: '#FF9800',
        ...colors.yellow
      },
      success: {
        DEFAULT: '#268334',
        ...colors.green
      },
      danger: {
        DEFAULT: '#F54F64',
        ...colors.red
      },
      primary: {
        DEFAULT: '#268334',
        HOVER: '#1C7029'
      }
    }
  },
  plugins: [],
  corePlugins: {
    preflight: false
  },
}

