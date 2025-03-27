import { PaletteMode } from "@mui/material";
import { createContext } from "react";


export interface ThemeContextType {
    mode: PaletteMode;
    toggleColorMode: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: "light",
  toggleColorMode: () => {},
});

