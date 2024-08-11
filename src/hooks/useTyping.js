import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { setGameText } from '../slices/gameSlice';
import wordsENG from '../data/wordsENG.json';
import wordsCZE from '../data/wordsCZE.json';
import wordsRUS from '../data/wordsRUS.json';
import quotesENG from '../data/quotesENG.json';
import quotesCZE from '../data/quotesCZE.json';
import quotesRUS from '../data/quotesRUS.json';

export const punctuationSymbols = ['!', '?', ',', '.', ':'];

export const getWordsOrQuotes = ({ language, gameType }) => {
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

export const generateTextWithExtras = (words, includePunctuation, includeNumbers, gameType) => {
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

const useTyping = () => {
    const dispatch = useDispatch();
    const { language, includePunctuation, includeNumbers, gameType, wordCount } = useSelector((state) => state.game);

    // Generate random text based on the selected options
    useEffect(() => {
        const generateText = () => {
            let wordsArray;
            if (gameType === 'quote') {
                const quotesArray = getWordsOrQuotes({ language, gameType });
                wordsArray = quotesArray[Math.floor(Math.random() * quotesArray.length)].split(' ');
            } else {
                wordsArray = Array.from({ length: gameType === 'time' ? 200 : wordCount }, () =>
                    getWordsOrQuotes({ language, gameType })[Math.floor(Math.random() * getWordsOrQuotes({ language, gameType }).length)]
                );
            }
            const generatedText = generateTextWithExtras(wordsArray, includePunctuation, includeNumbers, gameType);
            dispatch(setGameText(generatedText)); // Set the generated text in the Redux store
        };

        generateText();
    }, [language, includePunctuation, includeNumbers, gameType, wordCount, dispatch]);
};

export default useTyping;
