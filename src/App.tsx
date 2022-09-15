import React from 'react';
import { Provider } from 'react-redux';
import { StyledEngineProvider } from '@mui/material/styles';
import './App.css';
import { AppRoutes } from "./routes"
import { store } from "./app/store";

function App() {
  return (
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <AppRoutes />
      </StyledEngineProvider>
    </ Provider>
  );
}

export default App;
