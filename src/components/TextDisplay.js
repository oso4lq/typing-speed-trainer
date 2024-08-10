import React from 'react';

const TextDisplay = ({ text, userInput }) => {
    return (
        <div className="text-display">
            {text.split('').map((char, index) => {
                let style = {};
                if (index < userInput.length) {
                    style = char === userInput[index] ? { color: 'green' } : { color: 'red' };
                }
                return (
                    <span key={index} style={style}>
                        {char}
                    </span>
                );
            })}
        </div>
    );
};

export default TextDisplay;
