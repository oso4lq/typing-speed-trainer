import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import useScreenWidth from './hooks/useScreenWidth';
import GameSettings from './components/GameSettings';
import InfoField from './components/InfoField';
import GameField from './components/GameField';
import StartButton from './components/StartButton';

const App = () => {
  const { isGameStarted, isGameComplete } = useSelector((state) => state.game);
  const isMobile = useScreenWidth();

  return (
    <AppContainer>
      <Header>Typing Speed Trainer</Header>

      {isMobile ? (
        <>
          {!isGameStarted && !isGameComplete && (
            <>
              <GameSettings />
              <StartButton />
            </>
          )}
          {(isGameStarted || isGameComplete) && (
            <>
              <InfoField />
              <GameField />
            </>
          )}
        </>
      ) : (
        <>
          <GameSettings />
          <InfoField />
          <GameField />
        </>
      )}
    </AppContainer>
  );
};

const AppContainer = styled.div`
  text-align: center;
  color: var(--white-color);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  @media (max-width: 600px) {
    .header {
      font-size: 32px;
    }
  }
`;

const Header = styled.h1`
    font-size: 40px;
    margin: 30px 0;

  @media (max-width: 600px) {
    .header {
      font-size: 32px;
    }
  }
`


export default App;
