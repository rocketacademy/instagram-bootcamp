import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import "./index.css";
import App from "./App";

const fontScale = 1.25;
const theme = {
  fontSizes: {
    xs: `calc(0.75rem * ${fontScale})`,
    sm: `calc(0.875rem * ${fontScale})`,
    md: `calc(1rem * ${fontScale})`,
    lg: `calc(1.125rem * ${fontScale})`,
    xl: `calc(1.25rem * ${fontScale})`,
  },
  headings: {
    sizes: { h1: { fontSize: `calc(2.125rem * ${fontScale})` } },
  },
  primaryColor: "teal",
};

function Root() {
  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <App />
    </MantineProvider>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Root />);
