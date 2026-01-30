/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#734ede',
        'primary-light': 'rgba(115, 78, 222, 0.8)',
        dark: {
          bg: '#101010',
          card: 'rgba(242, 223, 223, 0.1)',
          border: 'rgba(255, 255, 255, 0.3)',
        },
        light: {
          bg: '#ffffff',
          card: 'rgba(63, 58, 58, 0.1)',
          border: 'rgba(0, 0, 0, 0.3)',
        },
        user: {
          red: '#E53935',
          green: '#7CB342',
          blue: '#1E88E5',
          gray: '#9E9E9E',
        }
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '30px',
        '5xl': '50px',
        '6xl': '80px',
        'full': '100px',
      },
      borderWidth: {
        '5': '5px',
      }
    },
  },
  plugins: [],
}
