import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: null,
    };
  }
    render() {
      return (
        <button className="square" 
        onClick={()=> {this.props.onClick()}}
        >
          {this.props.value}
        </button>
      );
    }
  }
  
  class Board extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        squares: Array(9).fill(null),
        xIsNext: true,
      };
    }
    handleClick(i) {
      const squares = this.state.squares.slice();
      let won = calculateWinner(squares);
      if (won) return;
      if(squares[i] === "O" || squares[i] === "X") return;
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({squares: squares, xIsNext: false});
      AutoPlay(squares);
      this.setState({xIsNext: true});
    }
    renderSquare(i) {
      return <Square value={this.state.squares[i]} onClick={()=> {this.handleClick(i)}}/>;
    }
  
    render() {
      const winner = calculateWinner(this.state.squares);
      const draw = checkDraw(this.state.squares);
      let status;
      if (winner) {
        status = 'Winner: ' + winner + " Refresh the page to play again.";
      } else if (draw) {
        status = "It's a draw. Refresh the page to play again."
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
        

  
      return (
        <div>
          <div className="status">{status}</div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    render() {
      return (
        <div className="game">
          <div className="game-board">
            <Board />
          </div>
          <div className="game-info">
            <div>{/* status */}</div>
            <ol>{/* TODO */}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );

function AutoPlay(squares) {
  let won = calculateWinner(squares);
  let draw = checkDraw(squares);
  if (won) {
    return;
  } else if (draw) {
    return;
  }
  
  let bestScore = -Infinity;
  let bestMove;
  for (let i=0; i<squares.length; i++) {
    if(squares[i] === null) {
      squares[i] = "O";
      let score = minimax(squares, 0, false);
      squares[i] = null;
      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }
  }
  squares[bestMove] = "O";

  //let emptySquares = [];
  //for(let i=0; i<squares.length; i++) {
  //  if (squares[i] === null) {
  //    emptySquares.push(i);
  //  }
  //}
  //const randomSquare = Math.floor(Math.random()*emptySquares.length);
  //squares[emptySquares[randomSquare]] = "O";
  
}



function minimax (squares, depth, isMaximizing) {
  let scores = {
    X: -1,
    O: 1,
    draw: 0
  };
  let winner = calculateWinner(squares);
  let result = null;
  if (checkDraw(squares)) {
    result = "draw";
  }
  if (winner) {
    result = winner;
  }
  if(result !== null) {
    return scores[result];
  }
  if(isMaximizing) {
    let bestScore = -Infinity;
    for (let i=0; i<squares.length; i++) {
      if(squares[i] == null) {
        squares[i] = "O";
        let score = minimax(squares, depth+1, false);
        squares[i] = null;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i=0; i<squares.length; i++) {
      if(squares[i] == null) {
        squares[i] = "X";
        let score = minimax(squares, depth+1, true);
        squares[i] = null;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkDraw (squares) {
  let filled = 0;
  for (let i=0; i<squares.length; i++) {
    if(squares[i] !== null) {
      filled++;
    }
  }
  if (filled === 9)  {
    return true;
  } else {
    return false;
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}