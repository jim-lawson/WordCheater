const dictionary = require('./dictionary.json');

const getWords = () => {
  return dictionary;
};

const getSolvedLetterPairs = solvedLetters => {
  return solvedLetters.reduce((a, b, idx, arr) => {
    if (idx % 2 === 0) {
      a.push([b]);
    } else {
      a[a.length - 1].push(parseInt(b) - 1);
    }
    return a;
  }, []);
};

const getLetterCountsFromLetters = letters => {
  return letters.reduce((a, b) => {
    if (a[b]) {
      a[b]++;
    } else {
      a[b] = 1;
    }

    return a;
  }, {});
};

const getLetterCountFromWord = (word, letter) => {
  const match = word.match(new RegExp(letter, 'g'));
  return match ? match.length : 0;
};

/**
 * Find words
 * @param  {Number} wordLength blah
 * @param  {String[]} letters blah
 * @return {String[]} solvedLetters blah
 */
const findWords = (wordLength, letters, solvedLetters) => {
  const words = getWords();

  const letterCounts = getLetterCountsFromLetters(letters);

  const solvedLetterPairs = getSolvedLetterPairs(solvedLetters);

  const wordsArray = words.filter(word => {
    return (
      word.length === parseInt(wordLength) &&
      solvedLetterPairs.every(pair => {
        return word[pair[1]] === pair[0];
      }) &&
      word.split('').every(letter => {
        return (
          letters.includes(letter) &&
          getLetterCountFromWord(word, letter) <= letterCounts[letter]
        );
      })
    );
  });

  return wordsArray;
};

export default findWords;
