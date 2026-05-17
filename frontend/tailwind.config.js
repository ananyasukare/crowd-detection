module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Government Website Colors
        primary: '#1B4965',      // Navy Blue
        secondary: '#D4AF37',    // Gold
        accent: '#F4D03F',       // Light Gold
        
        // Extended Government Color Palette
        govt: {
          navy: '#1B4965',       // Primary Navy
          darkBlue: '#003366',   // Dark Blue
          lightBlue: '#4A90E2',  // Light Blue
          gold: '#D4AF37',       // Gold Accent
          cream: '#F5F5DC',      // Cream/Off-White
          lightGray: '#F0F0F0',  // Light Gray
          darkGray: '#333333',   // Dark Gray
          white: '#FFFFFF',      // White
          border: '#CCCCCC',     // Border Gray
          success: '#2D5016',    // Dark Green
          warning: '#B8860B',    // Dark Goldenrod
          danger: '#8B0000',     // Dark Red
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        serif: ['Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}
