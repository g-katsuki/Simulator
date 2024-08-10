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
    rotatePuyosRight,
    undoMove,
    resetGame,
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
            style={[styles.cell, { top: currentPuyos.puyo1.y * 38, left: currentPuyos.puyo1.x * 38, position: 'absolute' }]}
          >
            <Puyo color={currentPuyos.puyo1.color} />
          </View>
          <View
            style={[styles.cell, { top: currentPuyos.puyo2.y * 38, left: currentPuyos.puyo2.x * 38, position: 'absolute' }]}
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
      <View style={styles.controlsBelow}>
        <TouchableOpacity style={styles.controlButtonBelow} onPress={undoMove}>
          <Text>戻す</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
          <Text>リセット</Text>
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
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 16,
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
    width: 228,
    height: 456,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 38,
    height: 38,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  puyo: {
    width: 34,
    height: 34,
    borderRadius: 17,
  },
  nextPieces: {
    flex: 1,
    backgroundColor: '#848484',
    height: 456,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    bottom: 10,
  },
  controlButton: {
    padding: 24,
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
  },
  controlsBelow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 0,
    bottom: 0,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  controlButtonBelow: {
    padding: 12,
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
    marginRight: 200,
  },
  resetButton: {
    padding: 12,
    backgroundColor: '#D8D8D8',
    borderRadius: 5,
  },
});

export default App;
