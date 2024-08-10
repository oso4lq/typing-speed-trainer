import React, { useState, useEffect } from 'react';
import TextDisplay from './components/TextDisplay';
import InputField from './components/InputField';
import wordsENG from './data/wordsENG.json';
import wordsCZE from './data/wordsCZE.json';
import wordsRUS from './data/wordsRUS.json';

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
  const [language, setLanguage] = useState('ENG');

  // Get words based on selected language
  const getWords = () => {
    switch (language) {
      case 'CZE':
        return wordsCZE;
      case 'RUS':
        return wordsRUS;
      default:
        return wordsENG;
    }
  };

  // Generate random text from the selected language's words
  useEffect(() => {
    const generateText = () => {
      const wordCount = Math.floor(gameTime / 2); // Approximate word count based on time
      const randomWords = Array.from({ length: wordCount }, () =>
        getWords()[Math.floor(Math.random() * getWords().length)]
      );
      setText(randomWords.join(' '));
    };
    generateText();
  }, [gameTime, language]);

  // Handle countdown timer
  useEffect(() => {
    if (isStarted && remainingTime > 0) {
      const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isStarted && remainingTime === 0) {
      handleGameEnd();
    }
  }, [remainingTime, isStarted]);

  const handleStartGame = () => {
    setIsStarted(true);
    setIsComplete(false); // Reset the completion state when starting the game
    setStartTime(Date.now());
    setRemainingTime(gameTime);
  };

  const handleTimeChange = (e) => {
    if (!isStarted) {
      setGameTime(Number(e.target.value));
      setRemainingTime(Number(e.target.value));
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  useEffect(() => {
    if (isStarted && userInput.length === text.length && remainingTime > 0) {
      handleGameEnd();
    }
  }, [userInput]);

  const handleGameEnd = () => {
    if (!isStarted) return; // Prevent running handleGameEnd if the game hasn't started

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
            <input type="radio" value={15} checked={gameTime === 15} onChange={handleTimeChange} disabled={isStarted} />
            15 seconds
          </label>
          <label>
            <input type="radio" value={30} checked={gameTime === 30} onChange={handleTimeChange} disabled={isStarted} />
            30 seconds
          </label>
          <label>
            <input type="radio" value={60} checked={gameTime === 60} onChange={handleTimeChange} disabled={isStarted} />
            60 seconds
          </label>
          <label>
            <input type="radio" value={120} checked={gameTime === 120} onChange={handleTimeChange} disabled={isStarted} />
            120 seconds
          </label>
        </div>
        <div className="language-selection">
          <label>
            Language:
            <select value={language} onChange={handleLanguageChange} disabled={isStarted}>
              <option value="ENG">English</option>
              <option value="CZE">Czech</option>
              <option value="RUS">Russian</option>
            </select>
          </label>
        </div>
      </div>
      {!isStarted && !isComplete && (
        <div className="countdown">Click Start to Begin</div>
      )}
      {isStarted && !isComplete && (
        <>
          <div className="countdown">Time Remaining: {remainingTime}s</div>
          <TextDisplay text={text} userInput={userInput} />
          <InputField userInput={userInput} setUserInput={setUserInput} handleStartTyping={() => {}} />
        </>
      )}
      {isComplete && (
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
