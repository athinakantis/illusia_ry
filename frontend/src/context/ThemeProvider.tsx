import { ThemeProvider as MUIThemeProvider } from "@mui/material/styles";
import { ReactNode } from "react";
import { createAppTheme } from "../theme/theme";

interface Props {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: Props) => {
  const theme = createAppTheme()

  return (
    <MUIThemeProvider theme={theme}>{children}</MUIThemeProvider>
  );
};
