import React, { useLayoutEffect, useState } from 'react'
import {
  Animated,
  Dimensions,
  Image,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import bgImage from './images/background.jpg'
import NumberOfLettersInput from './components/NumberOfLettersInput'
import LettersInput from './components/LettersInput'
import LetterPicker from './components/LetterPicker'
import Title from './components/Title'
import Heading from './components/Heading'
import ResultViewer from './components/ResultsViewer'
import Help from './components/help/Help'

const DisableIntro = false
const TopMargin = 35

const WordCheater = props => {
  const {
    minPuzzleLetters,
    maxPuzzleLetters,
    numberOfAvailableLetters,
    suggestedWordHeight,
    availableLetters,
    availableLettersIndex,
    numberOfLetters,
    solvedLetters,
    solvedLettersIndex,
    suggestedWords,
    bgFade,
    contentFade,
    suggestionResultsEmptyFade,
    availableLetterPickerAnim,
    availableLetterPickerTopAnim,
    solvedLetterPickerAnim,
    solvedLetterPickerTopAnim,
    suggestedWordsSlide,
    handleBackgroundPressIn,
    handleNumAvailableLettersChange,
    handleAvailableLetterChange,
    handleClearAvailableWordsClick,
    handleNumLettersChange,
    handleSolvedLetterChange,
    handleClearSolvedWordsClick,
    handleFindWordsClick,
    handleHideSuggestedWordsClick,
    handleAvailableLetterPress,
    handleSolvedLetterPress,
    showHelp,
    onShowHelp,
    onHideHelp
  } = props

  const [screenWidth, setScreenWidth] = useState(0)
  const [screenHeight, setScreenHeight] = useState(0)

  useLayoutEffect(() => {
    width = Math.round(Dimensions.get('window').width)
    height = Math.round(Dimensions.get('window').height)
    setScreenWidth(width)
    setScreenHeight(height)
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: bgFade
        }}
      >
        <Image
          source={bgImage}
          style={{
            position: 'absolute',
            width: screenWidth,
            height: screenHeight
          }}
        />
      </Animated.View>
      {!DisableIntro && (
        <Title
          topMargin={TopMargin}
          onIntroComplete={() => {
            Animated.timing(bgFade, {
              toValue: 0.25,
              duration: 250
            }).start()
            Animated.timing(contentFade, {
              toValue: 1,
              duration: 250
            }).start()
          }}
        />
      )}
      <Animated.View
        style={[styles.content, { opacity: DisableIntro ? 1 : contentFade }]}
      >
        <StatusBar hidden />
        <TouchableWithoutFeedback onPressIn={handleBackgroundPressIn}>
          <View style={styles.body}>
            <View
              style={{
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <View style={styles.appRow}>
                <View>
                  <Heading headingText={'AVAILABLE LETTERS'} />
                </View>
                <NumberOfLettersInput
                  value={numberOfAvailableLetters}
                  minimumValue={minPuzzleLetters}
                  maximumValue={maxPuzzleLetters}
                  onChange={handleNumAvailableLettersChange}
                  onCleared={handleClearAvailableWordsClick}
                />
              </View>
              <View style={styles.appRow}>
                <LettersInput
                  letters={availableLetters}
                  currentLetterIndex={availableLettersIndex}
                  hint={'Be sure to include duplicates'}
                  onLetterPress={handleAvailableLetterPress}
                />
              </View>
              <View style={styles.appRow}>
                <Heading headingText={'WORD TO SOLVE'} />
                <NumberOfLettersInput
                  value={numberOfLetters}
                  minimumValue={minPuzzleLetters}
                  maximumValue={Math.min(
                    numberOfAvailableLetters,
                    maxPuzzleLetters
                  )}
                  onChange={handleNumLettersChange}
                  onCleared={handleClearSolvedWordsClick}
                />
              </View>
              <View style={styles.appRow}>
                <LettersInput
                  letters={solvedLetters}
                  currentLetterIndex={solvedLettersIndex}
                  hint={'Enter letters you have solved (in position solved)'}
                  onLetterPress={handleSolvedLetterPress}
                />
              </View>
              <View>
                <TouchableOpacity
                  style={styles.findButton}
                  onPress={handleFindWordsClick}
                >
                  <Text style={styles.findButtonText}>Find Words</Text>
                </TouchableOpacity>
              </View>
              <Animated.View style={{ opacity: suggestionResultsEmptyFade }}>
                <Text
                  style={{
                    color: '#cccc00',
                    padding: 20,
                    fontSize: 20
                  }}
                >
                  No words found
                </Text>
              </Animated.View>
            </View>

            <Animated.View
              style={[
                styles.letterPickerContainer,
                {
                  opacity: availableLetterPickerAnim,
                  top: availableLetterPickerTopAnim,
                  transform: [
                    {
                      scaleX: availableLetterPickerAnim
                    },
                    {
                      scaleY: availableLetterPickerAnim
                    }
                  ]
                }
              ]}
            >
              <LetterPicker onPicked={handleAvailableLetterChange} />
            </Animated.View>

            <Animated.View
              style={[
                styles.letterPickerContainer,
                {
                  opacity: solvedLetterPickerAnim,
                  top: solvedLetterPickerTopAnim,
                  transform: [
                    {
                      scaleX: solvedLetterPickerAnim
                    },
                    {
                      scaleY: solvedLetterPickerAnim
                    }
                  ]
                }
              ]}
            >
              <LetterPicker onPicked={handleSolvedLetterChange} />
            </Animated.View>
          </View>
        </TouchableWithoutFeedback>
        <Help
          availableWidth={screenWidth}
          iconPosition={{ top: -20, right: 20 }}
          containerPosition={{ top: 90, left: 0, right: 0 }}
          showHelp={showHelp}
          onShowHelp={onShowHelp}
          onHideHelp={onHideHelp}
        />
      </Animated.View>
      <ResultViewer
        results={suggestedWords}
        screenWidth={screenWidth}
        screenHeight={screenHeight}
        suggestedWordHeight={suggestedWordHeight}
        topPosition={suggestedWordsSlide}
        onHide={handleHideSuggestedWordsClick}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    flex: 1
  },
  content: {
    marginTop: TopMargin,
    flex: 1
  },
  body: {
    marginTop: 70,
    flex: 1,
    alignItems: 'center'
  },
  appRow: {
    marginTop: 30
  },
  findButton: {
    marginTop: 40,
    borderWidth: 1,
    borderRadius: 5,
    width: 150,
    height: 35,
    justifyContent: 'center',
    backgroundColor: '#2A9FD6'
  },
  findButtonText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000'
  },
  suggestedWordsContainer: {
    position: 'absolute'
  },
  suggestedWordContainer: {
    height: 50
  },
  suggestedWord: {
    textAlign: 'center',
    fontSize: 40,
    color: '#cccc00'
  },
  letterPickerContainer: {
    position: 'absolute'
  }
})

export default WordCheater
