// Component/Puyo.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Puyo = ({ color }) => (
  <View style={[styles.puyo, { backgroundColor: color }]} />
);

const styles = StyleSheet.create({
  puyo: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
});

export default Puyo;
