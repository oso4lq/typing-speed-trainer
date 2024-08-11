import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';

const Backdrop = () => {
    const { isCountdownComplete, isGameComplete, isGameStarted } = useSelector((state) => state.game);

    if (isCountdownComplete && isGameStarted && !isGameComplete) {
        return null; // No backdrop during the game
    }

    return <StyledBackdrop />;
};

const StyledBackdrop = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    background-color: var(--white-color) 0.3;
    z-index: 5;
`;

export default Backdrop;
