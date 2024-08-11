import React from 'react';
import GameSettings from './components/GameSettings';
import InfoField from './components/InfoField';
import StartButton from './components/StartButton';
import GameField from './components/GameField';

const App = () => {
  return (
    <div className="app">
      <h1 className="header">Typing Speed Trainer</h1>
      <GameSettings />
      <InfoField />
      <StartButton />
      <GameField />
    </div>
  );
};

export default App;
