import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import { AppRoutes } from "./routes"
import { store } from "./app/store";

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </ Provider>
  );
}

export default App;
