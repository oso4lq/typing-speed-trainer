import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setGameType, setGameTime, setWordCount, setIncludePunctuation, setIncludeNumbers, setLanguage } from '../slices/gameSlice';

const GameSettings = () => {
    const dispatch = useDispatch();
    const { gameType, gameTime, wordCount, includePunctuation, includeNumbers, language, isGameStarted } = useSelector((state) => state.game);

    return (
        <SettingsContainer>
            {/* Game Type */}
            <Selector>
                <span>Game type:</span>
                <Wrapper>
                    <StyledInput type="radio" value="time" checked={gameType === 'time'} onChange={() => dispatch(setGameType('time'))} disabled={isGameStarted} />
                    <StyledInput type="radio" value="words" checked={gameType === 'words'} onChange={() => dispatch(setGameType('words'))} disabled={isGameStarted} />
                    <StyledInput type="radio" value="quote" checked={gameType === 'quote'} onChange={() => dispatch(setGameType('quote'))} disabled={isGameStarted} />
                </Wrapper>
            </Selector>

            {/* Timer Duration */}
            {gameType === 'time' && (
                <Selector>
                    <span>Countdown timer:</span>
                    <Wrapper>
                        <StyledInput type="radio" value={15} checked={gameTime === 15} onChange={() => dispatch(setGameTime(15))} disabled={isGameStarted} />
                        <StyledInput type="radio" value={30} checked={gameTime === 30} onChange={() => dispatch(setGameTime(30))} disabled={isGameStarted} />
                        <StyledInput type="radio" value={60} checked={gameTime === 60} onChange={() => dispatch(setGameTime(60))} disabled={isGameStarted} />
                        <StyledInput type="radio" value={120} checked={gameTime === 120} onChange={() => dispatch(setGameTime(120))} disabled={isGameStarted} />
                    </Wrapper>
                </Selector>
            )}

            {/* Word Count */}
            {gameType === 'words' && (
                <Selector>
                    <span>Word number:</span>
                    <Wrapper>
                        <StyledInput type="radio" value={10} checked={wordCount === 10} onChange={() => dispatch(setWordCount(10))} disabled={isGameStarted} />
                        <StyledInput type="radio" value={25} checked={wordCount === 25} onChange={() => dispatch(setWordCount(25))} disabled={isGameStarted} />
                        <StyledInput type="radio" value={50} checked={wordCount === 50} onChange={() => dispatch(setGameType('words'))} disabled={isGameStarted} />
                        <StyledInput type="radio" value={100} checked={wordCount === 100} onChange={() => dispatch(setWordCount(100))} disabled={isGameStarted} />
                    </Wrapper>
                </Selector>
            )}

            {/* Extra Symbols */}
            {gameType !== 'quote' && (
                <Selector>
                    <span>Add extra symbols:</span>
                    <Wrapper>
                        <StyledInput type="checkbox" value={'punctuation'} checked={includePunctuation} onChange={() => dispatch(setIncludePunctuation(!includePunctuation))} disabled={isGameStarted} />
                        <StyledInput type="checkbox" value={'numbers'} checked={includeNumbers} onChange={() => dispatch(setIncludeNumbers(!includeNumbers))} disabled={isGameStarted} />
                    </Wrapper>
                </Selector>
            )}

            {/* Language Selection */}
            <Selector>
                <span>Language:</span>
                <StyledSelect value={language} onChange={(e) => dispatch(setLanguage(e.target.value))} disabled={isGameStarted}>
                    <option value="ENG">English</option>
                    <option value="RUS">Русский</option>
                    <option value="CZE">Český</option>
                </StyledSelect>
            </Selector>
        </SettingsContainer>
    );
};

const SettingsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  background: var(--main-color);
  padding: 16px 32px;
  border-radius: 10px;
  gap: 16px;
  margin: 0 20px;
  margin-bottom: 20px;
  justify-content: center;

  @media (max-width: 600px) {
    border-radius: 0;
    width: 100%;
    flex-direction: column;
    align-items: center;
  }
`;

const Selector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
`;

const StyledInput = styled.input`
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background: var(--second-color);
  width: ${({ type }) => (type === 'checkbox' ? '100px' : '60px')};
  height: 40px;
  border-radius: 10px;
  padding: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--white-color);
  font-size: 14px;

  &::before {
    content: attr(value);
    position: absolute;
    color: var(--white-color);
    font-weight: bold;
    font-size: 14px;
  }

  &:hover {
    transform: scale(1.05);
    background: var(--select-color);
  }

  &:checked {
    background: var(--select-color);
  }

  &:disabled {
    background: grey;
    cursor: default;
    color: #ccc;
  }

  &:disabled:hover {
    transform: none;
    background: grey;
  }
`;

const StyledSelect = styled.select`
  background: var(--second-color);
  width: 100px;
  height: 40px;
  border-radius: 10px;
  padding: 10px;
  color: var(--white-color);
  font-weight: bold;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    background: grey;
    cursor: default;
    color: #ccc;
  }
`;

export default GameSettings;
