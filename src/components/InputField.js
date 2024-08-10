import React from 'react';

const InputField = ({ userInput, setUserInput, handleStartTyping }) => {
    const handleChange = (e) => {
        const { value } = e.target;
        setUserInput(value);
    };

    return (
        // <textarea
        <input
            type="text"
            value={userInput}
            onChange={handleChange}
            className="input-field"
            autoFocus
        />
    );
};

export default InputField;
