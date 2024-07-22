import "./index.css";
import { images } from "../imageBook";
import { Color } from '../constant'
import Score from "./Score";
import Rank from "./Rank";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useCallback, useEffect, useState } from "react";

type SquareState = {
  block: React.ReactElement[];
  color: Color[];
};

/**搜索相连方框 */
function checkLinkedSquare(
  square: Color[], // 假设 Color 是颜色值的类型，但实际上这里应该只是数字索引或颜色代码
  index: number,
  boardWidth: number,
  arr: number[] = []
): number[] {
  // 根据索引得到当前位置
  const position = {
    row: Math.floor(index / boardWidth),
    col: index % boardWidth,
  };

  // 如果当前位置为空，直接返回本次递归
  if (
    square[index] === Color.NULL ||
    square[index] === undefined ||
    square[index] === null
  ) {
    return arr;
  }

  // 如果当前索引已经在 arr 中，说明已经检查过一次了，直接返回本次递归
  if (arr.includes(index)) {
    return arr;
  }
  // 如果以上条件都没有满足，那就直接把当前元素推进去
  arr.push(index); // 将当前索引添加到 arr 中

  // 判断左侧，如果满足就递归该元素，以它为基准再开始递归
  if (position.col > 0 && square[index - 1] === square[index]) {
    checkLinkedSquare(square, index - 1, boardWidth, arr);
  }

  // 判断右侧
  if (position.col < boardWidth - 1 && square[index + 1] === square[index]) {
    checkLinkedSquare(square, index + 1, boardWidth, arr);
  }

  // 判断上侧
  if (position.row > 0 && square[index - boardWidth] === square[index]) {
    checkLinkedSquare(square, index - boardWidth, boardWidth, arr);
  }

  // 判断下侧
  if (
    position.row < Math.floor(square.length / boardWidth) &&
    square[index + boardWidth] === square[index]
  ) {
    checkLinkedSquare(square, index + boardWidth, boardWidth, arr);
  }

  // 返回更新后的 arr
  return arr;
}



export default function Ground() {
  const { state } = useLocation()
  const column: number = state;
  const [squares, setSquares] = useState<SquareState>({
    color: [],
    block: [],
  });
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [showRank, setShowRank] = useState<boolean>(false)
  let navigator = useNavigate()

  const update = useCallback((color: Color[], arr: number[]) => {
    const len = arr.length
    setScore(prev => prev + len * len)
    // 创建一个新的数组，而不是直接修改原数组
    const newColors = [...color];
    const sortArr = [...arr].sort((a, b) => a - b);
    // 使用Map来存储模12的结果及其在原数组中的索引列表  
    const map = new Map();

    // 遍历排序后的数组，计算模12，并更新Map  
    sortArr.forEach((val, index) => {
      const modVal = val % state;
      if (map.has(modVal)) {
        map.set(modVal, [...map.get(modVal), index]);
      } else {
        map.set(modVal, [index]);
      }
    });
    // 获取的是在arr中的索引
    const resMap = new Map()
    for (let i of map.values()) {
      resMap.set(sortArr[i[0]], i.length)
    }
    const getTwelveNElements = (arr: number[], col: number) => {
      for (let i = 0; i < state; i++) {
        // 如果i能被12整除，则将arr[i]添加到result数组中  
        if (arr[i * state + col] !== -1) {
          return i
        }
      }
      return 0;
    }
    for (let [modVal, indices] of resMap) {
      let row = (modVal / state) | 0
      let col = modVal % state
      let top = getTwelveNElements(newColors, col)
      if (row === 0 && indices === 1) {
        newColors[col] = -1
        continue
      }
      for (let i = row + indices - 1; i >= top; i--) {
        newColors[state * i + col] = i >= top + indices ? newColors[state * (i - indices) + col] : -1
      }
    }
    if (newColors.every(item => item === -1))
      setGameOver(true)
    return newColors;
  }, []);
  // 设定一个分数限制，如果达不到就跳到失败重新开始，如果达到了就跳到下一关
  useEffect(() => {
    gameOver && navigator('/next', { state: { score, rank: state }, replace: true })
  }, [gameOver])
  const createSquare = useCallback(
    (value: number, row: number, column: number, color: Color[]) => {
      // 由于我们使用了 Grid 布局，这里不需要计算 left 和 bottom，Grid 会自动处理
      return (
        <div
          key={`${row}-${column}`} // 为每个方块添加唯一的 key
          className="square"
          // 这里直接调用squares.color访问不到更新后的状态，只有作为参数传递进来的时候才能访问到
          onClick={() => {
            const colors = update(
              color,
              checkLinkedSquare(color, row * state + column, state)
            );
            updateSquare(colors)
          }}
        >
          {/* 如果该位置不再存在，就设置为-1，也就是空白 */}
          {value !== -1 ? <img src={images[value]} alt="" /> : <div className="img-null"></div>}
        </div>
      );
    },
    []
  );
  const updateSquare = useCallback((colorArr) => {
    const newBlocks: React.ReactElement[] = [];
    for (let i = 0; i < column; i++) {
      for (let j = 0; j < column; j++) {
        // 为什么newColors一直在被循环迭代，但还是能被createSquare访问到完整的newColors呢
        // 因为传递的实际上是一个引用，也就是说，当你看到所有方块都被呈现出来的时候，你实际上获取到的已经是完整的newColors了
        newBlocks.push(createSquare(colorArr[i * state + j], i, j, colorArr));
      }
    }

    setSquares({
      block: newBlocks,
      color: colorArr,
    });
  }, [])


  // 创建一个二维网格的方块
  useEffect(() => {
    const newBlocks: React.ReactElement[] = [];
    const newColors: number[] = [];
    for (let i = 0; i < column; i++) {
      for (let j = 0; j < column; j++) {
        const value = Math.floor(Math.random() * 5); // 随机生成方块的值
        newColors.push(value);
        // 为什么newColors一直在被循环迭代，但还是能被createSquare访问到完整的newColors呢
        // 因为传递的实际上是一个引用，也就是说，当你看到所有方块都被呈现出来的时候，你实际上获取到的已经是完整的newColors了
        newBlocks.push(createSquare(value, i, j, newColors));
      }
    }
    setSquares({
      block: newBlocks,
      color: newColors,
    });
  }, []);
  return (
    <div>

      <div className="columnGround">
        <div className="leftSide">
          <div className="rankIndex">第 {state - 2} 关</div>
        </div>
        <div className="squareContainer">
          {showRank && <Rank rank={state} />}
          <div
            style={{
              display: "inline-grid",
              gridTemplateColumns: `repeat(${column}, 50px)`,
            }}
          >
            {squares.block}
          </div>
        </div>
        <div className="leftSide rightSide">
          <Score score={score} />
          <button className="score" onClick={() => setShowRank(item=>!item)}>{!showRank?"查看排行榜":"关闭排行榜"}</button>
        </div>

      </div>

    </div>
  );
}
