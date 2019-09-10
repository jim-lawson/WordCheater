import React, {useEffect, useState} from 'react';
import {Animated, StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AvailableWordsHelpText, SolveWordHelpText} from './helpText';

const Help = props => {
  const {
    availableWidth,
    iconPosition,
    containerPosition,
    showHelp,
    onShowHelp,
    onHideHelp,
  } = props;

  const [opacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: showHelp ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [showHelp]);

  return (
    <View
      style={[
        styles.helpContainer,
        {width: availableWidth, zIndex: showHelp ? 1 : -1},
      ]}>
      <View>
        <Icon
          name="help"
          size={30}
          style={[styles.helpIcon, iconPosition]}
          onPress={() => {
            if (showHelp) {
              onHideHelp();
            } else {
              onShowHelp();
            }
          }}
        />
      </View>
      <Animated.View
        style={[styles.helpTextContainer, containerPosition, {opacity}]}>
        <View style={styles.helpTextTitleRow}>
          <Text style={styles.helpTextTitle}>Help</Text>
          <View style={styles.helpCloseIconContainer}>
            <Icon
              name="close"
              size={30}
              onPress={() => {
                onHideHelp();
              }}
              style={styles.helpCloseIcon}
            />
          </View>
        </View>
        <View style={styles.helpTextRow}>
          <Text style={styles.helpTextHeading}>
            {AvailableWordsHelpText.title}
          </Text>
          <Text style={styles.helpText}>{AvailableWordsHelpText.text}</Text>
        </View>
        <View style={styles.helpTextRow}>
          <Text style={styles.helpTextHeading}>{SolveWordHelpText.title}</Text>
          <Text style={styles.helpText}>{SolveWordHelpText.text}</Text>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  helpContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  helpIcon: {
    color: '#555',
    position: 'absolute',
  },
  helpTextContainer: {
    position: 'absolute',
    backgroundColor: '#333',
    marginHorizontal: 5,
    paddingTop: 20,
    paddingHorizontal: 20,
    borderWidth: 2,
    borderColor: '#666',
    borderRadius: 10,
  },
  helpTextTitleRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  helpCloseIconContainer: {
    flexGrow: 1,
    alignItems: 'flex-end',
  },
  helpCloseIcon: {
    color: '#aaa',
  },
  helpTextTitle: {
    marginBottom: 20,
    fontSize: 22,
    color: '#eee',
  },
  helpTextRow: {
    marginBottom: 20,
  },
  helpTextHeading: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2A9FD6',
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  helpText: {fontSize: 15, color: '#ccc'},
});

export default Help;
