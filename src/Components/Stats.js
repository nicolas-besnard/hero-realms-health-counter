import React, { Component } from 'react'
import PropTypes from 'prop-types'

import {
  Text,
  TouchableHighlight,
  Image,
  View,
  StyleSheet
} from 'react-native'

class Stats extends Component {
  constructor(props) {
   super(props);
  }

  displayCurrentValue = () => {
    const { currentValue, sign, color } = this.props;

    const additionalStyle = {
      color: color
    }

    if (currentValue == 0) {
      return <View style={styles.emptyCurrentValue}></View>;
    }

    return (
      <Text
        style={[styles.currentValue, additionalStyle]}
      >
        {currentValue}
      </Text>
    );
  }

  render() {
    const {
      imagePath,
      onPress
    } = this.props;

    return (
      <View style={styles.container}>
        {this.displayCurrentValue()}
      <TouchableHighlight
        onPress={onPress}
        underlayColor="rgba(92, 210, 78, 0)"
      >
        <Image
          source={imagePath}
          style={styles.actionImage}
        />
      </TouchableHighlight>
    </View>
    );
  }
};

Stats.propTypes = {
  currentValue: PropTypes.number.isRequired,
  imagePath: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column'
  },
  currentValue: {
    fontSize: 30,
    textAlign: 'center',
    height: 40
  },
  emptyCurrentValue: {
    height: 40
  },
  actionImage: {
    width: 100,
    resizeMode: Image.resizeMode.contain,
  },
});

export default Stats;
