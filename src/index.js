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
  renderSquare(i) {
    /* each square will now receive a value prop that will either be 'X', 'O', or null (for empty squares) */
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
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
  /* why is history in the Game component? So the Game has full control over the Board component and can thus instruct the board to render previous turns from the history */

  /* initial board state is an array with 9 null values, corresponding to the 9 squares */
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      xIsNext: true
    };
  }

  handleClick(i) {
    /* why create a copy? helps us avoid complexity when creating our history and 'jump back' feature. Much easier to keep track of changes in an immutable object; if object being referenced is different than previous one, object has changed. */
    const history = this.state.history;
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    /* concat instead of push because concat doesn't mutate the original array, which is preferred */
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([{ squares }]),
      xIsNext: !this.state.xIsNext
    });
  }

  render() {
    /* use the most recent history entry to determine and display game status */
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    /* displaying the history of moves with map*/
    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
    /* https://reactjs.org/tutorial/tutorial.html#picking-a-key - good example of why we need keys with list rendering in React - long story short, it's so React has a efficient means of determining what, if any, child elements have changed in between renders. When no key is specified, the array index is used as default */
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<Game />, document.getElementById("root"));
