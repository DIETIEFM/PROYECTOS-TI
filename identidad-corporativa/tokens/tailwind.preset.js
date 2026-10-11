// Excellence Freights — preset de Tailwind CSS
// Uso en tailwind.config.js:
//   module.exports = { presets: [require("./identidad-corporativa/tokens/tailwind.preset.js")], ... }
// Clases resultantes: bg-ef-azul, text-ef-amarillo, border-ef-azul-40, font-ef, font-ef-acento, etc.

module.exports = {
  theme: {
    extend: {
      colors: {
        ef: {
          azul:     { DEFAULT: "#0C5B72", 80: "#3D7C8E", 60: "#6D9DAA", 40: "#9EBDC7", 20: "#CEDEE3" },
          amarillo: { DEFAULT: "#FCB64C", 80: "#FDC570", 60: "#FDD394", 40: "#FEE2B7", 20: "#FEF0DB" },
          rojo:     { DEFAULT: "#ED174F", 80: "#F14572", 60: "#F47495", 40: "#F8A2B9", 20: "#FBD1DC" },
          gris:     { DEFAULT: "#919698", 80: "#A7ABAD", 60: "#BDC0C1", 40: "#D3D5D6", 20: "#E9EAEA" },
          turquesa: { DEFAULT: "#00ABCA", 80: "#33BCD5", 60: "#66CDDF", 40: "#99DDEA", 20: "#CCEEF4" },
        },
      },
      fontFamily: {
        ef: ["Bw Modelica", "BwModelica", "Montserrat", "Helvetica Neue", "Arial", "sans-serif"],
        "ef-acento": ["Acumin Variable Concept", "Acumin Pro Condensed", "Barlow Condensed", "Roboto Condensed", "Arial Narrow", "sans-serif"],
      },
    },
  },
};
