import React from "react";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import "./App.css";
import theme from "./styles/theme.ts";
import AppRouter from "./routes/index.tsx";
import { AuthProvider } from './contexts/AuthContext.tsx';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Reset CSS a konzisztens megjelenítéshez */}
      <AuthProvider>
      <div className="App">
        <AppRouter />
      </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
