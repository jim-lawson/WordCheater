import React from 'react';
import {Animated, Dimensions} from 'react-native';
import findWords from './findWords';
import WordCheater from './WordCheater';

const MinPuzzleLetters = 3;
const MaxPuzzleLetters = 7;

const AvailableLettersPickerStartTop = 95;
const AvailableLettersPickerEndTop = 195;
const SolvedLettersPickerStartTop = 310;
const SolvedLettersPickerEndTop = 410;

const SuggestedWordHeight = 40;

const Showables = Object.freeze({
  AVAILABLE_LETTER_PICKER: 0,
  SOLVED_LETTER_PICKER: 1,
  SUGGESTION_RESULTS: 2,
  HELP: 3,
});

class App extends React.Component {
  constructor() {
    super();
    this.screenWidth = Math.round(Dimensions.get('window').width);
    this.screenHeight = Math.round(Dimensions.get('window').height);
    this.state = {
      bgFade: new Animated.Value(0.35),
      contentFade: new Animated.Value(0),
      suggestedWordsSlide: new Animated.Value(this.screenHeight),
      numberOfAvailableLetters: MaxPuzzleLetters,
      availableLetters: new Array(7).fill(''),
      availableLettersIndex: -1,
      numberOfLetters: MaxPuzzleLetters,
      solvedLetters: new Array(MaxPuzzleLetters).fill('?'),
      solvedLettersIndex: -1,
      suggestedWords: [],
      suggestionResultsEmptyFade: new Animated.Value(0),
      letterBackgroundColor: '#FF8800',
      availableLetterPickerAnim: new Animated.Value(0),
      solvedLetterPickerAnim: new Animated.Value(0),
      solvedLetterPickerTopAnim: new Animated.Value(
        SolvedLettersPickerStartTop,
      ),
      availableLetterPickerTopAnim: new Animated.Value(
        AvailableLettersPickerStartTop,
      ),
    };

    this.showableRegistry = [];
  }

  componentDidMount() {
    this.registerShowable(
      Showables.AVAILABLE_LETTER_PICKER,
      this.showAvailableLettersPicker,
      this.hideAvailableLettersPicker,
    );
    this.registerShowable(
      Showables.SOLVED_LETTER_PICKER,
      this.showSolvedLettersPicker,
      this.hideSolvedLettersPicker,
    );
    this.registerShowable(Showables.HELP, this.showHelp, this.hideHelp);
    this.registerShowable(
      Showables.SUGGESTION_RESULTS,
      this.showSuggestedWordsContainer,
      this.hideSuggestedWordsContainer,
    );
  }

  registerShowable(id, showFunction, hideFunction) {
    this.showableRegistry.push({
      id: id,
      show: showFunction,
      hide: hideFunction,
    });
  }

  show(showableId) {
    this.showableRegistry.forEach(showable => {
      if (showable.id === showableId) {
        showable.show();
      } else {
        showable.hide();
      }
    });
  }

  hide(showableId) {
    this.showableRegistry.find(showable => showable.id === showableId).hide();
  }

  hideAll = () => {
    this.show(null);
  };

  handleNumAvailableLettersChange = numLetters => {
    const {numberOfAvailableLetters, numberOfLetters} = this.state;
    // BUG: React community slider has a bug where it fires onChange just by pressing on the slider
    if (numLetters === numberOfAvailableLetters) {
      return;
    }
    this.setState({
      numberOfAvailableLetters: numLetters,
      availableLetters: new Array(numLetters).fill(''),
    });

    this.setState({
      numberOfLetters: numLetters,
      solvedLetters: new Array(numLetters).fill('?'),
    });
    this.hideAll();
  };

  findNextAvailableLetterIndex = (index, startIndex) => {
    const {state} = this;
    let idx = (index > 0 ? index : 0) + 1;
    let startIdx = startIndex || index;
    if (idx === state.numberOfAvailableLetters) {
      idx = 0;
    }

    const letter = state.availableLetters[idx];
    if (letter === '' || letter === '?') {
      return idx;
    } else {
      // Check for greater than or equal to because if a user types SUPER fast, they can
      // actually beat the async state update setting it to -1
      if (idx >= startIdx) {
        return -1;
      } else {
        return this.findNextAvailableLetterIndex(idx, startIdx);
      }
    }
  };

  handleAvailableLetterChange = letter => {
    const {availableLetters, availableLettersIndex} = this.state;
    const updatedAvailableLetters = availableLetters;
    updatedAvailableLetters[availableLettersIndex] = letter;
    const updatedAvailableLettersIndex = this.findNextAvailableLetterIndex(
      availableLettersIndex,
    );
    if (updatedAvailableLettersIndex < 0) {
      this.hide(Showables.AVAILABLE_LETTER_PICKER);
    }
    this.setState({
      availableLetters: updatedAvailableLetters,
      availableLettersIndex: updatedAvailableLettersIndex,
    });
  };

  handleClearAvailableWordsClick = () => {
    const {numberOfAvailableLetters} = this.state;
    this.setState({
      availableLetters: new Array(numberOfAvailableLetters).fill(''),
      solvedLetters: new Array(numberOfAvailableLetters).fill('?'),
      numberOfLetters: numberOfAvailableLetters,
    });
    this.hideAll();
  };

  handleNumLettersChange = numLetters => {
    const {numberOfLetters, numberOfAvailableLetters} = this.state;
    // BUG: React community slider has a bug where it fires onChange just by pressing on the slider
    if (numLetters === numberOfLetters) {
      return;
    }
    if (numLetters <= numberOfAvailableLetters) {
      this.setState({
        numberOfLetters: numLetters,
        solvedLetters: new Array(numLetters).fill('?'),
      });
    }
    this.hideAll();
  };

  handleSolvedLetterChange = text => {
    const {solvedLetters, solvedLettersIndex} = this.state;
    const updatedSolvedLetters = solvedLetters;
    updatedSolvedLetters[solvedLettersIndex] = text;
    this.setState({
      solvedLetters: updatedSolvedLetters,
      displaySolvedLetterPicker: false,
    });
    this.hideAll();
  };

  handleClearSolvedWordsClick = () => {
    this.setState({
      solvedLetters: new Array(this.state.numberOfLetters).fill('?'),
    });
    this.hideAll();
  };

  handleAvailableLetterPress = index => {
    this.show(Showables.AVAILABLE_LETTER_PICKER);
    this.setState({
      availableLettersIndex: index,
    });
  };

  handleSolvedLetterPress = index => {
    this.show(Showables.SOLVED_LETTER_PICKER);
    this.setState({
      solvedLettersIndex: index,
    });
  };

  handleFindWordsClick = () => {
    const {numberOfLetters, availableLetters, solvedLetters} = this.state;
    console.log('availableLetters', availableLetters);
    const results = findWords(
      numberOfLetters,
      availableLetters.map(letter => letter.toLowerCase()),
      solvedLetters
        .map((letter, index) => [
          letter.replace('?', '').toLowerCase(),
          index + 1,
        ])
        .filter(pair => !!pair[0])
        .flat(),
    );

    this.hideAll();

    this.setState(
      {
        suggestedWords: results,
      },
      () => {
        if (results.length) {
          this.show(Showables.SUGGESTION_RESULTS);
        } else {
          Animated.timing(this.state.suggestionResultsEmptyFade, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }).start();
          setTimeout(() => {
            Animated.timing(this.state.suggestionResultsEmptyFade, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }).start();
          }, 3000);
        }
      },
    );
  };

  handleHideSuggestedWordsClick = () => {
    this.hide(Showables.SUGGESTION_RESULTS);
  };

  showSuggestedWordsContainer = () => {
    const {suggestedWordsSlide, suggestedWords} = this.state;
    const containerTop = Math.max(
      140,
      Math.min(
        520,
        this.screenHeight - suggestedWords.length * SuggestedWordHeight - 50,
      ),
    );
    Animated.timing(suggestedWordsSlide, {
      toValue: containerTop,
      duration: 250,
    }).start();
  };

  hideSuggestedWordsContainer = () => {
    Animated.timing(this.state.suggestedWordsSlide, {
      toValue: this.screenHeight,
      duration: 250,
    }).start();
  };

  handleBackgroundPressIn = () => {
    this.hideAll();
  };

  doShowSolvedLettersPicker = show => {
    Animated.timing(this.state.solvedLetterPickerAnim, {
      toValue: show ? 1 : 0,
      duration: 250,
    }).start();
    Animated.timing(this.state.solvedLetterPickerTopAnim, {
      toValue: show ? SolvedLettersPickerEndTop : SolvedLettersPickerStartTop,
      duration: 250,
    }).start(() => {
      if (!show) {
        this.setState({solvedLetterPickerHidden: true});
      }
    });
  };

  showSolvedLettersPicker = () => {
    this.doShowSolvedLettersPicker(true);
  };

  hideSolvedLettersPicker = () => {
    this.doShowSolvedLettersPicker(false);
    this.setState({
      solvedLettersIndex: -1,
    });
  };

  doShowAvailableLettersPicker = show => {
    Animated.timing(this.state.availableLetterPickerAnim, {
      toValue: show ? 1 : 0,
      duration: 250,
    }).start();
    Animated.timing(this.state.availableLetterPickerTopAnim, {
      toValue: show
        ? AvailableLettersPickerEndTop
        : AvailableLettersPickerStartTop,
      duration: 250,
    }).start();
  };

  showAvailableLettersPicker = () => {
    this.doShowAvailableLettersPicker(true);
  };

  hideAvailableLettersPicker = () => {
    this.doShowAvailableLettersPicker(false);
    this.setState({
      availableLettersIndex: -1,
    });
  };

  showHelp = () => {
    this.setState({showHelp: true});
  };

  hideHelp = () => {
    this.setState({showHelp: false});
  };

  handleShowHelp = () => {
    this.show(Showables.HELP);
  };

  handleHideHelp = () => {
    this.hide(Showables.HELP);
  };

  render() {
    return (
      <WordCheater
        {...this.state}
        minPuzzleLetters={MinPuzzleLetters}
        maxPuzzleLetters={MaxPuzzleLetters}
        suggestedWordHeight={SuggestedWordHeight}
        handleBackgroundPressIn={this.handleBackgroundPressIn}
        handleNumAvailableLettersChange={this.handleNumAvailableLettersChange}
        handleAvailableLetterChange={this.handleAvailableLetterChange}
        handleClearAvailableWordsClick={this.handleClearAvailableWordsClick}
        handleNumLettersChange={this.handleNumLettersChange}
        handleSolvedLetterChange={this.handleSolvedLetterChange}
        handleClearSolvedWordsClick={this.handleClearSolvedWordsClick}
        handleFindWordsClick={this.handleFindWordsClick}
        handleHideSuggestedWordsClick={this.handleHideSuggestedWordsClick}
        handleAvailableLetterPress={this.handleAvailableLetterPress}
        handleSolvedLetterPress={this.handleSolvedLetterPress}
        onShowHelp={this.handleShowHelp}
        onHideHelp={this.handleHideHelp}
      />
    );
  }
}

export default App;
