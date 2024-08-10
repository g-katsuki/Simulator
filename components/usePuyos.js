// Component/usePuyos.js
import { useState } from 'react';
import { initialGrid, getRandomColor } from './gridUtils';

const usePuyos = () => {
  const [grid, setGrid] = useState(initialGrid);
  const [history, setHistory] = useState([]);
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

  const saveHistory = () => {
    setHistory([...history, { grid: JSON.parse(JSON.stringify(grid)), currentPuyos, nextPuyos }]);
  };

  const undoMove = () => {
    if (history.length > 0) {
      const previousState = history.pop();
      setGrid(previousState.grid);
      setCurrentPuyos(previousState.currentPuyos);
      setNextPuyos(previousState.nextPuyos);
      setHistory(history);
    }
  };

  const resetGame = () => {
    setGrid(initialGrid);
    setCurrentPuyos({
      puyo1: { color: getRandomColor(), x: 2, y: 0 },
      puyo2: { color: getRandomColor(), x: 2, y: 1 },
      orientation: 'below',
    });
    setNextPuyos([
      {
        puyo1: { color: getRandomColor(), x: 0, y: 0 },
        puyo2: { color: getRandomColor(), x: 0, y: 1 },
      },
      {
        puyo1: { color: getRandomColor(), x: 0, y: 0 },
        puyo2: { color: getRandomColor(), x: 0, y: 1 },
      },
    ]);
    setHistory([]);
  };

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

  const dropPuyos = async () => {
    saveHistory();
    let newGrid = grid.map(row => [...row]);
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
  
    const processChains = async () => {
      let chainOccurred;
  
      do {
        chainOccurred = false;
        setGrid(initialGrid);
  
        // マッチのチェック
        const matches = checkForMatches(newGrid);
  
        if (matches.length > 0) {
          // グリッドの更新
          setGrid(newGrid);
  
          // ここで一定時間待機（連鎖を視覚的に確認するため）
          await new Promise(resolve => setTimeout(resolve, 300)); // 500ms待機
  
          // マッチがあれば消去
          newGrid = clearMatches(newGrid, matches);
  
          // 消えた後の空中ぷよを落とす
          newGrid = dropFloatingPuyos(newGrid);
  
          // 連鎖が発生したのでフラグを立てる
          chainOccurred = true;
        }
      } while (chainOccurred); // 連鎖が発生する限り繰り返す
  
      // グリッドの更新
      setGrid(newGrid);

      // currentPuyosをnextPuyos[0]で更新し、nextPuyos[1]を新しいnextPuyos[0]にする
      setCurrentPuyos({
        puyo1: { ...nextPuyos[0].puyo1, x: 2, y: 0 },
        puyo2: { ...nextPuyos[0].puyo2, x: 2, y: 1 },
        orientation: 'below',
      });
  
      // nextPuyosをスライドさせ、新しいランダムなぷよを追加
      setNextPuyos([
        nextPuyos[1],
        {
          puyo1: { color: getRandomColor(), x: 0, y: 0 },
          puyo2: { color: getRandomColor(), x: 0, y: 1 },
          orientation: 'below',
        },
      ]);
    };
  
    await processChains();
  };

  const checkForMatches = (grid) => {
    const matches = [];
    const visited = Array.from({ length: 12 }, () => Array(6).fill(false));

    for (let y = 0; y < 12; y++) {
        for (let x = 0; x < 6; x++) {
            if (!visited[y][x] && grid[y][x]) {
                const connectedPuyos = findConnectedPuyos(grid, x, y, visited);
                if (connectedPuyos.length >= 4) {
                    matches.push(connectedPuyos);
                }
            }
        }
    }
    return matches;
  };

  const clearMatches = (grid, matches) => {
    matches.forEach(group => {
        group.forEach(({ x, y }) => {
            grid[y][x] = null;
        });
    });
    return grid;
  };

  const findConnectedPuyos = (grid, startX, startY, visited) => {
    const stack = [{ x: startX, y: startY }];
    const connectedPuyos = [];
    const color = grid[startY][startX];

    while (stack.length > 0) {
        const { x, y } = stack.pop();

        if (x < 0 || x >= 6 || y < 0 || y >= 12 || visited[y][x] || grid[y][x] !== color) {
            continue;
        }

        visited[y][x] = true;
        connectedPuyos.push({ x, y });

        stack.push({ x: x + 1, y }); // 右
        stack.push({ x: x - 1, y }); // 左
        stack.push({ x, y: y + 1 }); // 下
        stack.push({ x, y: y - 1 }); // 上
    }

    return connectedPuyos;
  };

  const dropFloatingPuyos = (grid) => {
    for (let x = 0; x < 6; x++) {
        for (let y = 10; y >= 0; y--) { // 上から順に確認
            if (grid[y][x] && !grid[y + 1][x]) { // 現在のぷよがあって、その下が空なら
                let newY = y;
                while (newY < 11 && !grid[newY + 1][x]) {
                    newY++;
                }
                grid[newY][x] = grid[y][x]; // 下に移動
                grid[y][x] = null; // 元の場所を空にする
            }
        }
    }
    return grid;
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
    undoMove,
    resetGame,
  };
};

export default usePuyos;
