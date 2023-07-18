import React, { useEffect, useRef, useState } from 'react';
import PropTypes, { node } from 'prop-types';

import './GameBoard.scss';

/* eslint quote-props: 0 */
class Node {
  #x;
  #y;
  neighbors = new Set();
  #hasBomb;
  #neighborsWithBombs;
  #searched;
  isShowing;

  constructor(x, y, hasBomb = false) {
    this.#x = x;
    this.#y = y;
    this.#neighborsWithBombs = 0;
    this.#searched = false;
    this.#hasBomb = hasBomb;
    this.isShowing = false;
  }

  getSearched() {
    return this.#searched;
  }

  setSearched(val) {
    this.#searched = val;
  }

  getNeighborsWithBombs() {
    return this.#neighborsWithBombs;
  }

  getX() {
    return this.#x;
  }
  getY() {
    return this.#y;
  }

  addNeighbor(node) {
    this.neighbors.add(node);
  }

  addNeighborWithBomb() {
    this.#neighborsWithBombs += 1;
  }

  setBomb() {
    this.#hasBomb = true;
  }

  isBomb() {
    return this.#hasBomb;
  }

  toString() {
    return `${this.#x},${this.#y}`;
  }
}
class Board {
  #size;
  #nodes;
  #bombs;
  #totalBombs;
  constructor(size, totalBombs) {
    this.#size = size;
    this.#nodes = new Map();
    this.#bombs = new Set();
    this.#totalBombs = totalBombs;
    this.generateBoard();
  }

  getSize() {
    return this.#size;
  }

  getNodes() {
    return this.#nodes;
  }

  generateBoard() {
    this.initNodes();
    this.placeBombs();
  }

  initNodes() {
    for (let i = 0; i < this.#size; i++) {
      const firstRow = i === 0;
      const lastRow = i === this.#size - 1;
      for (let j = 0; j < this.#size; j++) {
        const firstCol = j === 0;
        const lastCol = j === this.#size - 1;
        const node = new Node(i, j);
        if (firstRow && firstCol) {
          node.addNeighbor(new Node(i + 1, j));
          node.addNeighbor(new Node(i, j + 1));
          node.addNeighbor(new Node(i + 1, j + 1));
        } else if (firstRow && lastCol) {
          node.addNeighbor(new Node(i, j - 1)); // same row prev col
          node.addNeighbor(new Node(i + 1, j)); // next row same col
          node.addNeighbor(new Node(i + 1, j - 1)); // next row prev col
        } else if (lastRow && firstCol) {
          node.addNeighbor(new Node(i - 1, j)); // prev row same col
          node.addNeighbor(new Node(i - 1, j + 1)); // prev row next col
          node.addNeighbor(new Node(i, j + 1)); // same row next col
        } else if (lastRow && lastCol) {
          node.addNeighbor(new Node(i - 1, j - 1)); // prev row prev col
          node.addNeighbor(new Node(i - 1, j)); // prev row same col
          node.addNeighbor(new Node(i, j - 1)); // same row prev col
        } else if (firstRow) {
          node.addNeighbor(new Node(i, j - 1)); // same row prev col
          node.addNeighbor(new Node(i, j + 1)); // same row next col
          node.addNeighbor(new Node(i + 1, j - 1)); // next row prev col
          node.addNeighbor(new Node(i + 1, j)); // next row same col
          node.addNeighbor(new Node(i + 1, j + 1)); // next row next col
        } else if (lastRow) {
          node.addNeighbor(new Node(i, j - 1)); // same row prev col
          node.addNeighbor(new Node(i, j + 1)); // same row next col
          node.addNeighbor(new Node(i - 1, j - 1)); // prev row prev col
          node.addNeighbor(new Node(i - 1, j)); // prev row same col
          node.addNeighbor(new Node(i - 1, j + 1)); // prev row next col
        } else if (firstCol) {
          node.addNeighbor(new Node(i - 1, j));// prev row same col
          node.addNeighbor(new Node(i - 1, j + 1));// prev row next col
          node.addNeighbor(new Node(i, j + 1));// same row next col
          node.addNeighbor(new Node(i + 1, j));// next row same col
          node.addNeighbor(new Node(i + 1, j + 1));// next row prev col
        } else if (lastCol) {
          node.addNeighbor(new Node(i - 1, j - 1)); // prev row prev col
          node.addNeighbor(new Node(i - 1, j)); // prev row same col
          node.addNeighbor(new Node(i, j - 1)); // same row prev col
          node.addNeighbor(new Node(i + 1, j - 1)); // next row prev col
          node.addNeighbor(new Node(i + 1, j)); // next row same col
        } else {
          node.addNeighbor(new Node(i - 1, j - 1)); // prev row prev col
          node.addNeighbor(new Node(i - 1, j)); // prev row same col
          node.addNeighbor(new Node(i - 1, j + 1)); // prev row next col
          node.addNeighbor(new Node(i, j - 1)); // same row prev col
          node.addNeighbor(new Node(i, j + 1)); // same row next col
          node.addNeighbor(new Node(i + 1, j - 1)); // next row prev col
          node.addNeighbor(new Node(i + 1, j)); // next row same col
          node.addNeighbor(new Node(i + 1, j + 1)); // next row prev col
        }
        this.#nodes.set(`${node.getX()},${node.getY()}`, node);
      }
    }
  }

  /**
   *
   * @param {Node} firstNode
   */
  searchNeighbors(firstNode) {
    console.log('searching', firstNode);
  }

  placeBombs() {
    // generate random x and y coords 10 times
    let i = 0;

    do {
      const { x: randX, y: randY } = this.genRandomCoords();
      const bombNode = { x: randX, y: randY };
      if (!this.#bombs.has(bombNode)) {
        i++;
        this.#bombs.add(bombNode);
        const nodeString = `${bombNode.x},${bombNode.y}`;
        const placeBombHere = this.#nodes.get(nodeString);
        placeBombHere.setBomb();
        placeBombHere.neighbors.forEach((node, key) => {
          const neighbor = this.#nodes.get(node.toString());
          // console.log(neighbor);
          neighbor.addNeighborWithBomb();
        });
      }
    } while (i < this.#totalBombs);
  }

  genRandomCoords() {
    let x = 0;
    let y = 0;

    x = Math.round(Math.random() * (this.#size - 1));
    y = Math.round(Math.random() * (this.#size - 1));

    return { x, y };
  }
}

const drawBoard = (board, search, setBoardElements, gameOver, setGameOver) => {
  const numOfRows = board.getSize();
  console.log(numOfRows);
  const rows = [];

  const genNodeElement = (node, key) => (
    <BoardNode
      board={board}
      gameOver={gameOver}
      setGameOver={setGameOver}
      setBoardElements={setBoardElements}
      key={key}
      node={node}
      search={search}
    />
  );

  for (let i = 0; i < numOfRows; i++) {
    const boardElements = [];
    for (let j = 0; j < numOfRows; j++) {
      const nodeAccess = `${i},${j}`;
      boardElements.push(genNodeElement(board.getNodes().get(nodeAccess), nodeAccess));
    }
    console.log('drawing returning');
    rows[i] = boardElements;
  }
  return rows;
};

function BoardNode({ node, search, board, setBoardElements, gameOver, setGameOver }) {
  const x = useRef(node.getX());
  const y = useRef(node.getY());
  const hasBomb = useRef(node.isBomb());
  const buttonElement = useRef(null);

  /**
   *
   * @param {Event} e
   */
  const handleClick = (e) => {
    // check if bomb
    const numOfBombsNear = node.getNeighborsWithBombs();
    if (node.isBomb()) {
      buttonElement.current.textContent = '🚩';
      alert('you lose');
      setGameOver(true);
    } else {
      search(node);
      // Show current count
      if (numOfBombsNear > 0) {
        buttonElement.current.textContent = numOfBombsNear;
        // check neighbors and recurse
      } else {
        buttonElement.current.textContent = '-';
      }
    }
    buttonElement.current.classList.add('disabled');
    // eslint-disable-next-line no-param-reassign
    node.isShowing = true;
    setBoardElements(drawBoard(board, search, setBoardElements, gameOver, setGameOver));
  };

  return (
    <div className="col">
      <div className="card text-center">
        <div className="card-body">
          <button ref={buttonElement} className={`btn btn-light ${(node.isShowing || gameOver) && 'disabled'}`} type="button" onClick={handleClick}>
            {/* eslint-disable-next-line no-nested-ternary */}
            {node.isShowing ? (gameOver && node.isBomb()) ? '🚩' : node.getNeighborsWithBombs() > 0 ? node.getNeighborsWithBombs() : '-' : '?'}
          </button>
        </div>
      </div>
    </div>
  );
}

BoardNode.propTypes = {
  node: PropTypes.instanceOf(Node).isRequired,
  search: PropTypes.func.isRequired,
};

function GameBoard() {
  const gameBoardSize = useRef(10);
  const allTheBombs = useRef(10);
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState(new Board(gameBoardSize.current, allTheBombs.current));
  const boardSizeElement = useRef(null);
  const bombsElement = useRef(null);

  const [boardElements, setBoardElements] = useState([]);

  const searchForNeighbors = (firstNode, gameBoard = board) => {
    const neighbors = [];
    firstNode.neighbors.forEach(val => {
      neighbors.push(board.getNodes().get(val.toString()));
    });
    neighbors.forEach((val, index) => {
      if (val.isBomb() || val.getSearched()) {
        return;
      }
      if (val.getNeighborsWithBombs() > 0) {
        // eslint-disable-next-line no-param-reassign
        val.isShowing = true;
        return;
      }
      val.setSearched(true);
      // eslint-disable-next-line no-param-reassign
      val.isShowing = true;
      searchForNeighbors(val);
    });
  };

  useEffect(() => {
    boardSizeElement.current.value = gameBoardSize.current;
    bombsElement.current.value = allTheBombs.current;
    setBoardElements(drawBoard(board, searchForNeighbors, setBoardElements, gameOver, setGameOver));
  }, [gameOver, board]);

  const handleReload = () => {
    if (parseInt(bombsElement.current.value, 10) && parseInt(boardSizeElement.current.value, 10)) {
      gameBoardSize.current = boardSizeElement.current.value;
      allTheBombs.current = bombsElement.current.value;
      setGameOver(false);
      setBoard(new Board(boardSizeElement.current.value, bombsElement.current.value));
    }
  };

  const drawBoardElements = () => {
    const numOfRows = boardSizeElement.current.value;
    const rows = [];
    for (let i = 0; i < numOfRows; i++) {
      rows.push();
    }
  };

  console.log(board);
  return (
    <>
      <h1>The Board</h1>
      <div className="row">
        <div className="col">
          <p>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="boardSize" className="form-label">Board Size </label>
            <input type="text" id="boardSize" name="boardSize" className="form-control" ref={boardSizeElement} />
          </p>
          <p>
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label htmlFor="boardSize" className="form-label">Number of Bombs</label>
            <input type="text" id="numOfBombs" name="numOfBombs" className="form-control" ref={bombsElement} />
          </p>
        </div>
        <div className="col">
          <button type="button" onClick={handleReload} className="btn btn-info">New Game</button>
        </div>
      </div>
      <div className="row">
        {boardElements.map(row => (<div className="row mb-2">{row.map(ele => ele)}</div>))}
      </div>
    </>
  );
}

export default GameBoard;
