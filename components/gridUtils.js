// Component/gridUtils.js
export const initialGrid = Array.from({ length: 12 }, () => Array(6).fill(null));
export const colors = ['red', 'blue', 'green', 'yellow'];

export const getRandomColor = () => colors[Math.floor(Math.random() * colors.length)];