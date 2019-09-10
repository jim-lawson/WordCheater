const dictionary = require('./dictionary.json')

const getLetterCountsFromLetters = letters => {
  return letters.reduce((a, b) => {
    if (a[b]) {
      a[b]++
    } else {
      a[b] = 1
    }

    return a
  }, {})
}

const getLetterCountFromWord = (word, letter) => {
  const match = word.match(new RegExp(letter, 'g'))
  return match ? match.length : 0
}

/**
 * Find words
 * @param  {number} wordLength The length of the word to solve
 * @param  {string[]} letters The letters available for the word being solved
 * @param  {[[string, number]]} solvedLetters The letters that have already been solved in the word with the position within the word
 * @return {string[]}
 */
const findWords = (wordLength, letters, solvedLetters) => {
  const letterCounts = getLetterCountsFromLetters(letters)
  const wordsArray = dictionary.filter(word => {
    return (
      word.length === wordLength &&
      solvedLetters.every(tuple => {
        return word[tuple[1]] === tuple[0]
      }) &&
      word.split('').every(letter => {
        return (
          letters.includes(letter) &&
          getLetterCountFromWord(word, letter) <= letterCounts[letter]
        )
      })
    )
  })

  return wordsArray
}

export default findWords
