import React from 'react';
import './App.css';
import { Counter } from './features/counter/Counter';

function App() {
  return (
    <>
      <h1 className="text-3xl font-bold underline text-red-600">
        Simple React Typescript Tailwind Sample
      </h1>
      <Counter />
    </>
  );
}

export default App;
