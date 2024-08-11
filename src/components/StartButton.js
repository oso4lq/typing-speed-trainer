import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startGame, resetGame } from '../slices/gameSlice';
import styled from 'styled-components';

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
            <Button onClick={handleClick}>
                {isGameComplete ? 'RESTART' : 'START'}
            </Button>
        )
    );
};

const Button = styled.button`
  background: var(--second-color);
  border: none;
  border-radius: 10px;
  color: var(--white-color);
  padding: 12px 24px;
  cursor: pointer;
  font-size: 24px;
  font-weight: bold;
  transition: all 0.3s ease;
`;

export default StartButton;
