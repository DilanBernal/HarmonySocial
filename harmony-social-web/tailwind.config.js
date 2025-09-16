module.exports = {
  darkMode: 'class',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'harmony-bg': '#0a1124',
        'harmony-blue': '#2563eb',
        'harmony-blue-light': '#60a5fa',
        'harmony-card': '#1e293b',
        'harmony-accent': '#38bdf8',
      },
    },
  },
  plugins: [],
};
