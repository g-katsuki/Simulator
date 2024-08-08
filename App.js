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
    orientation: 'below', // 'upper', 'right', 'below', 'left'
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

  const chigiri = (newGrid, puyo, x, y) => {
    let canDrop = true;
    while (canDrop) {
        if (y + 1 >= 12 || newGrid[y + 1][x]) {
            canDrop = false;
        } else {
            y++;
        }
    }
    newGrid[y][x] = puyo.color;
    return newGrid;
  };

  const dropPuyos = () => {
    const newGrid = grid.map(row => [...row]);
    const { puyo1, puyo2 } = currentPuyos;

    if (puyo1.y < puyo2.y) {
      // Puyo2を落とす
      let newPuyo2Y = puyo2.y;
      while (newPuyo2Y < 11 && !newGrid[newPuyo2Y + 1][puyo2.x]) {
          newPuyo2Y++;
      }

      newGrid[newPuyo2Y][puyo2.x] = puyo2.color;
      // Puyo1を落とす
      let newPuyo1Y = puyo1.y;
      while (newPuyo1Y < 11 && !newGrid[newPuyo1Y + 1][puyo1.x]) {
          newPuyo1Y++;
      }
      newGrid[newPuyo1Y][puyo1.x] = puyo1.color;
    } else {
      // Puyo1を落とす
      let newPuyo1Y = puyo1.y;
      while (newPuyo1Y < 11 && !newGrid[newPuyo1Y + 1][puyo1.x]) {
          newPuyo1Y++;
      }
      newGrid[newPuyo1Y][puyo1.x] = puyo1.color;

      // Puyo2を落とす
      let newPuyo2Y = puyo2.y;
      while (newPuyo2Y < 11 && !newGrid[newPuyo2Y + 1][puyo2.x]) {
          newPuyo2Y++;
      }
      newGrid[newPuyo2Y][puyo2.x] = puyo2.color;
    }

    // if (newPuyo1Y > newPuyo2Y) {
    //   newGrid[newPuyo1Y][puyo1.x] = puyo1.color;
    //   newGrid[newPuyo2Y][puyo2.x] = puyo2.color;
    // } else {
    //   newGrid[newPuyo2Y][puyo2.x] = puyo2.color;
    //   newGrid[newPuyo1Y][puyo1.x] = puyo1.color;
    // }

    setGrid(newGrid);
    setCurrentPuyos({
        puyo1: { color: getRandomColor(), x: 2, y: 0 },
        puyo2: { color: getRandomColor(), x: 2, y: 1 },
        orientation: 'below',
    });
};

  const rotatePuyosLeft = () => {
    const { puyo1, puyo2, orientation } = currentPuyos;
    const pivot = puyo2; // 軸ぷよはpuyo2とする

    let newPuyo1;
    if (orientation === 'upper') {
      newPuyo1 = { ...puyo1, x: pivot.x + 1, y: pivot.y };
      if (newPuyo1.x < 6 && !grid[newPuyo1.y][newPuyo1.x]) {
        setCurrentPuyos({ puyo1: newPuyo1, puyo2: pivot, orientation: 'left' });
      }
    }
    else if (orientation === 'left'){
      newPuyo1 = { ...puyo1, x: pivot.x, y: pivot.y - 1 };
      if (newPuyo1.y >= 0 && !grid[newPuyo1.y][newPuyo1.x]) {
        setCurrentPuyos({ puyo1: newPuyo1, puyo2: pivot, orientation: 'below' });
      }
    }
    else if (orientation === 'below'){
      newPuyo1 = { ...puyo1, x: pivot.x - 1, y: pivot.y};
      if (newPuyo1.y >= 0 && !grid[newPuyo1.y][newPuyo1.x]) {
        setCurrentPuyos({ puyo1: newPuyo1, puyo2: pivot, orientation: 'right' });
      }
    }
    else if (orientation === 'right'){
      newPuyo1 = { ...puyo1, x: pivot.x, y: pivot.y + 1 };
      if (newPuyo1.y >= 0 && !grid[newPuyo1.y][newPuyo1.x]) {
        setCurrentPuyos({ puyo1: newPuyo1, puyo2: pivot, orientation: 'upper' });
      }
    }
  };

  const rotatePuyosRight = () => {
    const { puyo1, puyo2, orientation } = currentPuyos;
    const pivot = puyo2; // 軸ぷよはpuyo2とする

    let newPuyo1;
    if (orientation === 'upper') {
      newPuyo1 = { ...puyo1, x: pivot.x - 1, y: pivot.y };
      if (newPuyo1.x < 6 && !grid[newPuyo1.y][newPuyo1.x]) {
        setCurrentPuyos({ puyo1: newPuyo1, puyo2: pivot, orientation: 'right' });
      }
    }
    else if (orientation === 'right'){
      newPuyo1 = { ...puyo1, x: pivot.x, y: pivot.y - 1 };
      if (newPuyo1.y >= 0 && !grid[newPuyo1.y][newPuyo1.x]) {
        setCurrentPuyos({ puyo1: newPuyo1, puyo2: pivot, orientation: 'below' });
      }
    }
    else if (orientation === 'below'){
      newPuyo1 = { ...puyo1, x: pivot.x + 1, y: pivot.y};
      if (newPuyo1.y >= 0 && !grid[newPuyo1.y][newPuyo1.x]) {
        setCurrentPuyos({ puyo1: newPuyo1, puyo2: pivot, orientation: 'left' });
      }
    }
    else if (orientation === 'left'){
      newPuyo1 = { ...puyo1, x: pivot.x, y: pivot.y + 1 };
      if (newPuyo1.y >= 0 && !grid[newPuyo1.y][newPuyo1.x]) {
        setCurrentPuyos({ puyo1: newPuyo1, puyo2: pivot, orientation: 'upper' });
      }
    }
  };

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
        <TouchableOpacity style={styles.controlButton} onPress={rotatePuyosLeft}>
          <Text>左</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={rotatePuyosRight}>
          <Text>右</Text>
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
