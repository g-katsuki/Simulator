// Component/usePuyos.js
import { useState } from 'react';
import { initialGrid, getRandomColor } from './gridUtils';

const usePuyos = () => {
  const [grid, setGrid] = useState(initialGrid);

  const [currentPuyos, setCurrentPuyos] = useState({
    puyo1: { color: getRandomColor(), x: 2, y: 0 },
    puyo2: { color: getRandomColor(), x: 2, y: 1 },
    orientation: 'below', // 'upper', 'right', 'below', 'left'
  });

  const [nextPuyos, setNextPuyos] = useState([
    {
      puyo1: { color: getRandomColor(), x: 0, y: 0 },
      puyo2: { color: getRandomColor(), x: 0, y: 1 },
    },
    {
      puyo1: { color: getRandomColor(), x: 0, y: 0 },
      puyo2: { color: getRandomColor(), x: 0, y: 1 },
    },
  ]);

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

    setGrid(newGrid);

    // 次のぷよを currentPuyos にセットし、ネクストぷよを更新
    setCurrentPuyos({
        puyo1: { ...nextPuyos[0].puyo1, x: 2, y: 0 },
        puyo2: { ...nextPuyos[0].puyo2, x: 2, y: 1 },
        orientation: 'below',
    });

    // ネクストぷよを1つ前にスライドし、新しいぷよを生成
    setNextPuyos([
        nextPuyos[1],
        {
            puyo1: { color: getRandomColor(), x: 0, y: 0 },
            puyo2: { color: getRandomColor(), x: 0, y: 1 },
        },
    ]);
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

  return {
    grid,
    currentPuyos,
    nextPuyos,
    movePuyos,
    dropPuyos,
    rotatePuyosLeft,
    rotatePuyosRight,
  };
};

export default usePuyos;
