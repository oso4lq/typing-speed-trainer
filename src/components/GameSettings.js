import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setGameType, setGameTime, setWordCount, setIncludePunctuation, setIncludeNumbers, setLanguage } from '../slices/gameSlice';
import styled from 'styled-components';

const GameSettings = () => {
    const dispatch = useDispatch();
    const { gameType, gameTime, wordCount, includePunctuation, includeNumbers, language, isGameStarted } = useSelector((state) => state.game);

    return (
        <SettingsContainer>
            {/* Game Type */}
            <Selector>
                <span>Game type:</span>
                <div>
                    <input type="radio" value="time" checked={gameType === 'time'} onChange={() => dispatch(setGameType('time'))} disabled={isGameStarted} />
                    <input type="radio" value="words" checked={gameType === 'words'} onChange={() => dispatch(setGameType('words'))} disabled={isGameStarted} />
                    <input type="radio" value="quote" checked={gameType === 'quote'} onChange={() => dispatch(setGameType('quote'))} disabled={isGameStarted} />
                </div>
            </Selector>

            {/* Timer Duration */}
            {gameType === 'time' && (
                <Selector>
                    <span>Countdown timer:</span>
                    <div>
                        <input type="radio" value={15} checked={gameTime === 15} onChange={() => dispatch(setGameTime(15))} disabled={isGameStarted} />
                        <input type="radio" value={30} checked={gameTime === 30} onChange={() => dispatch(setGameTime(30))} disabled={isGameStarted} />
                        <input type="radio" value={60} checked={gameTime === 60} onChange={() => dispatch(setGameTime(60))} disabled={isGameStarted} />
                        <input type="radio" value={120} checked={gameTime === 120} onChange={() => dispatch(setGameTime(120))} disabled={isGameStarted} />
                    </div>
                </Selector>
            )}

            {/* Word Count */}
            {gameType === 'words' && (
                <Selector>
                    <span>Word number:</span>
                    <div>
                        <input type="radio" value={10} checked={wordCount === 10} onChange={() => dispatch(setWordCount(10))} disabled={isGameStarted} />
                        <input type="radio" value={25} checked={wordCount === 25} onChange={() => dispatch(setWordCount(25))} disabled={isGameStarted} />
                        <input type="radio" value={50} checked={wordCount === 50} onChange={() => dispatch(setWordCount(50))} disabled={isGameStarted} />
                        <input type="radio" value={100} checked={wordCount === 100} onChange={() => dispatch(setWordCount(100))} disabled={isGameStarted} />
                    </div>
                </Selector>
            )}

            {/* Extra Symbols */}
            {gameType !== 'quote' && (
                <Selector>
                    <span>Add extra symbols:</span>
                    <div>
                        <input type="checkbox" checked={includePunctuation} onChange={() => dispatch(setIncludePunctuation(!includePunctuation))} disabled={isGameStarted} />
                        <input type="checkbox" checked={includeNumbers} onChange={() => dispatch(setIncludeNumbers(!includeNumbers))} disabled={isGameStarted} />
                    </div>
                </Selector>
            )}

            {/* Language Selection */}
            <Selector>
                <span>Language:</span>
                <select value={language} onChange={(e) => dispatch(setLanguage(e.target.value))} disabled={isGameStarted}>
                    <option value="ENG">English</option>
                    <option value="CZE">Czech</option>
                    <option value="RUS">Russian</option>
                </select>
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
  margin-bottom: 20px;
`;

const Selector = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default GameSettings;
