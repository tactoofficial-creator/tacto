/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        charcoal: {
          DEFAULT: '#1A1A1A',
          50: '#F5F5F3',
          100: '#EBEBEB',
          200: '#D4D4D4',
          300: '#ABABAB',
          400: '#737373',
          500: '#4A4A4A',
          600: '#2E2E2E',
          700: '#1A1A1A',
        },
        sage: {
          DEFAULT: '#4A7C6F',
          light: '#5E9082',
          dark: '#3A6259',
          50: '#F0F5F4',
          100: '#D8ECEB',
          200: '#B0D8D4',
          300: '#7DBFB8',
          400: '#5E9082',
          500: '#4A7C6F',
          600: '#3A6259',
          700: '#2D4E48',
        },
        warm: {
          DEFAULT: '#F5F5F3',
          50: '#FAFAF9',
          100: '#F5F5F3',
          200: '#EBEBEB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
      },
      fontSize: {
        xs:      ['12px', { lineHeight: '16px', letterSpacing: '0.02em' }],
        sm:      ['14px', { lineHeight: '20px', letterSpacing: '0.01em' }],
        base:    ['16px', { lineHeight: '24px' }],
        lg:      ['18px', { lineHeight: '28px' }],
        xl:      ['20px', { lineHeight: '28px', letterSpacing: '-0.01em' }],
        '2xl':   ['24px', { lineHeight: '32px', letterSpacing: '-0.02em' }],
        '3xl':   ['30px', { lineHeight: '36px', letterSpacing: '-0.02em' }],
        '4xl':   ['36px', { lineHeight: '40px', letterSpacing: '-0.03em' }],
        '5xl':   ['48px', { lineHeight: '52px', letterSpacing: '-0.04em' }],
        display: ['56px', { lineHeight: '60px', letterSpacing: '-0.04em' }],
      },
      borderRadius: {
        '2xl': '16px',
        '3xl': '24px',
        '4xl': '32px',
      },
      boxShadow: {
        card:       '0 2px 20px rgba(0,0,0,0.06)',
        'card-hover':'0 8px 40px rgba(0,0,0,0.12)',
        modal:      '0 24px 80px rgba(0,0,0,0.16)',
        nav:        '0 -1px 0 rgba(0,0,0,0.06)',
        'inner-top':'inset 0 1px 0 rgba(255,255,255,0.08)',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.34,1.56,0.64,1)',
        smooth: 'cubic-bezier(0.4,0,0.2,1)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      animation: {
        'fade-up':    'fade-up 0.4s cubic-bezier(0.4,0,0.2,1) forwards',
        'fade-in':    'fade-in 0.3s ease forwards',
        'slide-up':   'slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1) forwards',
        shimmer:      'shimmer 1.6s ease-in-out infinite',
      }
    }
  },
  plugins: []
}
