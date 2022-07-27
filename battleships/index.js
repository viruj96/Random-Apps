let canvasFg, ctxFg, canvasBg, ctxBg, textCanvas, textCtx;

let mouseX, mouseY;

// canvas width & height bg and fg only
const GRID_SIZE = 16;
let WIDTH, HEIGHT, BG_WIDTH, BG_HEIGHT;
let TILE_WIDTH, TILE_HEIGHT;

const SHIPS = [
	{
		id: 1,
		name: 'Destroyer',
		length: 2
	},
	{
		id: 2,
		name: 'Light Cruiser',
		length: 3
	},
	{
		id: 3,
		name: 'Heavy Cruiser',
		length: 3
	},
	{
		id: 4,
		name: 'Submarine',
		length: 4
	},
	{
		id: 5,
		name: 'Carrier',
		length: 4
	},
	{
		id: 6,
		name: 'Battleship',
		length: 5
	}
];
const N_SHIPS = SHIPS.length;
let computerScore = 0, playerScore = 0;
let computerShips = [...SHIPS], playerShips = [];
let isPlayerTurn = true;
let availableShips = [...SHIPS]; // used to list ships at start of game
let selectedShip;
let boundary = []; // click box for selecting ships

const HIT_POINTS = 10;
const DESTROYED_POINTS = 2 * HIT_POINTS;
let isGameOver = false;
const shotLogs = []; // user shot records. only 10 most recent kept

let BOARD = [
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];

window.onload = () => {
	// Get canvas elements and set height and width variables 
	canvasFg = document.getElementById('fg');
	ctxFg = canvasFg.getContext('2d');
	canvasBg = document.getElementById('bg');
	ctxBg = canvasBg.getContext('2d');
	textCanvas = document.getElementById('text');
	textCtx = textCanvas.getContext('2d');

	WIDTH = canvasFg.width;
	HEIGHT = canvasFg.height;
	TILE_WIDTH = WIDTH / GRID_SIZE;
	TILE_HEIGHT = HEIGHT / GRID_SIZE;
	BG_WIDTH = canvasBg.width;
	BG_HEIGHT = canvasBg.height;

	canvasFg.addEventListener('mousemove', updateMousePos);
	initComputerPosition();
}

function startGame() {
	document.getElementById('startBlock').style.display = 'none';
	document.getElementById('game').style.display = 'block';

	const FPS = 25;
	setInterval(() => {
		render();

		if (playerShips.length !== N_SHIPS) {
			canvasFg.addEventListener('click', placePlayerShips);
			textCanvas.addEventListener('click', pickShip);
		}
		else {
			canvasFg.removeEventListener('click', placePlayerShips);
			textCanvas.removeEventListener('click', pickShip);
			canvasFg.addEventListener('click', takeShot);
		}
	}, 1000 / FPS); // call game in interval to redraw and reconfigure event listeners
}

function render() {
	ctxFg.clearRect(0, 0, WIDTH, HEIGHT);
	drawCellNumbers();
	drawScoreBoard();
	drawGameBoard();
	drawMousePos()
}

function drawScoreBoard() {
	textCtx.fillStyle = 'black';
	textCtx.fillRect(0, 0, textCanvas.width, textCanvas.height);
	textCtx.fillStyle = 'white';
	textCtx.fillRect(0, textCanvas.height / 2, textCanvas.width, 2);
	textCtx.font = textCtx.font.replace(/\d+px/, "16px");
	textCtx.fillText(`Computer Score: ${computerScore}`, 20, 30);
	textCtx.fillText(`Ships remaining: ${computerShips.length}`, 20, 60);
	textCtx.fillText(`Player Score: ${playerScore}`, 20, 30 + textCanvas.height / 2);
	textCtx.fillText(`Ships remaining: ${playerShips.length}`, 20, 60 + textCanvas.height / 2);
	drawShotLogs();
	listAvailableShips();
}

function drawCellNumbers() {
	ctxBg.fillStyle = 'grey';
	ctxBg.fillRect(0, 0, canvasBg.width, canvasBg.height);

	ctxBg.fillStyle = 'black';
	ctxBg.font = ctxBg.font.replace(/\d+px/, "12px");
	ctxBg.textBaseline = 'middle';
	ctxBg.textAlign = 'center';
	for (let k = 0; k < GRID_SIZE; k++) {
		let x = (k * TILE_WIDTH) + (TILE_WIDTH) / 2 + (BG_WIDTH - WIDTH) / 2;
		let y = (k * TILE_HEIGHT) + (TILE_HEIGHT) / 2 + (BG_HEIGHT - HEIGHT) / 2;
		ctxBg.fillText(k + 1, x, 30);
		ctxBg.fillText(k + 1, x, BG_HEIGHT - 30);
		ctxBg.fillText(String.fromCharCode(k + 65), 30, y);
		ctxBg.fillText(String.fromCharCode(k + 65), BG_WIDTH - 30, y);
	}
}

function drawGameBoard() {
	let index = 0;
	let tileY = 0;
	for (let i = 0; i < GRID_SIZE; i++) {
		let tileX = 0;
		for (let j = 0; j < GRID_SIZE; j++) {
			let colour = 'aqua';
			if (BOARD[index] === -2)
				colour = 'darkred';
			else if (BOARD[index] === -1)
				colour = 'green';
			else if (BOARD[index] > 0)
				colour = 'hotpink';
			ctxFg.fillStyle = colour;
			ctxFg.fillRect(tileX, tileY, TILE_WIDTH - 2, TILE_HEIGHT - 2);
			if (tileY === 8 * TILE_HEIGHT) {
				ctxFg.fillStyle = 'red';
				ctxFg.fillRect(tileX - 2, tileY - 2, TILE_WIDTH, 2);
			}
			tileX += TILE_WIDTH;
			index++;
		}
		tileY += TILE_HEIGHT;
	}
}

function drawMousePos() {
	let row = Math.floor(mouseY / TILE_HEIGHT) + 1;
	let col = Math.floor(mouseX / TILE_WIDTH) + 1;

	ctxFg.fillStyle = 'black';
	ctxFg.font = ctxFg.font.replace(/\d+px/, "14px");
	ctxFg.fillText(`(${String.fromCharCode(row + 64)}, ${col})`, mouseX - 20, mouseY - 5);
}

function updateMousePos(e) {
	const rect = canvasFg.getBoundingClientRect();
	const root = document.documentElement;

	mouseX = e.clientX - rect.left - root.scrollLeft;
	mouseY = e.clientY - rect.top - root.scrollTop;
}

function pickShip(e) {
	const pos = {
		x: e.clientX,
		y: e.clientY
	};

	let idx = clickIntersect(pos);
	selectedShip = availableShips[idx];
}

// Check if mouse click is within valid boundary box on text canvas
function clickIntersect(point) {
	for (let i = 0; i < boundary.length; i++) {
		if (point.x >= boundary[i].x && point.y >= boundary[i].y1 && point.y < boundary[i].y2)
			return i;
	}
	return -1;
}

function listAvailableShips() {
	if (playerShips.length !== N_SHIPS) {
		const diff = (textCanvas.width - canvasBg.width) / 2 - 20;
		let prevY = 30 + textCanvas.height / 2;
		textCtx.fillText('🚢 !!!Deploy your fleet!!! 🚢', textCanvas.width - diff, prevY)
		prevY += 15;
		for (let i = 0; i < availableShips.length; i++) {
			let nextY = 30 * (i + 2) + textCanvas.height / 2;
			let ship = availableShips[i];
			textCtx.fillText(`${ship.id}. ${ship.name} (${ship.length} units)`, textCanvas.width - diff, nextY);
			boundary[i] = {
				x: textCanvas.width - diff,
				y1: prevY,
				y2: nextY + 15
			};
			prevY = nextY;
		}
	} else {
		const diff = (textCanvas.width - canvasBg.width) / 2 - 20;
		let prevY = 30 + textCanvas.height / 2;
		textCtx.fillText('⚓ !!!FIRE!!! ⚓', textCanvas.width - diff / 1.3, prevY);
		for (let i = 0; i < 10; i++) {
			let nextY = 30 * (i + 2) + textCanvas.height / 2;
			if (i % 2 === 0)
				textCtx.fillText('🔥💣🔥💣🔥💣🔥💣🔥💣🔥💣', textCanvas.width - diff, nextY);
			else
				textCtx.fillText('💣🔥💣🔥💣🔥💣🔥💣🔥💣🔥', textCanvas.width - diff, nextY);
		}
	}
}

function placePlayerShips() {
	let row = Math.floor(mouseY / TILE_HEIGHT);
	let col = Math.floor(mouseX / TILE_WIDTH);

	let index = GRID_SIZE * row + col;

	if (row >= 8 && BOARD[index] === 0 && selectedShip) {
		for (let i = 0; i < selectedShip.length; i++) {
			BOARD[index + i] = selectedShip.id;
		}
		availableShips = availableShips.filter(ship => ship.id !== selectedShip.id);
		playerShips.push(selectedShip);
	}
}

function initComputerPosition() {
	let shipsToPlace = SHIPS;
	const SHIP_ORIENTATION = ['h', 'v']; // Place ship horizontally or vertically

	while (shipsToPlace.length > 0) {
		let ship = shipsToPlace[Math.floor(Math.random() * shipsToPlace.length)];
		ship.orientation = SHIP_ORIENTATION[Math.floor(Math.random() * SHIP_ORIENTATION.length)];
		let row = Math.floor((Math.random() * GRID_SIZE / 2));
		let col = Math.floor((Math.random() * GRID_SIZE));
		ship.coordinates = [row, col];
		if (!canPlaceShip(ship)) continue;
		shipsToPlace = shipsToPlace.filter(s => s.name !== ship.name);
	}
}

function canPlaceShip(ship) {
	let [row, col] = ship.coordinates;

	let index = GRID_SIZE * row + col;
	let prevState = [...BOARD];

	if (ship.orientation === 'h') {
		if (ship.length + col <= GRID_SIZE) { // Draw left to right
			for (let i = 0; i < ship.length; i++) {
				if (BOARD[index + i] !== 0) {
					BOARD = prevState;
					return false;
				}
				BOARD[index + i] = ship.id;
			}
			return true;
		}
		else if (col - ship.length >= 0) { // Draw right to left
			for (let i = 0; i < ship.length; i++) {
				if (BOARD[index - i] !== 0) {
					BOARD = prevState;
					return false;
				}
				BOARD[index - i] = ship.id;
			}
			return true;
		}
	} else if (ship.orientation === 'v') {
		if (ship.length + row <= GRID_SIZE / 2) { // Draw top to bottom
			for (let i = 0; i < ship.length; i++) {
				if (BOARD[index + i * GRID_SIZE] !== 0) {
					BOARD = prevState;
					return false;
				}
				BOARD[index + i * GRID_SIZE] = ship.id;
			}
			return true;
		}
		else if (row - ship.length >= 0) { // Draw bottom to top
			for (let i = 0; i < ship.length; i++) {
				if (BOARD[index - i * GRID_SIZE] !== 0) {
					BOARD = prevState;
					return false;
				}
				BOARD[index - i * GRID_SIZE] = ship.id;
			}
			return true;
		}
	}
	return false;
}

function drawShotLogs() {
	const diff = (textCanvas.width - canvasBg.width) / 2 - 20;
	if (shotLogs.length > 10)
		shotLogs.shift();
	for (let i = 0; i < shotLogs.length; i++) {
		textCtx.fillText(shotLogs[i], textCanvas.width - diff, 30 * (i + 1));
	}
}

function takeShot() {
	if (!isGameOver) {
		let row = Math.floor(mouseY / TILE_HEIGHT);
		let col = Math.floor(mouseX / TILE_WIDTH);

		if (isPlayerTurn) {
			let index = GRID_SIZE * row + col;

			if (row < 8 && BOARD[index] !== -1 && BOARD[index] !== -2) {
				let hitIndex = computerShips.findIndex(ship => ship.id === BOARD[index]);

				if (hitIndex !== -1) {
					computerShips[hitIndex].length--;
					updateScore(hitIndex);
					BOARD[index] = -1;
					shotLogs.push(`Shot (${String.fromCharCode(row + 65)}, ${col + 1}) : HIT`);
				} else {
					BOARD[index] = -2;
					shotLogs.push(`Shot (${String.fromCharCode(row + 65)}, ${col + 1}) : MISSED`);
				}
				isPlayerTurn = false;
				setTimeout(() => canvasFg.click(), 100);
			}
		} else {
			row = Math.floor((Math.random() * GRID_SIZE / 2)) + GRID_SIZE / 2;
			col = Math.floor((Math.random() * GRID_SIZE));

			let index = GRID_SIZE * row + col;

			if (BOARD[index] !== -1 && BOARD[index] !== -2) {
				let hitIndex = playerShips.findIndex(ship => ship.id === BOARD[index]);

				if (hitIndex !== -1) {
					playerShips[hitIndex].length--;
					updateScore(hitIndex);
					BOARD[index] = -1;
				} else {
					BOARD[index] = -2;
				}

				isPlayerTurn = true;
			}
		}
	}
}

function updateScore(hitIndex) {
	if (isPlayerTurn) {
		if (computerShips[hitIndex].length === 0) {
			playerScore += DESTROYED_POINTS;
			computerShips = computerShips.filter(ship => ship !== computerShips[hitIndex]);
		}
		else {
			playerScore += HIT_POINTS;
		}
	} else {
		if (playerShips[hitIndex].length === 0) {
			computerScore += DESTROYED_POINTS;
			playerShips = playerShips.filter(ship => ship !== playerShips[hitIndex]);
		}
		else {
			computerScore += HIT_POINTS;
		}
	}

	if (playerShips.length === 0 || computerShips.length === 0) {
		isGameOver = true;
		gameOver(computerShips.length === 0);
	}
}

function gameOver(playerWins) {
	if (playerWins) {
		console.log('Player wins')
	} else {
		console.log('Computer wins')
	}
}