import React, { useState, useEffect } from 'react';
import TextDisplay from './components/TextDisplay';
import InputField from './components/InputField';
import wordsENG from './data/wordsENG.json'; // Import the JSON file with words

const App = () => {
  const [userInput, setUserInput] = useState('');
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isStarted, setIsStarted] = useState(false);
  const [gameTime, setGameTime] = useState(30);
  const [remainingTime, setRemainingTime] = useState(gameTime);

  // Generate random text from the JSON file
  useEffect(() => {
    const generateText = () => {
      const wordCount = Math.floor(gameTime / 2); // Approximate word count based on time
      const randomWords = Array.from({ length: wordCount }, () =>
        wordsENG[Math.floor(Math.random() * wordsENG.length)]
      );
      setText(randomWords.join(' '));
    };
    generateText();
  }, [gameTime]);

  // Handle countdown timer
  useEffect(() => {
    if (remainingTime > 0 && isStarted) {
      const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (remainingTime === 0 && !isComplete) {
      handleGameEnd();
    }
  }, [remainingTime, isStarted, isComplete]);

  const handleStartGame = () => {
    setIsStarted(true);
    setStartTime(Date.now());
    setRemainingTime(gameTime);
  };

  const handleTimeChange = (e) => {
    setGameTime(Number(e.target.value));
    setRemainingTime(Number(e.target.value));
  };

  useEffect(() => {
    if (userInput.length === text.length && remainingTime > 0) {
      handleGameEnd();
    }
  }, [userInput]);

  const handleGameEnd = () => {
    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // time in minutes
    const correctChars = userInput.split('').filter((char, index) => char === text[index]).length;
    const words = correctChars / 5;
    setWpm(Math.round(words / elapsedTime));

    const errors = userInput.split('').filter((char, index) => char !== text[index]).length;
    setErrorCount(errors);

    setIsComplete(true);
    setIsStarted(false);
  };

  const handleReset = () => {
    setUserInput('');
    setStartTime(null);
    setWpm(0);
    setErrorCount(0);
    setIsComplete(false);
    setIsStarted(false);
    setRemainingTime(gameTime);
  };

  return (
    <div className="w-100 flex-col app">
      <h1 className="flex-row">Typing Speed Trainer</h1>
      <div className="game-settings">
        <button onClick={handleStartGame} disabled={isStarted || isComplete}>Start</button>
        <div className="time-selection">
          <label>
            <input type="radio" value={15} checked={gameTime === 15} onChange={handleTimeChange} />
            15 seconds
          </label>
          <label>
            <input type="radio" value={30} checked={gameTime === 30} onChange={handleTimeChange} />
            30 seconds
          </label>
          <label>
            <input type="radio" value={60} checked={gameTime === 60} onChange={handleTimeChange} />
            60 seconds
          </label>
          <label>
            <input type="radio" value={120} checked={gameTime === 120} onChange={handleTimeChange} />
            120 seconds
          </label>
        </div>
      </div>
      {isStarted && !isComplete && (
        <div className="countdown">Time Remaining: {remainingTime}s</div>
      )}
      {!isStarted && !isComplete ? (
        <div className="countdown">Click Start to Begin</div>
      ) : !isComplete ? (
        <>
          <TextDisplay text={text} userInput={userInput} />
          <InputField userInput={userInput} setUserInput={setUserInput} handleStartTyping={() => {}} />
        </>
      ) : (
        <div className="w-100 flex-col result-screen">
          <h2>Results</h2>
          <span>WPM: {wpm}</span>
          <span>Errors: {errorCount}</span>
          <button onClick={handleReset}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default App;
