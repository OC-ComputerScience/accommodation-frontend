/**
 * Vuetify3 Plugin
 */
import { createVuetify } from "vuetify";

// Labs


// Misc
import { loadFonts } from "./webfontloader";
loadFonts();

// Styles
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

const myCustomLightTheme = {
  dark: false,
  colors: {
    primary: "#80162B",           //marroon
    sidebar: "#004761",           //deep teal
    button_blue: "#118ACB",       //light teal
    silver: "#D5DFE7",      
    red_links: "#811429",
    yellow_cards: "#F9C634",
    blue: "#196CA2",
    yellow: "#F8C545",
    darkblue: "#032F45",
    
    secondary: "#E1E1E1",
    accent: "#47121D",
    success: "#47121D",
    error: "#EE5044",
    teal: "#63BAC0",
  },
};

const vuetify = createVuetify({

  theme: {
    defaultTheme: "myCustomLightTheme",
    themes: {
      myCustomLightTheme,
    },
  },
  icons: {
    defaultSet: "mdi",
  },
  typography:{
    fontFamily: '"Sofia Sans", sans-serif'
  }
});

export default vuetify;
