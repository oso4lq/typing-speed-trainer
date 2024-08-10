import React, { useState, useEffect } from 'react';
import TextDisplay from './components/TextDisplay';
import InputField from './components/InputField';
import wordsENG from './data/wordsENG.json';
import wordsCZE from './data/wordsCZE.json';
import wordsRUS from './data/wordsRUS.json';
import quotesENG from './data/quotesENG.json';
import quotesCZE from './data/quotesCZE.json';
import quotesRUS from './data/quotesRUS.json';

const punctuationSymbols = ['!', '?', ',', '.', ':'];

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
  const [includePunctuation, setIncludePunctuation] = useState(false);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [gameType, setGameType] = useState('time');
  const [wordCount, setWordCount] = useState(25);
  const [elapsedTime, setElapsedTime] = useState(0);

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

  // Handle countdown timer for 'time' mode
  useEffect(() => {
    if (isStarted && gameType === 'time' && remainingTime > 0) {
      const timer = setTimeout(() => setRemainingTime(remainingTime - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isStarted && gameType === 'time' && remainingTime === 0) {
      handleGameEnd();
    }
  }, [remainingTime, isStarted, gameType]);

  // Handle elapsed time for 'words' and 'quote' mode
  useEffect(() => {
    let timer;
    if (isStarted && (gameType === 'words' || gameType === 'quote')) {
      timer = setInterval(() => {
        setElapsedTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isStarted, gameType]);

  const handleStartGame = () => {
    setIsStarted(true);
    setIsComplete(false);
    setStartTime(Date.now());
    setElapsedTime(0);
    if (gameType === 'time') {
      setRemainingTime(gameTime);
    }
  };

  const handleTimeChange = (e) => {
    if (!isStarted) {
      setGameTime(Number(e.target.value));
      setRemainingTime(Number(e.target.value));
    }
  };

  const handleWordCountChange = (e) => {
    if (!isStarted) {
      setWordCount(Number(e.target.value));
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handlePunctuationChange = () => {
    if (!isStarted) {
      setIncludePunctuation(!includePunctuation);
    }
  };

  const handleNumbersChange = () => {
    if (!isStarted) {
      setIncludeNumbers(!includeNumbers);
    }
  };

  const handleGameTypeChange = (e) => {
    if (!isStarted) {
      setGameType(e.target.value);
    }
  };

  useEffect(() => {
    if (isStarted && userInput.length === text.length && (gameType === 'words' || gameType === 'quote')) {
      handleGameEnd();
    }
  }, [userInput, gameType]);

  const handleGameEnd = () => {
    if (!isStarted) return;

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
    setElapsedTime(0);
  };

  return (
    <div className="w-100 flex-col app">
      <h1 className="flex-row">Typing Speed Trainer</h1>

      <div className="flex-row game-settings">
        {/* Extra Symbols */}
        {gameType !== 'quote' && (
          <div className="select select__extraSymbols">
            <label>
              <input type="checkbox" checked={includePunctuation} onChange={handlePunctuationChange} disabled={isStarted} />
              punctuation
            </label>
            <label>
              <input type="checkbox" checked={includeNumbers} onChange={handleNumbersChange} disabled={isStarted} />
              numbers
            </label>
          </div>
        )}

        {/* Game Type */}
        <div className="select select__gameType">
          <label>
            <input type="radio" value="time" checked={gameType === 'time'} onChange={handleGameTypeChange} disabled={isStarted} />
            time
          </label>
          <label>
            <input type="radio" value="words" checked={gameType === 'words'} onChange={handleGameTypeChange} disabled={isStarted} />
            words
          </label>
          <label>
            <input type="radio" value="quote" checked={gameType === 'quote'} onChange={handleGameTypeChange} disabled={isStarted} />
            quote
          </label>
        </div>

        {/* Timer Duration - for 'time' mode */}
        {gameType === 'time' && (
          <div className="select select__time">
            <label>
              <input type="radio" value={15} checked={gameTime === 15} onChange={handleTimeChange} disabled={isStarted} />
              15
            </label>
            <label>
              <input type="radio" value={30} checked={gameTime === 30} onChange={handleTimeChange} disabled={isStarted} />
              30
            </label>
            <label>
              <input type="radio" value={60} checked={gameTime === 60} onChange={handleTimeChange} disabled={isStarted} />
              60
            </label>
            <label>
              <input type="radio" value={120} checked={gameTime === 120} onChange={handleTimeChange} disabled={isStarted} />
              120
            </label>
          </div>
        )}

        {/* Word Count - for 'words' mode */}
        {gameType === 'words' && (
          <div className="select select_wordsNumber">
            <label>
              <input type="radio" value={10} checked={wordCount === 10} onChange={handleWordCountChange} disabled={isStarted} />
              10
            </label>
            <label>
              <input type="radio" value={25} checked={wordCount === 25} onChange={handleWordCountChange} disabled={isStarted} />
              25
            </label>
            <label>
              <input type="radio" value={50} checked={wordCount === 50} onChange={handleWordCountChange} disabled={isStarted} />
              50
            </label>
            <label>
              <input type="radio" value={100} checked={wordCount === 100} onChange={handleWordCountChange} disabled={isStarted} />
              100
            </label>
          </div>
        )}

        {/* Language Selection */}
        <div className="select select__language">
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

      {/* Game Field Section */}
      <button onClick={handleStartGame} disabled={isStarted || isComplete}>Start</button>

      {!isStarted && !isComplete && (
        <div className="countdown">Click Start to Begin</div>
      )}

      {isStarted && !isComplete && (
        <>
          {gameType === 'time' && <div className="countdown">Time Remaining: {remainingTime}s</div>}
          {(gameType === 'words' || gameType === 'quote') && <div className="countdown">Elapsed Time: {elapsedTime}s</div>}
          <TextDisplay text={text} userInput={userInput} />
          <InputField userInput={userInput} setUserInput={setUserInput} handleStartTyping={() => { }} />
        </>
      )}

      {isComplete && (
        <div className="w-100 flex-col result-screen">
          <h2>Results</h2>
          <span>WPM: {wpm}</span>
          <span>Errors: {errorCount}</span>
          {(gameType === 'words' || gameType === 'quote') && <span>Time Taken: {elapsedTime}s</span>}
          <button onClick={handleReset}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default App;
