/** @type {import('tailwindcss').Config} */
export default {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
      extend: {
        animation: {
          'spin-slow': 'spin 3s linear infinite',
          'bounce-slow': 'bounce 2s infinite',
          'pulse-slow': 'pulse 3s infinite',
        }
      },
    },
    
    plugins: [],
  };
  