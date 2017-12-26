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

import Stats from './Components/Stats';

let window = Dimensions.get('window')

const logoImage = require('./images/logo.png');
const healthImage = require('./images/health-icon.png');
const damageImage = require('./images/damage-icon.png');

export default class App extends Component<{}> {
  constructor(props) {
    super(props);

    this.state = {
      counter: 50,
      health: 0,
      damage: 0
    };

    AsyncStorage.getItem('health', function (err, value) {
      const savedValue = JSON.parse(value);
      this.setHealth(JSON.parse(value) || 50)
    }.bind(this));

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
    this.cancelActions();
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

  incrementStats = (stats) => () => {
    this.setState((prevState, props) => {
      const newValue = prevState[stats] + 1;

      return {
        [stats]: newValue
      };
    });
  };

  validateAction = () => {
    this.setState((prevState, props) => {
      const { health: currentHealth, damage: currentDamage } = prevState;
      const newValue = prevState.counter + currentHealth - currentDamage;

      try {
        AsyncStorage.setItem('health', JSON.stringify(newValue));
      } catch (error) {
        // Error saving data
      }

      return {
        health: 0,
        damage: 0,
        counter: newValue
      }
    });
  }

  cancelActions = () => {
    this.setState({
      health: 0,
      damage: 0,
    });
  };

  hasActions() {
    const { health: currentHealth, damage: currentDamage } = this.state;

    return currentHealth > 0 || currentDamage > 0;
  }

  renderValidateButton = () => { 
    if (this.hasActions()) {
      return (
        <View>
          <TouchableHighlight
            style={styles.validateButton}
            underlayColor="rgba(0, 0, 0, 0)"
            color="rgba(0, 0, 0, 0)"
            onPress={this.validateAction}
          >
            <Text style={styles.validateButtonText}>Done?</Text>
          </TouchableHighlight>
        </View>
      );
    } else {
      // Need an empty element has `TouchableHighlight` can't have no child
      // This also prevent the UI to "bump" when the text appears
      return (
        <View style={styles.validateButton}>
          <Text style={styles.validateButtonText}></Text>
        </View>
      );
    }
  }

  renderCancelActionsButton = () => {
    if (this.hasActions()) {
      return (
        <View>
          <TouchableHighlight
            style={styles.validateButton}
            underlayColor="rgba(0, 0, 0, 0)"
            color="rgba(0, 0, 0, 0)"
            onPress={this.cancelActions}
          >
            <Text style={styles.validateButtonText}>Cancel Actions?</Text>
          </TouchableHighlight>
        </View>
      );
    } else {
      return (
        <View style={styles.validateButton}>
          <Text style={styles.validateButtonText}></Text>
        </View>
      );
    }
  }

  render() {
    const { health: currentHealth, damage: currentDamage } = this.state;

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
          <Stats
            currentValue={currentDamage}
            onPress={this.incrementStats('damage')}
            imagePath={damageImage}
            color="rgb(232, 40, 40)"
            style={{flexGrow: 25}}
          />
          <View style={styles.healthAndReset}>
            {this.renderValidateButton()}

            <View style={styles.healthTextContainer}>
              <Text style={styles.healthText}>
                {this.state.counter}
              </Text>
            </View>
          </View>
          <Stats
            currentValue={currentHealth}
            onPress={this.incrementStats('health')}
            imagePath={healthImage}
            color="rgb(92, 210, 78)"
            style={{flexGrow: 25}}
          />
        </View>
        {this.renderCancelActionsButton()}
        <View>
          <TouchableHighlight
            style={styles.button}
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
  healthAndReset: {
    flex: 1,
    flexDirection: 'column'
  },
  actionImage: {
    width: 100,
    resizeMode: Image.resizeMode.contain,
  },
  healthContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  healthTextContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  healthText: {
    fontSize: 60,
    textAlign: 'center',
  },
  validateButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  validateButtonText: {
    textAlign: 'center',
    fontSize: 20,
    lineHeight: 40,
    height: 40
  },
  resetButton: {
    color: 'red'
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  button: {
    alignItems: 'center',
  },
});
