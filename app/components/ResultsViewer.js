import React from 'react';
import {Animated, ScrollView, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const ResultsViewer = props => {
  const {
    results,
    screenWidth,
    screenHeight,
    suggestedWordHeight,
    topPosition,
    onHide,
  } = props;

  return (
    <Animated.View
      style={[styles.suggestedWordsContainer, {left: 10, top: topPosition}]}>
      <View
        style={{
          borderWidth: 3,
          borderColor: '#666',
          borderRadius: 15,
          width: screenWidth - 20,
          height: screenHeight - 160,
          paddingHorizontal: 50,
          paddingVertical: 25,
          backgroundColor: '#333',
        }}>
        <Icon
          name="close"
          size={30}
          style={{
            color: '#aaa',
            position: 'absolute',
            right: 10,
            top: 10,
          }}
          onPress={onHide}
        />
        <ScrollView>
          {results.map(word => (
            <View key={word} style={{height: suggestedWordHeight}}>
              <Text
                style={[
                  styles.suggestedWord,
                  {fontSize: suggestedWordHeight - 10},
                ]}>
                {word}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  suggestedWordsContainer: {
    position: 'absolute',
  },
  suggestedWord: {
    textAlign: 'center',
    color: '#cccc00',
  },
});

export default ResultsViewer;
