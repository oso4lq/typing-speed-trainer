import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const InfoField = () => {
    const { isGameStarted, isGameComplete, gameType, remainingTime, elapsedTime, errorCount, wpm } = useSelector((state) => state.game);

    return (
        <InfoContainer>
            {!isGameStarted && !isGameComplete && (
                <div>
                    <span>Click start to begin</span>
                    <span>The game will start in 3 seconds</span>
                </div>
            )}
            {isGameStarted && !isGameComplete && (
                <div>
                    {gameType === 'time' && <span>Time Remaining: {remainingTime}s</span>}
                    {(gameType === 'words' || gameType === 'quote') && <span>Elapsed time: {elapsedTime}s</span>}
                    <span>Errors: {errorCount}</span>
                </div>
            )}
            {isGameComplete && (
                <div>
                    <span>Results</span>
                    <div>
                        <span>WPM: {wpm}</span>
                        <span>Errors: {errorCount}</span>
                        {(gameType === 'words' || gameType === 'quote') && <span>Elapsed time: {elapsedTime}s</span>}
                    </div>
                </div>
            )}
        </InfoContainer>
    );
};

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

export default InfoField;
