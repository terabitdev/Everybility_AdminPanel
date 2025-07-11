/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppinsMedium: ["PoppinsMedium", "sans-serif"],
        poppinsSemiBold: ["PoppinsSemiBold", "sans-serif"],
        poppinsBlack: ["PoppinsBlack", "sans-serif"],
        NunitoSansRegular: ["NunitoSansRegular", "sans-serif"],
        nunitoSansLight: ["NunitoSansLight", "sans-serif"],
        nunitoSansSemiBold: ["NunitoSansSemiBold", "sans-serif"],
        NunitoSansBold: ["NunitoSansBold", "sans-serif"],
        nunitoSansExtraBold: ["NunitoSansExtraBold", "sans-serif"],
        nunitoSansExtraLight: ["NunitoSansExtraLight", "sans-serif"],        
      },
      colors: {
        primaryBlue: "#4880FF",
        secondaryBlue: "#5A8CFF",
        primaryBlack: "#202224",
        primaryGray: "#A6A6A6",
        secondaryGray: "#D8D8D8",
        primaryGreen: "#008767",
        primaryRed: "#DF0404",
      },
    },
  },
  plugins: [],
}
