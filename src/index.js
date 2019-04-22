import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  /* state should be considered as private to a React component */
  /* constructor(props) {
    /* in JS, everything that has a constructor should first make a call to the parent class via super. React components should make super call with super(props)
    super(props);

    this.state = {
      value: null
    };
  }*/

  /* re-render the square that corresponds with the updated value in this.state, 'X' or 'O', when the button is clicked */
  /* React practice is to use on[Event] for props that represent events and handle[Event] for methods that handle the events*/
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

/* to collect data from multiple children or to have two child components comunicate with one another, the SHARED STATE MUST BE DECLARED IN THE PARENT COMPONENT. */
class Board extends React.Component {
  /* initial board state is an array with 9 null values, corresponding to the 9 squares */
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true
    };
  }

  handleClick(i) {
    /* why create a copy? helps us avoid complexity when creating our history and 'jump back' feature. Much easier to keep track of changes in an immutable object; if object being referenced is different than previous one, object has changed. */
    const squares = this.state.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({ squares, xIsNext: !this.state.xIsNext });
  }

  renderSquare(i) {
    /* each square will now receive a value prop that will either be 'X', 'O', or null (for empty squares) */
    return (
      <Square
        value={this.state.squares[i]}
        onClick={() => this.handleClick(i)}
      />
    );
  }

  render() {
    const winner = calculateWinner(this.state.squares);

    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
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

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
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
          <div>{/* TODO */}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
