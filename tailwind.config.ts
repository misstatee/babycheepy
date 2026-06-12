import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        pastel: {
          pink:    '#FFB3C1',
          'pink-light': '#FFF0F5',
          'pink-mid':   '#FFDDE7',
          blue:    '#BFD7FF',
          'blue-light': '#EEF5FF',
          mint:    '#B5EAD7',
          yellow:  '#FFF4B8',
          lavender:'#E8D5F5',
          peach:   '#FFDAB9',
        },
        brand: {
          pink:    '#EC4899',
          'pink-dark': '#DB2777',
          blue:    '#60A5FA',
          'blue-dark': '#3B82F6',
        },
      },
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
