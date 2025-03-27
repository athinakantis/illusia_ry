import { PaletteMode } from "@mui/material";
import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { ReactNode, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";
import { createAppTheme } from "../Theme/theme";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  const themeContext = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
    }),
    [mode]
  );

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  return (
    <ThemeContext.Provider value={themeContext}>
      <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
