import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        /* warm cream palette (LittleWear-style) */
        cream: {
          DEFAULT: '#FFF9F5',
          mid:     '#FFF2E8',
          dark:    '#FFE6D0',
        },
        coral: {
          DEFAULT: '#F0525A',
          dark:    '#D43D45',
          light:   '#FFF0F0',
          muted:   '#F9B4B8',
        },
        /* category card backgrounds */
        card: {
          beige:   '#FFF6E8',
          pink:    '#FFEEEE',
          blue:    '#EEF5FF',
          lavender:'#F0EEFF',
          mint:    '#EEFAF4',
        },
        /* feature icon circle fills */
        icon: {
          green:  '#68C89A',
          salmon: '#F4A88A',
          yellow: '#F5C958',
          sky:    '#7BB8F0',
          purple: '#B39DDB',
        },
        /* keep pastel for shop/checkout */
        pastel: {
          pink:         '#FFB3C1',
          'pink-light': '#FFF0F5',
          'pink-mid':   '#FFDDE7',
          blue:         '#BFD7FF',
          'blue-light': '#EEF5FF',
          mint:         '#B5EAD7',
          yellow:       '#FFF4B8',
          lavender:     '#E8D5F5',
          peach:        '#FFDAB9',
        },
        brand: {
          pink:      '#EC4899',
          'pink-dark': '#DB2777',
          blue:      '#60A5FA',
          'blue-dark': '#3B82F6',
        },
      },
      fontFamily: {
        prompt: ['Prompt', 'sans-serif'],
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      animation: {
        float:       'float 6s ease-in-out infinite',
        'float-slow':'float 9s ease-in-out infinite',
        'fade-up':   'fadeUp 0.5s ease forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-14px)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
