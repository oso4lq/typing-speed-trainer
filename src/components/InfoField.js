import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const InfoField = () => {
    const { isGameStarted, isGameComplete, gameType, remainingTime, elapsedTime, errorCount, wpm } = useSelector((state) => state.game);

    return (
        <WrapperCol>
            {!isGameStarted && !isGameComplete && (
                <WrapperCol>
                    <MainSpan>Click start to begin</MainSpan>
                    <span>The game will start in 3 seconds</span>
                </WrapperCol>
            )}
            {isGameStarted && !isGameComplete && (
                <WrapperCol>
                    {gameType === 'time' && <MainSpan>Time Remaining: {remainingTime}s</MainSpan>}
                    {(gameType === 'words' || gameType === 'quote') && <MainSpan>Elapsed time: {elapsedTime}s</MainSpan>}
                    <span>Errors: {errorCount}</span>
                </WrapperCol>
            )}
            {isGameComplete && (
                <WrapperCol>
                    <MainSpan>Results</MainSpan>
                    <WrapperRow>
                        <span>WPM: {wpm}</span>
                        <span>Errors: {errorCount}</span>
                        {(gameType === 'words' || gameType === 'quote') && <span>Elapsed time: {elapsedTime}s</span>}
                    </WrapperRow>
                </WrapperCol>
            )}
        </WrapperCol>
    );
};

const WrapperCol = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 10px;
`;

const WrapperRow = styled.span`
    display: flex;
    flex-direction: row;
    gap: 8px;
    margin-bottom: 10px;
`

const MainSpan = styled.span`
    font-size: 28px;
`

export default InfoField;
