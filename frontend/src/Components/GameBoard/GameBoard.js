import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './GameBoard.scss';

/* eslint quote-props: 0 */
class Node {
  #x;
  #y;
  neighbors = new Set();
  #hasBomb;

  constructor(x, y, hasBomb = false) {
    this.#x = x;
    this.#y = y;
    this.#hasBomb = hasBomb;
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

  setBomb() {
    this.#hasBomb = true;
  }

  isBomb() {
    return this.#hasBomb;
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
      const lastRow = i === 9;
      for (let j = 0; j < this.#size; j++) {
        const firstCol = j === 0;
        const lastCol = j === 9;
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
      }
    } while (i < this.#totalBombs);
  }

  genRandomCoords() {
    let x = 0;
    let y = 0;

    x = Math.round(Math.random() * 9);
    y = Math.round(Math.random() * 9);

    return { x, y };
  }
}

function BoardNode({ node }) {
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
    if (node.isBomb()) {
      alert('you lose');
      window.location.reload();
    } else {
      buttonElement.current.textContent = '!';
      buttonElement.current.classList.add('disabled');
    }
    // check neighbors and recurse
  };

  return (
    <div className="col">
      <div className="card text-center">
        <div className="card-body">
          <button ref={buttonElement} className="btn btn-light" type="button" onClick={handleClick}>?</button>
        </div>
      </div>
    </div>
  );
}

BoardNode.propTypes = {
  node: PropTypes.instanceOf(Node).isRequired,
};

function GameBoard() {
  const genNodeElements = (node, key) => {
    const element = <BoardNode key={key} node={node} />;
    boardElements.push(element);
  };

  const gameBoardSize = 10;
  const allTheBombs = 10;
  const [board, setBoard] = useState(new Board(gameBoardSize, allTheBombs));
  const boardElements = [];
  // eslint-disable-next-line react/jsx-one-expression-per-line
  board.getNodes().forEach(genNodeElements);
  console.log(board);
  return (
    <>
      <h1>The Board</h1>
      <div className="row">
        <p>
          Board Size:&nbsp;
          {gameBoardSize * gameBoardSize}
        </p>
        <p>
          Number of Bombs:&nbsp;
          {allTheBombs}
        </p>
      </div>
      <div className="row row-cols-10 g-2">
        {boardElements.map(ele => ele)}
      </div>
    </>
  );
}

export default GameBoard;
