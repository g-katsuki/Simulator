import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Puyo from './components/Puyo';
import usePuyos from './components/usePuyos';
import NextPuyo from './components/nextPuyo';

const App = () => {
  const {
    grid,
    currentPuyos,
    nextPuyos,
    movePuyos,
    dropPuyos,
    rotatePuyosLeft,
    rotatePuyosRight
  } = usePuyos();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ぷよ通・中辛</Text>
      </View>
      <View style={styles.gameContainer}>
        <View style={styles.grid}>
          {grid.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, cellIndex) => (
                <View key={cellIndex} style={styles.cell}>
                  {cell && <Puyo color={cell} />}
                </View>
              ))}
            </View>
          ))}
          <View
            style={[styles.cell, { top: currentPuyos.puyo1.y * 40, left: currentPuyos.puyo1.x * 40, position: 'absolute' }]}
          >
            <Puyo color={currentPuyos.puyo1.color} />
          </View>
          <View
            style={[styles.cell, { top: currentPuyos.puyo2.y * 40, left: currentPuyos.puyo2.x * 40, position: 'absolute' }]}
          >
            <Puyo color={currentPuyos.puyo2.color} />
          </View>
        </View>
        <View style={styles.nextPieces}>
          <NextPuyo puyos={nextPuyos} />
        </View>
      </View>
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={() => movePuyos(-1, 0)}>
          <Text>←</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={dropPuyos}>
          <Text>↓</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={() => movePuyos(1, 0)}>
          <Text>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={rotatePuyosLeft}>
          <Text>L</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={rotatePuyosRight}>
          <Text>R</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    backgroundColor: '#B40404',
    padding: 25,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  grid: {
    flex: 0,
    backgroundColor: '#333',
    marginRight: 10,
    position: 'relative',
    width: 240,
    height: 480,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  puyo: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  nextPieces: {
    flex: 1,
    backgroundColor: '#848484',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  controlButton: {
    padding: 20,
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
  },
});

export default App;
