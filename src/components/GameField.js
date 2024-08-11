import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';
import TextDisplay from './TextDisplay';
import useTyping from '../hooks/useTyping';
import { setRemainingTime, completeGame, updateElapsedTime, decrementCountdown, setCountdownComplete, setUserInputArray, incrementErrorCount } from '../slices/gameSlice';
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
        const preventSpaceScroll = (e) => {
            if (e.key === ' ') {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', preventSpaceScroll);

        return () => {
            window.removeEventListener('keydown', preventSpaceScroll);
        };
    }, []);

    // Event listener for key presses
    useEffect(() => {
        const handleKeyPress = (e) => {
            if (!isCountdownComplete || !isGameStarted) return;

            const { key } = e;

            if (key === 'Backspace') {
                dispatch(setUserInputArray(userInputArray.slice(0, -1)));
            } else if (key.length === 1) {
                const newInputArray = [...userInputArray, key];
                dispatch(setUserInputArray(newInputArray));

                // Check if the typed character matches the corresponding character in the generated text
                if (key !== text[newInputArray.length - 1]) {
                    dispatch(incrementErrorCount());
                }

                // Check if the user has completed typing all the words
                if (newInputArray.length === text.length && (gameType === 'words' || gameType === 'quote')) {
                    dispatch(completeGame());
                }
            }
        };

        if (isGameStarted) {
            window.addEventListener('keydown', handleKeyPress);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [userInputArray, isGameStarted, isCountdownComplete, dispatch, text, gameType]);

    useEffect(() => {
        if (isGameStarted && countdown > 0) {
            const timer = setTimeout(() => dispatch(decrementCountdown()), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && !isCountdownComplete) {
            dispatch(setCountdownComplete());
            if (gameType === 'time') {
                dispatch(setRemainingTime(remainingTime));
            }
        }
    }, [countdown, isGameStarted, isCountdownComplete, dispatch, remainingTime, gameType]);

    useEffect(() => {
        if (isCountdownComplete && isGameStarted && gameType === 'time' && remainingTime > 0) {
            const timer = setTimeout(() => dispatch(setRemainingTime(remainingTime - 1)), 1000);
            return () => clearTimeout(timer);
        } else if (isCountdownComplete && isGameStarted && gameType === 'time' && remainingTime === 0) {
            dispatch(completeGame());
        }
    }, [remainingTime, isGameStarted, isCountdownComplete, gameType, dispatch]);

    useEffect(() => {
        let timer;
        if (isCountdownComplete && isGameStarted && (gameType === 'words' || gameType === 'quote')) {
            timer = setInterval(() => {
                dispatch(updateElapsedTime());
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isGameStarted, isCountdownComplete, gameType, dispatch]);

    return (
        <FieldContainer>
            <Backdrop />
            {!isCountdownComplete && isGameStarted && (
                <Countdown>{countdown}</Countdown>
            )}
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
    height: inherit;
    overflow: auto;

    &::-webkit-scrollbar {
        display: none;
    }
`;

export default GameField;
