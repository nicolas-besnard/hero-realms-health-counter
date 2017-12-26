/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableHighlight,
  Alert,
  Dimensions,
  AsyncStorage
} from 'react-native';

import KeepAwake from 'react-native-keep-awake';

let window = Dimensions.get('window')

const logoImage = require('./images/logo.png');
const healthImage = require('./images/health-icon.png');
const damageImage = require('./images/damage-icon.png');

export default class App extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      counter: 50
    };

    AsyncStorage.getItem('health', function (err, value) {
      const savedValue = JSON.parse(value);
      this.setHealth(JSON.parse(value) || 50)
    }.bind(this));

    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.setHealth = this.setHealth.bind(this);
    this.onResetGame = this.onResetGame.bind(this);
    this.resetgame = this.resetGame.bind(this);
  }

  onResetGame() {
    Alert.alert(
      'Reset Game',
      'Are you sure?',
      [
        {text: 'Confirm', onPress: () => this.resetGame() },
        {text: 'Cancel', style: 'cancel'},
      ],
      { cancelable: true }
    )
  }

  resetGame() {
    this.setHealth(50);
  }

  setHealth(newHealth) {
    this.setState((prevState, props) => {
      try {
        AsyncStorage.setItem('health', JSON.stringify(newHealth));
      } catch (error) {
        // Error saving data
      }

      return {
        counter: newHealth
      };
    });
  }

  increment() {
    this.setState((prevState, props) => {
      const newHealth = prevState.counter + 1;

      try {
        AsyncStorage.setItem('health', JSON.stringify(newHealth));
      } catch (error) {
        // Error saving data
      }

      return {
        counter: newHealth
      };
    });
  }

  decrement() {
    this.setState((prevState, props) => {
      const newHealth = prevState.counter - 1;

      try {
        AsyncStorage.setItem('health', JSON.stringify(newHealth));
      } catch (error) {
        // Error saving data
      }

      return {
        counter: newHealth
      };
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <KeepAwake />
        <View >
          <Image
            source={logoImage}
            resizeMode="contain"
            style={{width: window.width, height: 200}}
          />
        </View>
        <View style={styles.healthContainer}>
          <TouchableHighlight
            style={[styles.button, styles.decrementButton]}
            onPress={this.decrement}
            underlayColor="rgba(232, 40, 40, 0)"
          >
            <Image
              source={damageImage}
              style={styles.actionImage}
            />
          </TouchableHighlight>

          <Text style={styles.health}>
            {this.state.counter}
          </Text>
          <TouchableHighlight
            style={[styles.button, styles.incrementButton]}
            underlayColor="rgba(92, 210, 78, 0)"
            onPress={this.increment}
          >
            <Image
              source={healthImage} 
              style={styles.actionImage}
            />
          </TouchableHighlight>
        </View>
        <View>
          <TouchableHighlight
            style={[styles.button, styles.incrementButton]}
            underlayColor="blue"
            onPress={this.onResetGame}
          >
            <Text style={{color: 'blue'}}>Reset Game</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  actionImage: {
    width: 100,
    resizeMode: Image.resizeMode.contain,
  },
  healthContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  health: {
    fontSize: 50,
    flexGrow: 50,
    textAlign: 'center'
  },
  resetButton: {
    color: 'red'
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  button: {
    alignItems: 'center',
    flexGrow: 25,
  },
});
