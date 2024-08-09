// Component/NextPuyo.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import Puyo from './Puyo';

const NextPuyo = ({ puyos }) => {
  return (
    <View style={styles.container}>
      {puyos.map((puyoSet, index) => (
        <View key={index} style={styles.puyoSet}>
          <Puyo color={puyoSet.puyo1.color} />
          <Puyo color={puyoSet.puyo2.color} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  puyoSet: {
    flexDirection: 'column',
    marginBottom: 10,
  },
});

export default NextPuyo;
