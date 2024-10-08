import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { startGame, resetGame } from '../slices/gameSlice';

const StartButton = () => {
    const dispatch = useDispatch();
    const { isGameStarted, isGameComplete } = useSelector((state) => state.game);

    const handleClick = () => {
        if (isGameComplete) {
            dispatch(resetGame());
        } else {
            dispatch(startGame());
        }
    };

    return (
        !isGameStarted && (
            <StyledButton restart={isGameComplete} onClick={handleClick}>
                {isGameComplete ? 'RESTART' : 'START'}
            </StyledButton>
        )
    );
};

const StyledButton = styled.button.withConfig({
    shouldForwardProp: (prop) => prop !== 'restart',
})`
    background: var(--second-color);
    border: none;
    border-radius: 10px;
    color: var(--white-color);
    padding: 12px 24px;
    cursor: pointer;
    font-size: 24px;
    font-weight: bold;
    transition: all 0.3s ease;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 20;

    ${({ restart }) =>
        !restart &&
        `
        @media (max-width: 600px) {
            position: unset;
            transform: none;
        }
    `}
`;

export default StartButton;
