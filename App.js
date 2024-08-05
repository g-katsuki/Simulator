import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const initialGrid = Array.from({ length: 12 }, () => Array(6).fill(null));
const colors = ['red', 'blue', 'green', 'yellow'];

const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];

const Puyo = ({ color }) => (
  <View style={[styles.puyo, { backgroundColor: color }]} />
);

const App = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [currentPuyos, setCurrentPuyos] = useState({
    puyo1: { color: getRandomColor(), x: 2, y: 0 },
    puyo2: { color: getRandomColor(), x: 2, y: 1 },
    orientation: 'vertical', // 'vertical' or 'horizontal'
  });

  const movePuyos = (dx, dy) => {
    const newPuyo1X = currentPuyos.puyo1.x + dx;
    const newPuyo1Y = currentPuyos.puyo1.y + dy;
    const newPuyo2X = currentPuyos.puyo2.x + dx;
    const newPuyo2Y = currentPuyos.puyo2.y + dy;

    if (
      newPuyo1X >= 0 && newPuyo1X < 6 && newPuyo1Y >= 0 && newPuyo1Y < 12 && !grid[newPuyo1Y][newPuyo1X] &&
      newPuyo2X >= 0 && newPuyo2X < 6 && newPuyo2Y >= 0 && newPuyo2Y < 12 && !grid[newPuyo2Y][newPuyo2X]
    ) {
      setCurrentPuyos({
        ...currentPuyos,
        puyo1: { ...currentPuyos.puyo1, x: newPuyo1X, y: newPuyo1Y },
        puyo2: { ...currentPuyos.puyo2, x: newPuyo2X, y: newPuyo2Y },
      });
    }
  };

  const dropPuyos = () => {
    let newPuyo1Y = currentPuyos.puyo1.y;
    let newPuyo2Y = currentPuyos.puyo2.y;
    let canDrop = true;

    while (canDrop) {
      newPuyo1Y++;
      newPuyo2Y++;
      if (
        newPuyo1Y >= 12 || newPuyo2Y >= 12 ||
        grid[newPuyo1Y] && grid[newPuyo1Y][currentPuyos.puyo1.x] ||
        grid[newPuyo2Y] && grid[newPuyo2Y][currentPuyos.puyo2.x]
      ) {
        newPuyo1Y--;
        newPuyo2Y--;
        canDrop = false;
      }
    }

    const newGrid = grid.map(row => [...row]);
    newGrid[newPuyo1Y][currentPuyos.puyo1.x] = currentPuyos.puyo1.color;
    newGrid[newPuyo2Y][currentPuyos.puyo2.x] = currentPuyos.puyo2.color;
    setGrid(newGrid);
    setCurrentPuyos({
      puyo1: { color: getRandomColor(), x: 2, y: 0 },
      puyo2: { color: getRandomColor(), x: 2, y: 1 },
      orientation: 'vertical',
    });
  };

  const rotatePuyos = () => {
    const { puyo1, puyo2, orientation } = currentPuyos;
    let newPuyo2;
    if (orientation === 'vertical') {
      newPuyo2 = { ...puyo2, x: puyo1.x + 1, y: puyo1.y };
      if (newPuyo2.x < 6 && !grid[newPuyo2.y][newPuyo2.x]) {
        setCurrentPuyos({ puyo1, puyo2: newPuyo2, orientation: 'horizontal' });
      }
    } else {
      newPuyo2 = { ...puyo2, x: puyo1.x, y: puyo1.y + 1 };
      if (newPuyo2.y < 12 && !grid[newPuyo2.y][newPuyo2.x]) {
        setCurrentPuyos({ puyo1, puyo2: newPuyo2, orientation: 'vertical' });
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>ぷよ通・中辛</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          専門スタッフがお客様のお品物を1点1点丁寧に査定いたします。まずはお気軽にご相談下さい！
        </Text>
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
            style={[styles.cell, { top: currentPuyos.puyo1.y * 30, left: currentPuyos.puyo1.x * 30, position: 'absolute' }]}
          >
            <Puyo color={currentPuyos.puyo1.color} />
          </View>
          <View
            style={[styles.cell, { top: currentPuyos.puyo2.y * 30, left: currentPuyos.puyo2.x * 30, position: 'absolute' }]}
          >
            <Puyo color={currentPuyos.puyo2.color} />
          </View>
        </View>
        <View style={styles.nextPieces}>
          {/* 次のピースの表示場所 */}
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
        <TouchableOpacity style={styles.controlButton} onPress={rotatePuyos}>
          <Text>回転</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#FF6F61',
    padding: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    color: '#fff',
  },
  infoBox: {
    backgroundColor: '#FFF8DC',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  infoText: {
    fontSize: 12,
    color: '#333',
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  grid: {
    flex: 3,
    backgroundColor: '#333',
    marginRight: 10,
    position: 'relative',
    width: 180,
    height: 360,
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 30,
    height: 30,
    borderWidth: 1,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  puyo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  nextPieces: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  controlButton: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    borderRadius: 5,
  },
});

export default App;
