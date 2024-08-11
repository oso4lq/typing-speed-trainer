import React from 'react';
import styled from 'styled-components';

const TextDisplay = ({ text = '', userInput = '' }) => {

    return (
        <TextBox>
            {text.split('').map((char, index) => {
                let style = {};
                if (index < userInput.length) {
                    style = char === userInput[index] ? { color: 'var(--second-color)' } : { color: 'var(--alert-color)' };
                }
                return (
                    <span key={index} style={style}>
                        {char}
                    </span>
                );
            })}
        </TextBox>
    );
};

const TextBox = styled.div`
    font-size: 24px;
    line-height: 48px;
    margin: 0 10%;
    position: relative;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;

    @media (max-width: 600px) {
        font-size: 20px;
        line-height: 32px;
    }
`;

export default TextDisplay;
