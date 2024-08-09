// Component/Puyo.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

const Puyo = ({ color }) => (
  <View style={[styles.puyo, { backgroundColor: color }]} />
);

const styles = StyleSheet.create({
  puyo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});

export default Puyo;
