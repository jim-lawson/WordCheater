import React from 'react'
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native'

const TitleText = 'WORD CHEATER'

const DefaultTileMargin = 2
const IntroTileMargin = 3
const DefaultTileSize = 40
const IntroTileSize = 48
const IntroStartDelay = 250
const IntroDuration = 1250
const CreditsFadeOutDuration = 250
const CreditsFadeDelay = 500

class Title extends React.Component {
  constructor(props) {
    super(props)

    this.screenWidth = Math.round(Dimensions.get('window').width)
    this.screenHeight = Math.round(Dimensions.get('window').height)

    this.title = TitleText.split(' ')

    this.introMarginTop = Math.round(this.screenHeight / 2) - IntroTileSize * 2

    const startX = 170
    const startY = this.introMarginTop

    const radius = 500

    const letterCount = this.title.reduce((a, b) => a.length + b.length)

    const angleIncrement = (2 * Math.PI) / letterCount

    const startAngle = 310

    const startAngleAdjustment = (startAngle / 360) * 2 * Math.PI

    const titleLetterPositions = new Array(letterCount)
      .fill()
      .map((_, index) => {
        const x =
          startX +
          radius * Math.sin(angleIncrement * index + startAngleAdjustment)
        const y =
          startY -
          radius * Math.cos(angleIncrement * index + startAngleAdjustment)

        return { x, y }
      })

    const titleLetterRowPositions = [
      titleLetterPositions.slice(0, 4),
      titleLetterPositions.slice(4).reverse()
    ]

    this.state = {
      playingIntro: true,
      titleLetterAnimations: this.title.map((titleRow, rowIndex) =>
        titleRow.split('').map((letter, letterIndex) => {
          return {
            left: new Animated.Value(
              titleLetterRowPositions[rowIndex][letterIndex].x
            ),
            top: new Animated.Value(
              titleLetterRowPositions[rowIndex][letterIndex].y
            ),
            width: new Animated.Value(IntroTileSize),
            height: new Animated.Value(IntroTileSize)
          }
        })
      ),
      letterRotation: new Animated.Value(0),
      creditsFade: new Animated.Value(1),
      creditsTop: new Animated.Value(parseInt(this.screenHeight / 2) - 47)
    }
  }

  animateTitle() {
    const { topMargin } = this.props
    const { playingIntro } = this.state

    this.state.titleLetterAnimations.forEach((row, rowIndex) => {
      const tileWidth = playingIntro ? IntroTileSize : DefaultTileSize
      const tileMargin = playingIntro ? IntroTileMargin : DefaultTileMargin
      const rowWidth = tileWidth * row.length + tileMargin * row.length - 1
      const rowLeftOffset = Math.round(this.screenWidth / 2 - rowWidth / 2)

      row.forEach((letter, letterIndex) => {
        const letterMoveDealyOffset = Math.round(Math.random() * 500)
        Animated.timing(letter.left, {
          toValue:
            rowLeftOffset +
            letterIndex *
              ((playingIntro ? IntroTileSize : DefaultTileSize) +
                (playingIntro ? IntroTileMargin : DefaultTileMargin)),
          duration: IntroDuration,
          delay: IntroStartDelay + letterMoveDealyOffset
        }).start()
        Animated.timing(letter.top, {
          toValue:
            (playingIntro ? this.introMarginTop : topMargin) +
            rowIndex *
              ((playingIntro ? IntroTileSize : DefaultTileSize) +
                (playingIntro ? IntroTileMargin : DefaultTileMargin)),
          duration: IntroDuration,
          delay: IntroStartDelay + letterMoveDealyOffset
        }).start()
        Animated.timing(letter.width, {
          toValue: playingIntro ? IntroTileSize : DefaultTileSize,
          duration: IntroDuration,
          delay: IntroStartDelay
        }).start()
        Animated.timing(letter.height, {
          toValue: playingIntro ? IntroTileSize : DefaultTileSize,
          duration: IntroDuration,
          delay: IntroStartDelay
        }).start()
      })
    })
    Animated.timing(this.state.letterRotation, {
      toValue: 1,
      duration: IntroDuration,
      delay: IntroStartDelay
    }).start()
    Animated.timing(this.state.creditsFade, {
      toValue: playingIntro ? 1 : 0,
      duration: CreditsFadeOutDuration,
      delay: playingIntro ? CreditsFadeDelay : 0
    }).start()
    Animated.timing(this.state.creditsTop, {
      toValue: parseInt(this.screenWidth / 2) + parseInt(this.screenHeight / 3),
      duration: 1000,
      delay: 250
    }).start()
  }

  componentDidMount() {
    this.animateTitle()
    setTimeout(() => {
      this.setState({ playingIntro: false })
    }, 3500)
  }

  componentDidUpdate() {
    if (!this.state.playingIntro) {
      this.animateTitle()
      setTimeout(() => {
        this.props.onIntroComplete()
      }, 1750)
    }
  }

  render() {
    const rotateRight = this.state.letterRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })
    const rotateLeft = this.state.letterRotation.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '-360deg']
    })

    return (
      <View>
        {this.title.map((titleRow, rowIndex) =>
          titleRow.split('').map((letter, letterIndex) => {
            return (
              <Animated.View
                key={letterIndex}
                style={[
                  styles.titleLetter,
                  {
                    left: this.state.titleLetterAnimations[rowIndex][
                      letterIndex
                    ].left,
                    top: this.state.titleLetterAnimations[rowIndex][letterIndex]
                      .top,
                    width: this.state.titleLetterAnimations[rowIndex][
                      letterIndex
                    ].width,
                    height: this.state.titleLetterAnimations[rowIndex][
                      letterIndex
                    ].height,
                    transform: [
                      {
                        rotate: letterIndex % 2 === 0 ? rotateRight : rotateLeft
                      }
                    ]
                  }
                ]}
              >
                <Text style={[styles.titleText]}>{letter}</Text>
              </Animated.View>
            )
          })
        )}
        <View style={styles.creditsContainer}>
          <Animated.View
            style={[
              styles.credits,
              {
                opacity: this.state.creditsFade,
                top: this.state.creditsTop
              }
            ]}
          >
            <Text style={styles.creditsText}>@JimLawson_dev</Text>
          </Animated.View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  titleLetter: {
    position: 'absolute',
    borderColor: '#000',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#2A9FD6',
    justifyContent: 'center'
  },
  titleText: { fontSize: 30, textAlign: 'center' },
  creditsContainer: {
    alignItems: 'center'
  },
  credits: {
    position: 'absolute'
  },
  creditsText: {
    fontSize: 19.5,
    color: '#999',
    fontWeight: '800'
  }
})

export default Title
