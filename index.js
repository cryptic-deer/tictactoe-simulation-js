const board = [];
// for tracking the played cells
const temp = [0, 1, 2, 3, 4, 5, 6, 7, 8];
// random number generator
const random = max => Math.floor(Math.random() * (max + 1));

// player token/symbol selection
const playerOne = 0;
const playerTwo = 1;

// creating the 3x3 starting board, filling up with numbers from 0 to 8
const createBoard = () => {
	let num = 0;
	for (let i = 0; i < 3; i++) {
		let row = [];
		for (let j = 0; j < 3; j++) {
			row.push(num);
			num++;
		}
		board.push(row);
	}
};
createBoard();

// when iterating over rows, use .findIndex so that if the callback returns a truthy value,...
// ...you can use the index outside. When iterating over columns,...
// ...use indexOf to check to see if the value you're looking for exists in the array -...
// ...if it does, assign it to an outside variable, and return true to the findIndex
const selectIndex = (board, number, player) => {
	let colIndex = -1;
	const rowIndex = board.findIndex(row => {
		const foundColIndex = row.indexOf(number);
		if (foundColIndex !== -1) {
			colIndex = foundColIndex;
			temp.splice(temp.indexOf(number), 1);
			return true;
		}
	});

	// if there is only one cell remaining, only the first player have a turn left
	if (temp.length === 1) {
		selectIndex(board, temp[random(temp.length - 1)], playerOne);
	}

	// put the players token to the selected cell
	board[rowIndex][colIndex] = player;
};

// take turn until there are no more empty cells
do {
	selectIndex(board, temp[random(temp.length - 1)], playerOne);
	selectIndex(board, temp[random(temp.length - 1)], playerTwo);
} while (temp.length > 0);

// log the board
console.table(board);

//Navigate the board horizontally
const isHorizontalWinner = (symbol, board) =>
	board.some(moves => moves.every(move => move === symbol));

// transpose the board and navigate through columns as if they were rows
const transposeBoard = board =>
	board.map((_, index) => board.map(row => row[index]));

//  let’s use the transposeBoard function to check the winner across board columns
const isVerticalWinner = (symbol, board) =>
	transposeBoard(board).some(moves => moves.every(move => move === symbol));

// Get diagonal moves from the board  This will be used to check if a particular user has won //diagonally
const getDiagonalMoves = board => {
	const diagonalMoves = [];
	const equalBasedDiagonal = []; // i === j
	const sumBasedDiagonal = []; // i + j == n -1

	// Check for left to right diagonal moves
	for (let row = 0; row < board.length; row++) {
		for (col = 0; col < board.length; col++) {
			if (row === col) {
				equalBasedDiagonal.push(board[row][col]);
			}
		}
	}

	// Check for right to left diagonal moves
	for (let row = 0; row < board.length; row++) {
		for (col = 0; col < board.length; col++) {
			if (row + col === board.length - 1) {
				sumBasedDiagonal.push(board[row][col]);
			}
		}
	}

	diagonalMoves.push(equalBasedDiagonal, sumBasedDiagonal);
	return diagonalMoves;
};
// Use the diagonal moves to check if the user is a winner
const isDiagonalWinner = (symbol, board) =>
	getDiagonalMoves(board).some(moves => moves.every(move => move === symbol));

// create one simple function to combine all of the winning options
const isWinner = (symbol, board) =>
	isHorizontalWinner(symbol, board) ||
	isVerticalWinner(symbol, board) ||
	isDiagonalWinner(symbol, board);

// log the result
console.log(
	isWinner(playerOne, board)
		? `The winner is player One: ${playerOne}`
		: isWinner(playerTwo, board)
		? `The winner is player Two: ${playerTwo}`
		: `It's a tie`
);
