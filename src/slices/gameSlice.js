import { createSlice } from '@reduxjs/toolkit';
import { generateTextWithExtras, getWordsOrQuotes } from '../hooks/useTyping';

const initialState = {
    gameType: 'time',
    gameTime: 30,
    wordCount: 25,
    includePunctuation: false,
    includeNumbers: false,
    language: 'ENG',
    isGameStarted: false,
    isGameComplete: false,
    remainingTime: 30,
    errorCount: 0,
    wpm: 0,
    elapsedTime: 0,
    countdown: 3,
    isCountdownComplete: false,
    userInputArray: [],
    text: '',
    startTime: null,
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameType: (state, action) => {
            state.gameType = action.payload;
        },
        setGameTime: (state, action) => {
            state.gameTime = action.payload;
            state.remainingTime = action.payload;
        },
        setWordCount: (state, action) => {
            state.wordCount = action.payload;
        },
        setIncludePunctuation: (state, action) => {
            state.includePunctuation = action.payload;
        },
        setIncludeNumbers: (state, action) => {
            state.includeNumbers = action.payload;
        },
        setLanguage: (state, action) => {
            state.language = action.payload;
        },
        startGame: (state) => {
            state.isGameStarted = true;
            state.isGameComplete = false;
            state.countdown = 3;
            state.isCountdownComplete = false;
            state.startTime = Date.now(); // Record start time when the game starts
        },
        completeGame: (state) => {
            const elapsedTime = (Date.now() - state.startTime) / 1000 / 60;
            const correctChars = state.userInputArray.filter((char, index) => char === state.text[index]).length;
            const words = correctChars / 5;
            state.wpm = Math.round(words / elapsedTime);

            state.isGameComplete = true;
            state.isGameStarted = false;
        },
        resetGame: (state) => {
            state.isGameStarted = false;
            state.isGameComplete = false;
            state.countdown = 3;
            state.isCountdownComplete = false;
            state.remainingTime = state.gameTime;
            state.elapsedTime = 0;
            state.userInputArray = [];
            state.errorCount = 0;
            state.wpm = 0;
            const newText = generateTextWithExtras(getWordsOrQuotes(state));
            state.text = newText;
        },
        incrementErrorCount: (state) => {
            state.errorCount += 1;
        },
        resetErrorCount: (state) => {
            state.errorCount = 0;
        },
        setRemainingTime: (state, action) => {
            state.remainingTime = action.payload;
        },
        updateElapsedTime: (state) => {
            state.elapsedTime += 1;
        },
        decrementCountdown: (state) => {
            state.countdown -= 1;
        },
        setCountdownComplete: (state) => {
            state.isCountdownComplete = true;
        },
        setGameText: (state, action) => {
            state.text = action.payload;
        },
        setUserInputArray: (state, action) => {
            state.userInputArray = action.payload;
        },
    },
});

export const {
    setGameType,
    setGameTime,
    setWordCount,
    setIncludePunctuation,
    setIncludeNumbers,
    setLanguage,
    startGame,
    completeGame,
    resetGame,
    incrementErrorCount,
    resetErrorCount,
    setRemainingTime,
    updateElapsedTime,
    decrementCountdown,
    setCountdownComplete,
    setGameText,
    setUserInputArray,
} = gameSlice.actions;

export default gameSlice.reducer;
