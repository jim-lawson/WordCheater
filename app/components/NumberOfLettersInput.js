import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/MaterialIcons';

const NumberOfLettersInput = props => {
  const {value, minimumValue, maximumValue, onChange, onCleared} = props;
  return (
    <View style={styles.numberOfLetters}>
      <View style={styles.sliderRow}>
        <Slider
          value={value}
          onValueChange={onChange}
          minimumValue={minimumValue}
          maximumValue={maximumValue}
          step={1}
          minimumTrackTintColor="#555"
          maximumTrackTintColor="#333"
          thumbTintColor="#aaa"
          style={{width: 200, height: 40}}
        />
        <View>
          <Text style={styles.sliderValue}>{value}</Text>
        </View>
        <View>
          <TouchableOpacity>
            <Icon
              style={{
                color: '#999',
                marginLeft: 35,
              }}
              name="close"
              size={35}
              onPress={onCleared}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  numberOfLetters: {alignItems: 'center'},
  sliderRow: {flexDirection: 'row', alignItems: 'center'},
  sliderValue: {fontSize: 30, color: '#FF8800', marginLeft: 10},
});

export default NumberOfLettersInput;
