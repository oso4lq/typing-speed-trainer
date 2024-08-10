import React, { useState, useEffect } from 'react';
import TextDisplay from './components/TextDisplay';
import wordsENG from './data/wordsENG.json';
import wordsCZE from './data/wordsCZE.json';
import wordsRUS from './data/wordsRUS.json';
import quotesENG from './data/quotesENG.json';
import quotesCZE from './data/quotesCZE.json';
import quotesRUS from './data/quotesRUS.json';

const punctuationSymbols = ['!', '?', ',', '.', ':'];

const App = () => {
  const [userInputArray, setUserInputArray] = useState([]);
  const [text, setText] = useState('');
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [gameTime, setGameTime] = useState(30);
  const [remainingTime, setRemainingTime] = useState(gameTime);
  const [language, setLanguage] = useState('ENG');
  const [includePunctuation, setIncludePunctuation] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [gameType, setGameType] = useState('time');
  const [wordCount, setWordCount] = useState(25);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [isCountdownComplete, setIsCountdownComplete] = useState(false);
  const [keyListenerActive, setKeyListenerActive] = useState(false);

  // Get words or quotes based on selected language and game type
  const getWordsOrQuotes = () => {
    if (gameType === 'quote') {
      switch (language) {
        case 'CZE':
          return quotesCZE;
        case 'RUS':
          return quotesRUS;
        default:
          return quotesENG;
      }
    } else {
      switch (language) {
        case 'CZE':
          return wordsCZE;
        case 'RUS':
          return wordsRUS;
        default:
          return wordsENG;
      }
    }
  };

  // Helper method to add extra symbols to the text
  const generateTextWithExtras = (words) => {
    if (gameType === 'quote') {
      return words.join(' '); // No extras for quotes
    }

    return words.map((word) => {
      let result = word;
      if (includePunctuation && Math.random() < 0.2) {
        result += punctuationSymbols[Math.floor(Math.random() * punctuationSymbols.length)];
      }
      if (includeNumbers && Math.random() < 0.2) {
        result += ` ${Math.floor(Math.random() * 1000)}`;
      }
      return result;
    }).join(' ');
  };

  // Generate random text based on the selected options
  useEffect(() => {
    const generateText = () => {
      let wordsArray;
      if (gameType === 'quote') {
        const quotesArray = getWordsOrQuotes();
        wordsArray = quotesArray[Math.floor(Math.random() * quotesArray.length)].split(' ');
      } else {
        wordsArray = Array.from({ length: gameType === 'time' ? 200 : wordCount }, () =>
          getWordsOrQuotes()[Math.floor(Math.random() * getWordsOrQuotes().length)]
        );
      }
      setText(generateTextWithExtras(wordsArray));
    };
    generateText();
  }, [gameTime, language, includePunctuation, includeNumbers, gameType, wordCount]);

  // Handle countdown timer
  useEffect(() => {
    if (countdown > 0 && isGameStarted) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && !isCountdownComplete) {
      setIsCountdownComplete(true);
      setStartTime(Date.now());
      setKeyListenerActive(true);
      if (gameType === 'time') {
        setRemainingTime(gameTime);
      }
    }
  }, [countdown, isGameStarted, isCountdownComplete, gameTime, gameType]);

  // Handle the main timer for 'time' mode
  useEffect(() => {
    if (isCountdownComplete && isGameStarted && gameType === 'time' && remainingTime > 0) {
      const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isCountdownComplete && isGameStarted && gameType === 'time' && remainingTime === 0) {
      handleGameEnd();
    }
  }, [remainingTime, isGameStarted, isCountdownComplete, gameType]);

  // Handle elapsed time for 'words' and 'quote' modes
  useEffect(() => {
    let timer;
    if (isCountdownComplete && isGameStarted && (gameType === 'words' || gameType === 'quote')) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isGameStarted, isCountdownComplete, gameType]);

  const handleStartGame = () => {
    setIsGameStarted(true);
    setIsGameComplete(false);
    setIsCountdownComplete(false);
    setCountdown(3);
  };

  const handleTimeChange = (e) => {
    if (!isGameStarted) {
      setGameTime(Number(e.target.value));
      setRemainingTime(Number(e.target.value));
    }
  };

  const handleWordCountChange = (e) => {
    if (!isGameStarted) {
      setWordCount(Number(e.target.value));
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handlePunctuationChange = () => {
    if (!isGameStarted) {
      setIncludePunctuation(!includePunctuation);
    }
  };

  const handleNumbersChange = () => {
    if (!isGameStarted) {
      setIncludeNumbers(!includeNumbers);
    }
  };

  const handleGameTypeChange = (e) => {
    if (!isGameStarted) {
      setGameType(e.target.value);
    }
  };

  useEffect(() => {
    if (isGameStarted && userInputArray.length === text.length && (gameType === 'words' || gameType === 'quote')) {
      handleGameEnd();
    }
  }, [userInputArray, gameType]);

  const handleGameEnd = () => {
    if (!isGameStarted) return;

    const elapsedTime = (Date.now() - startTime) / 1000 / 60; // time in minutes
    const correctChars = userInputArray.filter((char, index) => char === text[index]).length;
    const words = correctChars / 5;
    setWpm(Math.round(words / elapsedTime));

    setIsGameComplete(true);
    setIsGameStarted(false);
    setKeyListenerActive(false);
  };

  const handleReset = () => {
    setUserInputArray([]);
    setStartTime(null);
    setWpm(0);
    setErrorCount(0);
    setIsGameComplete(false);
    setIsGameStarted(false);
    setRemainingTime(gameTime);
    setElapsedTime(0);
    setIsCountdownComplete(false);
    setKeyListenerActive(false);
  };

  // Key event listener
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isCountdownComplete || !isGameStarted) return;

      const { key } = e;

      if (key === 'Backspace') {
        setUserInputArray(userInputArray.slice(0, -1));
      } else if (key.length === 1) {
        const newInputArray = [...userInputArray, key];
        setUserInputArray(newInputArray);

        if (newInputArray[newInputArray.length - 1] !== text[newInputArray.length - 1]) {
          setErrorCount((prevCount) => prevCount + 1);
        }
      }
    };

    if (keyListenerActive) {
      document.addEventListener('keydown', handleKeyPress);
    } else {
      document.removeEventListener('keydown', handleKeyPress);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [userInputArray, keyListenerActive, isGameStarted, isCountdownComplete, text]);

  return (
    <div className="w-100 flex-col app">
      <h1 className="header">Typing Speed Trainer</h1>

      {/* Game Setup section START*/}
      <div className="flex-row game-settings">
        {/* Extra Symbols */}
        {gameType !== 'quote' && (
          <div className="flex-row select select__extraSymbols">
            <label>
              <input type="checkbox" value="punctuation" checked={includePunctuation} onChange={handlePunctuationChange} disabled={isGameStarted} />
            </label>
            <label>
              <input type="checkbox" value="numbers" checked={includeNumbers} onChange={handleNumbersChange} disabled={isGameStarted} />
            </label>
          </div>
        )}

        {/* Game Type */}
        <div className="flex-row select select__gameType">
          <label>
            <input type="radio" value="time" checked={gameType === 'time'} onChange={handleGameTypeChange} disabled={isGameStarted} />
          </label>
          <label>
            <input type="radio" value="words" checked={gameType === 'words'} onChange={handleGameTypeChange} disabled={isGameStarted} />
          </label>
          <label>
            <input type="radio" value="quote" checked={gameType === 'quote'} onChange={handleGameTypeChange} disabled={isGameStarted} />
          </label>
        </div>

        {/* Timer Duration - for 'time' mode */}
        {gameType === 'time' && (
          <div className="flex-row select select__time">
            <label>
              <input type="radio" value={15} checked={gameTime === 15} onChange={handleTimeChange} disabled={isGameStarted} />
            </label>
            <label>
              <input type="radio" value={30} checked={gameTime === 30} onChange={handleTimeChange} disabled={isGameStarted} />
            </label>
            <label>
              <input type="radio" value={60} checked={gameTime === 60} onChange={handleTimeChange} disabled={isGameStarted} />
            </label>
            <label>
              <input type="radio" value={120} checked={gameTime === 120} onChange={handleTimeChange} disabled={isGameStarted} />
            </label>
          </div>
        )}

        {/* Word Count - for 'words' mode */}
        {gameType === 'words' && (
          <div className="flex-row select select_wordsNumber">
            <label>
              <input type="radio" value={10} checked={wordCount === 10} onChange={handleWordCountChange} disabled={isGameStarted} />
            </label>
            <label>
              <input type="radio" value={25} checked={wordCount === 25} onChange={handleWordCountChange} disabled={isGameStarted} />
            </label>
            <label>
              <input type="radio" value={50} checked={wordCount === 50} onChange={handleWordCountChange} disabled={isGameStarted} />
            </label>
            <label>
              <input type="radio" value={100} checked={wordCount === 100} onChange={handleWordCountChange} disabled={isGameStarted} />
            </label>
          </div>
        )}

        {/* Language Selection */}
        <label className="flex-row select select__language">
          <span>Language:</span>
          <select value={language} onChange={handleLanguageChange} disabled={isGameStarted}>
            <option value="ENG">English</option>
            <option value="CZE">Czech</option>
            <option value="RUS">Russian</option>
          </select>
        </label>
      </div>
      {/* Game Setup section END*/}

      {/* Game Field Section START */}
      {/* game is not started */}
      {!isGameStarted && !isGameComplete && (
        <div className='flex-col info-field'>
          <span className="title">Click start to begin</span>
          <span>The game will start in 3 seconds</span>

          <button className='overlay' onClick={handleStartGame} disabled={isGameStarted || isGameComplete}>START</button>
        </div>
      )}

      {/* game process */}
      {isGameStarted && !isGameComplete && (
        <div className='flex-col info-field'>
          {gameType === 'time' && <span className="title">Time Remaining: {remainingTime}s</span>}
          {(gameType === 'words' || gameType === 'quote') && <span className="title">Elapsed time: {elapsedTime}s</span>}

          <div className='flex-row'>
            <span className="errors">Errors: {errorCount}</span>
          </div>
        </div>
      )}

      {/* game over */}
      {isGameComplete && (
        <div className="flex-col info-field">
          <span className='title'>Results</span>

          <div className='flex-row'>
            <span>WPM: {wpm}</span>
            <span>Errors: {errorCount}</span>
            {(gameType === 'words' || gameType === 'quote') && <span>Elapsed time: {elapsedTime}s</span>}
          </div>

          <button className='overlay' onClick={handleReset}>RESTART</button>
        </div>
      )}

      {/* game field */}
      <div className='flex-col w-100 game-field'>
        {(!isCountdownComplete || isGameComplete || !isGameStarted) && (
          <>
            <div className='w-100 h-100 backdrop'></div>
            {isGameStarted && (
              <div className='overlay countdown'>{countdown}</div>
            )}
          </>
        )}
        <div className='flex-col textbox'>
          <TextDisplay text={text} userInput={userInputArray.join('')} />
        </div>
      </div>
      {/* Game Field Section END */}

    </div>
  );
};

export default App;
