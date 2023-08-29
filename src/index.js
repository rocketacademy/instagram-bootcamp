import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider, useMantineTheme } from "@mantine/core";
import "./index.css";
import App from "./App";

const theme = {
  fontSizes: {
    xs: "0.75rem",
    sm: "0.875rem",
    md: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
  },
  primaryColor: "teal",
};

function Root() {
  const theme = useMantineTheme();
  console.log(theme.fontFamily);
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
