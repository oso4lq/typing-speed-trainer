import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import useTyping from '../hooks/useTyping';
import {
    setRemainingTime, completeGame, updateElapsedTime, decrementCountdown,
    setCountdownComplete, setUserInputArray, incrementErrorCount
} from '../slices/gameSlice';
import TextDisplay from './TextDisplay';
import StartButton from './StartButton';
import Backdrop from './Backdrop';

const GameField = () => {
    const dispatch = useDispatch();
    useTyping(); // Use the hook to generate the text

    const {
        isCountdownComplete,
        isGameStarted,
        countdown,
        text,
        userInputArray = [],
        remainingTime,
        gameType,
    } = useSelector((state) => state.game);

    // Prevent scrolling with space key
    useEffect(() => {
        const preventSpaceScroll = (e) => e.key === ' ' && e.preventDefault();
        window.addEventListener('keydown', preventSpaceScroll);
        return () => window.removeEventListener('keydown', preventSpaceScroll);
    }, []);

    // Handle key presses
    useEffect(() => {
        if (!isGameStarted || !isCountdownComplete) return;

        const handleKeyPress = (e) => {
            const { key } = e;

            if (key === 'Backspace') {
                dispatch(setUserInputArray(userInputArray.slice(0, -1)));
            } else if (key.length === 1) {
                const newInputArray = [...userInputArray, key];
                dispatch(setUserInputArray(newInputArray));

                if (key !== text[newInputArray.length - 1]) {
                    dispatch(incrementErrorCount());
                }

                if (newInputArray.length === text.length && (gameType === 'words' || gameType === 'quote')) {
                    dispatch(completeGame());
                }
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [userInputArray, isGameStarted, isCountdownComplete, dispatch, text, gameType]);

    // Countdown and game timers
    useEffect(() => {
        if (!isGameStarted) return;

        if (countdown > 0) {
            const timer = setTimeout(() => dispatch(decrementCountdown()), 1000);
            return () => clearTimeout(timer);
        }

        if (countdown === 0 && !isCountdownComplete) {
            dispatch(setCountdownComplete());
            if (gameType === 'time') {
                dispatch(setRemainingTime(remainingTime));
            }
        }

        if (isCountdownComplete && gameType === 'time' && remainingTime > 0) {
            const timer = setTimeout(() => dispatch(setRemainingTime(remainingTime - 1)), 1000);
            return () => clearTimeout(timer);
        }

        if (isCountdownComplete && gameType === 'time' && remainingTime === 0) {
            dispatch(completeGame());
        }

        if (isCountdownComplete && (gameType === 'words' || gameType === 'quote')) {
            const timer = setInterval(() => dispatch(updateElapsedTime()), 1000);
            return () => clearInterval(timer);
        }
    }, [countdown, isGameStarted, isCountdownComplete, remainingTime, gameType, dispatch]);

    return (
        <FieldContainer>
            <Backdrop />
            {!isCountdownComplete && isGameStarted && <Countdown>{countdown}</Countdown>}
            <StartButton />
            <TextBox>
                <TextDisplay text={text} userInput={userInputArray.join('')} />
            </TextBox>
        </FieldContainer>
    );
};

const FieldContainer = styled.div`
    height: 200px;
    position: relative;
`;

const Countdown = styled.div`
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;
    font-size: 80px;
    animation: pulse 1s ease-in-out infinite;
`;

const TextBox = styled.div`
    padding: 8px 0;
    height: inherit;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export default GameField;
