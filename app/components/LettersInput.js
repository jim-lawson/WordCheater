import React from 'react'
import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'

const LettersInput = props => {
  const { letters, currentLetterIndex, hint, onLetterPress } = props
  return (
    <View style={styles.letters}>
      <View style={styles.letterRowContainer}>
        <View style={styles.letterRow}>
          {letters.map((letter, index) => (
            <TouchableWithoutFeedback
              key={index}
              onPressIn={() => onLetterPress(index)}
            >
              <View
                style={[
                  styles.letterBox,
                  {
                    borderColor: currentLetterIndex === index ? '#fff' : '#999',
                    borderWidth: currentLetterIndex === index ? 3 : 2
                  }
                ]}
              >
                <Text style={styles.letterText}>{letter}</Text>
              </View>
            </TouchableWithoutFeedback>
          ))}
        </View>
      </View>
      {hint && (
        <View>
          <Text style={styles.hint}>{hint}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  letters: { alignItems: 'center' },
  letterRowContainer: { alignItems: 'center', flexDirection: 'row' },
  letterRow: { alignItems: 'center', flexDirection: 'row' },
  letterBox: {
    margin: 3,
    borderRadius: 5,
    width: 45,
    height: 45,
    justifyContent: 'center'
  },
  letterText: {
    fontSize: 25,
    textTransform: 'uppercase',
    textAlign: 'center',
    color: '#FF8800'
  },
  letterPickerContainer: {
    position: 'absolute',
    width: 200,
    height: 200
  },
  hint: {
    marginTop: 5,
    fontSize: 14,
    fontStyle: 'italic',
    color: '#aaa'
  }
})

export default LettersInput
