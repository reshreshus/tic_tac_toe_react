   /*
   The task from React tutorial
   https://reactjs.org/tutorial/tutorial.html
   + additional features suggested in the tutorial:
1. Display the location for each move in the format (col, row) in the move history list. Done
2. Bold the currently selected item in the move list. Done
3. Rewrite Board to use two loops to make the squares instead of hardcoding them. Done
4. Add a toggle button that lets you sort the moves in either ascending or descending order. Done
5. When someone wins, highlight the three squares that caused the win. Done
6. When no one wins, display a message about the result being a draw. Done
    */
    function Square(props) {
        return (
            <button className={`${props.squareType}`}onClick={props.onClick}>
                {props.value}
            </button>
    );
    }


    class Board extends React.Component {
        renderSquare(i, isHighlighted) {
            const squareType = isHighlighted ? 'winner' : 'square'
            return (
                <Square
                    squareType={squareType}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            key={i}
            />
        );
        }

        render() {
            let rows = [];
            let squareNumber = 0;
            const winning_positions = this.props.winning_positions;
            for (let i = 0; i < 3; i++){
                const row = [];
                for (let j = 0; j < 3; j++){
                    if (winning_positions && winning_positions.includes(squareNumber)){
                        row.push(this.renderSquare(squareNumber, true))
                    } else {
                        row.push(this.renderSquare(squareNumber, false));
                    }
                    squareNumber++;
                }
                rows.push(<div key={i} className="board-row">{row}</div>);
            }

            return rows;
        }
    }

    class Game extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                history: [{
                    squares: Array(9).fill(null),
                    lastMove: undefined,
                    xIsNext: undefined
                }],
                xIsNext: true,
                stepNumber: 0,
                ascendingOrder: true
            };
        }

        jumpTo(step) {
            this.setState({
                stepNumber: step,
                xIsNext: (step % 2) === 0
            })
        }

        checkDraw() {
            const current = this.state.history[this.state.stepNumber];
            // const current = history[history.length - 1];
            for (let i = 0; i < current.length; i++){
                if (current[i] == null){
                    return false;
                }
            }
            return true;
        }

        handleClick(i) {
            const history = this.state.history.slice(0, this.state.stepNumber + 1);

            const current = history[history.length - 1];
            const squares = current.squares.slice();
            if (calculateWinner(squares) || squares[i]) {
                return;
            }
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            this.setState({
                history: history.concat([{
                    squares: squares,
                    lastMove: i,
                    xIsNext: this.state.xIsNext
                }]),
                xIsNext: !this.state.xIsNext,
                stepNumber: history.length
            });
        }

        toggle(){
            //TODO
            this.setState({
                ascendingOrder: !this.state.ascendingOrder
            })
        }

        render() {
            const history = this.state.history;
            const current = history[this.state.stepNumber];
            const winning_combination = calculateWinner(current.squares);
            const moves = history.map(
                (step, move) => {
                    const position = history[move].lastMove;
                    const player = history[move].xIsNext ? 'X' : 'O';
                    const x = position % 3;
                    const y = 2 - Math.floor(position / 3);
                    const desc = move ?
                        `Go to move #${move}, player: ${player}, move: ${x},${y}`:
                        'Go to game start';
                    if(move === this.state.stepNumber){
                        return (
                            <li key={move}>
                                <button onClick={()=>this.jumpTo(move)}> <strong>{desc}</strong> </button>
                            </li>
                        )
                    }
                    return (
                        <li key={move}>
                            <button onClick={()=>this.jumpTo(move)}> {desc} </button>
                        </li>
                );
                }
            );

            let status;
            if (winning_combination) {
                status = 'Winner: ' + winning_combination[0];
            } else if(this.checkDraw()){
                status = 'Draw'
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }

            if (!this.state.ascendingOrder){
                moves.reverse();
            }
            return (
                <div className="game">
                <div className="game-board">
                <Board
                    winning_positions={winning_combination ? winning_combination.slice(1,4) : null}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={()=>this.toggle()}>Toggle</button>
                <ol>{moves}</ol>
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
                // return multiple values in JS is done using an array
                return [squares[a], a, b, c];
            }
        }
        return null;
    }

