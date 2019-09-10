import React, {useState} from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';

const letterRows = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
];

const LetterPicker = props => {
  const {onPicked} = props;

  const [currentLetter, setCurrentLetter] = useState(null);

  const handleLetterPressIn = letter => {
    setCurrentLetter(letter);
  };

  const handleLetterPressOut = letter => {
    setCurrentLetter(null);
    onPicked(letter);
  };

  return (
    <View style={styles.letterSelector}>
      {letterRows.map((row, index) => {
        return (
          <View key={index} style={styles.letterRow}>
            {row.map(letter => (
              <TouchableWithoutFeedback
                key={letter}
                onPressIn={() => handleLetterPressIn(letter)}
                onPressOut={() => handleLetterPressOut(letter)}>
                <View
                  style={[
                    styles.letterBox,
                    {
                      backgroundColor:
                        currentLetter === letter ? '#FF8800' : '#804400',
                    },
                  ]}>
                  <Text style={styles.letter}>{letter}</Text>
                </View>
              </TouchableWithoutFeedback>
            ))}
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  letterSelector: {
    alignItems: 'center',
  },
  letterRow: {
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#000',
  },
  letterBox: {
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 5,
    width: 37,
    height: 48,
    justifyContent: 'center',
  },
  letter: {
    fontSize: 28,
    textAlign: 'center',
  },
});

export default LetterPicker;
