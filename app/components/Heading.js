import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

const Heading = props => {
  const { headingText } = props
  return (
    <View>
      <Text style={styles.heading}>{headingText}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2A9FD6',
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10
  }
})

export default Heading
