/* ===================================================
   CHESS.IN CLONE — GAME.JS
   Full chess game logic, timers, computer opponent
   =================================================== */

// ========================
// BOT DATA
// ========================
const BOTS = [
    { name: 'Timmy', emoji: '🧒', rating: '~400', level: 1 },
    { name: 'Martin', emoji: '😊', rating: '~600', level: 2 },
    { name: 'Nelson', emoji: '🐴', rating: '~800', level: 3 },
    { name: 'Boris', emoji: '🎩', rating: '~1000', level: 4 },
    { name: 'Ahmad', emoji: '🤓', rating: '~1200', level: 5 },
    { name: 'Felipe', emoji: '⚡', rating: '~1400', level: 6 },
    { name: 'Sophia', emoji: '🎓', rating: '~1600', level: 7 },
    { name: 'Komodo', emoji: '🦎', rating: '~1800', level: 8 },
    { name: 'Leela AI', emoji: '🤖', rating: '~2200', level: 9 },
    { name: 'Stockfish', emoji: '🐟', rating: '~2800', level: 10 },
];

const ONLINE_PLAYERS = [
    'KnightRider99', 'QueenSlayer42', 'PawnBroker', 'ChessKing2026',
    'TacticalGenius', 'EndgameMaster', 'OpeningTheory', 'BlitzWizard',
    'SicilianDragon', 'RuyLopezFan', 'FrenchDefense', 'KingsGambit'
];

// ========================
// PIECE VALUES FOR EVALUATION
// ========================
const PIECE_VALUES = { P: 1, N: 3, B: 3, R: 5, Q: 9, K: 0 };

// ========================
// GAME STATE
// ========================
class GameEngine {
    constructor() {
        this.board = null;
        this.gameActive = false;
        this.playerColor = 'w';
        this.computerMode = false;
        this.computerLevel = 3;
        this.selectedTime = 180;
        this.selectedInc = 0;
        this.whiteTime = 180;
        this.blackTime = 180;
        this.timerInterval = null;
        this.activeTimer = null;
        this.moveHistory = [];
        this.capturedByWhite = [];
        this.capturedByBlack = [];
        this.gameOver = false;
        this.moveIndex = -1;
        this.searchingTimeout = null;

        this.initUI();
    }

    initUI() {
        // Mode buttons
        document.getElementById('modeOnline')?.addEventListener('click', () => this.setMode('online'));
        document.getElementById('modeComputer')?.addEventListener('click', () => this.setMode('computer'));
        document.getElementById('modeFriend')?.addEventListener('click', () => this.setMode('friend'));

        // Time buttons
        document.querySelectorAll('.time-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.selectedTime = parseInt(btn.dataset.time);
                this.selectedInc = parseInt(btn.dataset.inc) || 0;
            });
        });

        // Find game / play computer
        document.getElementById('findGameBtn')?.addEventListener('click', () => this.startSearch());
        document.getElementById('playComputerStart')?.addEventListener('click', () => this.startComputerGame());

        // Level slider
        const slider = document.getElementById('levelSlider');
        slider?.addEventListener('input', () => this.updateBotDisplay(parseInt(slider.value)));

        // Overlay action
        document.getElementById('overlayAction')?.addEventListener('click', () => this.startSearch());

        // Board controls
        document.getElementById('offerDrawBtn')?.addEventListener('click', () => this.offerDraw());
        document.getElementById('resignBtn')?.addEventListener('click', () => this.resign());
        document.getElementById('flipBoardBtn')?.addEventListener('click', () => this.flipBoard());
        document.getElementById('analysisBtn')?.addEventListener('click', () => {
            document.querySelector('.result-overlay')?.remove();
        });

        // Move nav
        document.getElementById('firstMove')?.addEventListener('click', () => this.goToMove(0));
        document.getElementById('prevMoveBtn')?.addEventListener('click', () => this.goToMove(this.moveIndex - 1));
        document.getElementById('nextMoveBtn')?.addEventListener('click', () => this.goToMove(this.moveIndex + 1));
        document.getElementById('lastMove')?.addEventListener('click', () => this.goToMove(this.moveHistory.length - 1));

        // Keyboard arrow key move navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.goToMove(this.moveIndex - 1);
            if (e.key === 'ArrowRight') this.goToMove(this.moveIndex + 1);
        });

        // Promotion modal piece buttons
        document.querySelectorAll('.promotion-piece-btn').forEach(btn => {
            btn.addEventListener('click', () => this.completePromotion(btn.dataset.piece));
        });

        // Quick phrases
        document.querySelectorAll('.quick-phrase').forEach(btn => {
            btn.addEventListener('click', () => this.sendChatMessage(btn.dataset.msg, 'You'));
        });

        // URL param check
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('mode') === 'computer') {
            this.setMode('computer');
        }

        // Init board
        this.board = new ChessBoard('gameBoard', {
            showCoords: true,
            interactive: true,
        });

        // Override the board's click handler to integrate with game
        const originalClick = this.board.handleSquareClick.bind(this.board);
        this.board.handleSquareClick = (row, col) => {
            if (!this.gameActive) return;
            if (this.board.turn !== this.playerColor && this.computerMode) return;
            const prevTurn = this.board.turn;
            const prevPos = JSON.parse(JSON.stringify(this.board.position));
            originalClick(row, col);
            if (this.board.turn !== prevTurn) {
                // A move was made
                const lastMove = this.board.lastMove;
                if (lastMove) {
                    this.onMoveMade(prevPos, this.board.position, lastMove, prevTurn);
                }
            }
        };

        this.updateBotDisplay(3);
        this.updateActiveCount();
        setInterval(() => this.updateActiveCount(), 4000);
    }

    setMode(mode) {
        document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
        document.getElementById(`mode${mode.charAt(0).toUpperCase() + mode.slice(1)}`)?.classList.add('active');

        const timeSection = document.getElementById('timeControlSection');
        const computerSection = document.getElementById('computerSection');

        if (mode === 'computer') {
            this.computerMode = true;
            timeSection?.classList.add('hidden');
            computerSection?.classList.remove('hidden');
        } else {
            this.computerMode = false;
            timeSection?.classList.remove('hidden');
            computerSection?.classList.add('hidden');
        }
    }

    updateBotDisplay(level) {
        this.computerLevel = level;
        const bot = BOTS[level - 1] || BOTS[2];
        document.getElementById('botAvatar').textContent = bot.emoji;
        document.getElementById('botName').textContent = bot.name;
        document.getElementById('botRating').textContent = `Rating: ${bot.rating}`;

        // Update slider gradient
        const slider = document.getElementById('levelSlider');
        if (slider) {
            const pct = ((level - 1) / 9) * 100;
            slider.style.setProperty('--progress', `${pct}%`);
            slider.style.background = `linear-gradient(to right, #81b64c ${pct}%, #2a2a2a ${pct}%)`;
        }
    }

    startSearch() {
        if (this.gameActive) return;
        this.showSearchingState();
        const delay = 1500 + Math.random() * 2500;
        this.searchingTimeout = setTimeout(() => {
            this.startOnlineGame();
        }, delay);
    }

    showSearchingState() {
        const overlay = document.getElementById('boardOverlay');
        const content = document.getElementById('overlayContent');
        if (!overlay || !content) return;
        overlay.classList.remove('hidden');
        content.innerHTML = `
      <div class="search-spinner"></div>
      <div class="search-text">Searching for a match...</div>
      <div class="search-sub">Looking for a player with similar rating (±100)</div>
      <button class="cancel-search-btn" id="cancelSearchBtn">Cancel</button>
    `;
        document.getElementById('cancelSearchBtn')?.addEventListener('click', () => {
            clearTimeout(this.searchingTimeout);
            this.showIdleState();
        });
    }

    showIdleState() {
        const overlay = document.getElementById('boardOverlay');
        const content = document.getElementById('overlayContent');
        if (!overlay || !content) return;
        overlay.classList.remove('hidden');
        content.innerHTML = `
      <div class="overlay-icon">♟</div>
      <h2>Find a Game</h2>
      <p>Choose your time control and click "Find Game" to start playing!</p>
      <button class="btn btn-primary btn-lg" id="overlayAction">Play Now</button>
    `;
        document.getElementById('overlayAction')?.addEventListener('click', () => this.startSearch());
    }

    startOnlineGame() {
        const opponentName = ONLINE_PLAYERS[Math.floor(Math.random() * ONLINE_PLAYERS.length)];
        const opponentRating = 1100 + Math.floor(Math.random() * 300);
        this.playerColor = Math.random() > 0.5 ? 'w' : 'b';
        const opponentColor = this.playerColor === 'w' ? 'b' : 'w';

        document.getElementById('whitePlayerName').textContent = this.playerColor === 'w' ? 'You' : opponentName;
        document.getElementById('whiteRating').textContent = this.playerColor === 'w' ? '1200' : opponentRating;
        document.getElementById('blackPlayerName').textContent = this.playerColor === 'b' ? 'You' : opponentName;
        document.getElementById('blackRating').textContent = this.playerColor === 'b' ? '1200' : opponentRating;

        this.startGame(this.playerColor);
        this.sendChatMessage(`${opponentName} has joined the game.`, 'System');
        this.sendChatMessage('Good luck!', opponentName);
    }

    startComputerGame() {
        const bot = BOTS[this.computerLevel - 1];
        this.computerMode = true;
        this.playerColor = 'w';
        this.selectedTime = 600;
        this.selectedInc = 0;

        document.getElementById('whitePlayerName').textContent = 'You';
        document.getElementById('whiteRating').textContent = '1200';
        document.getElementById('blackPlayerName').textContent = bot.name;
        document.getElementById('blackRating').textContent = bot.rating;

        this.startGame('w');
        this.sendChatMessage(`Playing against ${bot.name} (Level ${this.computerLevel})`, 'System');
    }

    startGame(playerColor) {
        this.gameActive = true;
        this.gameOver = false;
        this.moveHistory = [];
        this.capturedByWhite = [];
        this.capturedByBlack = [];
        this.playerColor = playerColor;

        document.getElementById('moveList').innerHTML = '<div class="no-moves-msg">Game started!</div>';
        document.getElementById('whiteCaptured').textContent = '';
        document.getElementById('blackCaptured').textContent = '';

        // Reset board
        this.board.setPosition(INITIAL_POSITION);
        this.board.turn = 'w';
        this.board.lastMove = null;
        this.board.selectedSquare = null;
        this.board.highlightedSquares = [];
        this.board.options.flipped = playerColor === 'b';
        this.board.render();

        // Hide overlay
        const overlay = document.getElementById('boardOverlay');
        overlay?.classList.add('hidden');

        // Setup timers
        this.whiteTime = this.selectedTime;
        this.blackTime = this.selectedTime;
        this.updateTimerDisplay('white', this.whiteTime);
        this.updateTimerDisplay('black', this.blackTime);
        this.activeTimer = 'white';
        this.startTimer();

        // If player is black, computer goes first
        if (playerColor === 'b' && this.computerMode) {
            setTimeout(() => this.makeComputerMove(), 800);
        }
    }

    startTimer() {
        clearInterval(this.timerInterval);
        const whiteTimerEl = document.getElementById('whiteTimer');
        const blackTimerEl = document.getElementById('blackTimer');

        whiteTimerEl?.classList.remove('timer-active', 'timer-inactive');
        blackTimerEl?.classList.remove('timer-active', 'timer-inactive');
        whiteTimerEl?.classList.add(this.activeTimer === 'white' ? 'timer-active' : 'timer-inactive');
        blackTimerEl?.classList.add(this.activeTimer === 'black' ? 'timer-active' : 'timer-inactive');

        this.timerInterval = setInterval(() => {
            if (!this.gameActive || this.gameOver) {
                clearInterval(this.timerInterval);
                return;
            }
            if (this.activeTimer === 'white') {
                this.whiteTime = Math.max(0, this.whiteTime - 1);
                this.updateTimerDisplay('white', this.whiteTime);
                if (this.whiteTime === 0) this.endGame('b', 'White ran out of time!');
            } else {
                this.blackTime = Math.max(0, this.blackTime - 1);
                this.updateTimerDisplay('black', this.blackTime);
                if (this.blackTime === 0) this.endGame('w', 'Black ran out of time!');
            }
        }, 1000);
    }

    switchTimer() {
        const whiteTimerEl = document.getElementById('whiteTimer');
        const blackTimerEl = document.getElementById('blackTimer');
        if (this.activeTimer === 'white') {
            this.whiteTime += this.selectedInc;
            this.activeTimer = 'black';
            whiteTimerEl?.classList.remove('timer-active');
            whiteTimerEl?.classList.add('timer-inactive');
            blackTimerEl?.classList.remove('timer-inactive');
            blackTimerEl?.classList.add('timer-active');
        } else {
            this.blackTime += this.selectedInc;
            this.activeTimer = 'white';
            blackTimerEl?.classList.remove('timer-active');
            blackTimerEl?.classList.add('timer-inactive');
            whiteTimerEl?.classList.remove('timer-inactive');
            whiteTimerEl?.classList.add('timer-active');
        }
        this.updateTimerDisplay('white', this.whiteTime);
        this.updateTimerDisplay('black', this.blackTime);
    }

    updateTimerDisplay(color, seconds) {
        const el = document.getElementById(`${color}Time`);
        if (!el) return;
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        el.textContent = `${m}:${s.toString().padStart(2, '0')}`;

        const timerEl = document.getElementById(`${color}Timer`);
        if (seconds <= 15) {
            timerEl?.classList.add('timer-low');
        }
    }

    onMoveMade(prevPos, newPos, lastMove, color) {
        if (!this.gameActive) return;

        // Check for captured piece
        const [fr, fc, tr, tc] = lastMove;
        const capturedPiece = prevPos[tr][tc];
        if (capturedPiece) {
            if (color === 'w') {
                this.capturedByWhite.push(capturedPiece);
                document.getElementById('whiteCaptured').textContent += PIECES[capturedPiece] + ' ';
            } else {
                this.capturedByBlack.push(capturedPiece);
                document.getElementById('blackCaptured').textContent += PIECES[capturedPiece] + ' ';
            }
        }

        // Check for pawn promotion
        const movedPiece = this.board.position[tr][tc];
        if (movedPiece && movedPiece[1] === 'P') {
            if ((movedPiece[0] === 'w' && tr === 0) || (movedPiece[0] === 'b' && tr === 7)) {
                // If it's the computer's move, auto-promote to queen
                if (this.computerMode && movedPiece[0] !== this.playerColor[0]) {
                    this.board.position[tr][tc] = movedPiece[0] + 'Q';
                    this.board.render();
                } else {
                    // Show promotion modal for human player
                    this.pendingPromotion = { tr, tc, color: movedPiece[0] };
                    this.showPromotionModal(movedPiece[0], tr, tc);
                    return; // Wait for user choice before continuing
                }
            }
        }

        // Add to move history
        const moveSan = this.getMoveNotation(prevPos, lastMove, color);
        this.moveHistory.push({ san: moveSan, color });
        this.moveIndex = this.moveHistory.length - 1;
        this.renderMoveList();

        // Switch timer
        this.switchTimer();

        // Check for checkmate / stalemate
        if (this.isGameOver(this.board.position, this.board.turn)) {
            const result = this.getGameResult(this.board.position, this.board.turn);
            setTimeout(() => this.endGame(result.winner, result.reason), 300);
            return;
        }

        // Computer move
        if (this.computerMode && this.board.turn !== this.playerColor && !this.gameOver) {
            const delay = 400 + Math.random() * 600 * (this.computerLevel / 5);
            setTimeout(() => this.makeComputerMove(), delay);
        }
    }

    showPromotionModal(color, tr, tc) {
        const modal = document.querySelector('.promotion-modal');
        if (!modal) return;
        const isWhite = color === 'w';
        const pieces = isWhite
            ? [['Q', '♕'], ['R', '♖'], ['B', '♗'], ['N', '♘']]
            : [['Q', '♛'], ['R', '♜'], ['B', '♝'], ['N', '♞']];
        modal.querySelector('.promotion-pieces').innerHTML = pieces.map(([type, sym]) =>
            `<button class="promotion-piece-btn" data-piece="${color}${type}" style="color:${isWhite ? '#fff' : '#1a1a1a'};text-shadow:${isWhite ? '0 0 2px rgba(0,0,0,0.5)' : 'none'}">${sym}</button>`
        ).join('');
        modal.querySelectorAll('.promotion-piece-btn').forEach(btn => {
            btn.addEventListener('click', () => this.completePromotion(btn.dataset.piece));
        });
        modal.classList.add('active');
    }

    completePromotion(piece) {
        const modal = document.querySelector('.promotion-modal');
        modal?.classList.remove('active');
        if (!this.pendingPromotion) return;
        const { tr, tc } = this.pendingPromotion;
        const prevPos = JSON.parse(JSON.stringify(this.board.position));
        this.board.position[tr][tc] = piece;
        this.board.render();
        this.pendingPromotion = null;

        const color = piece[0] === 'w' ? 'w' : 'b';
        const moveSan = piece[1] + '=' + piece[1]; // e.g. Q=Q simplified
        this.moveHistory.push({ san: '=' + piece[1], color });
        this.moveIndex = this.moveHistory.length - 1;
        this.renderMoveList();
        this.switchTimer();

        if (this.isGameOver(this.board.position, this.board.turn)) {
            const result = this.getGameResult(this.board.position, this.board.turn);
            setTimeout(() => this.endGame(result.winner, result.reason), 300);
            return;
        }
        if (this.computerMode && this.board.turn !== this.playerColor && !this.gameOver) {
            setTimeout(() => this.makeComputerMove(), 600);
        }
    }

    getMoveNotation(pos, lastMove, color) {
        const [fr, fc, tr, tc] = lastMove;
        const piece = pos[fr][fc];
        const captured = pos[tr][tc];
        const files = 'abcdefgh';
        const from = files[fc] + (8 - fr);
        const to = files[tc] + (8 - tr);
        let notation = '';
        if (piece && piece[1] !== 'P') notation = piece[1];
        if (captured) notation += 'x';
        notation += to;
        return notation;
    }

    renderMoveList() {
        const list = document.getElementById('moveList');
        if (!list) return;
        list.innerHTML = '';

        for (let i = 0; i < this.moveHistory.length; i += 2) {
            const pair = document.createElement('div');
            pair.className = 'move-pair';

            const numEl = document.createElement('span');
            numEl.className = 'move-number';
            numEl.textContent = (i / 2 + 1) + '.';
            pair.appendChild(numEl);

            const wMove = document.createElement('span');
            wMove.className = `move-item ${this.moveIndex === i ? 'active' : ''}`;
            wMove.textContent = this.moveHistory[i].san;
            wMove.addEventListener('click', () => this.goToMove(i));
            pair.appendChild(wMove);

            if (this.moveHistory[i + 1]) {
                const bMove = document.createElement('span');
                bMove.className = `move-item ${this.moveIndex === i + 1 ? 'active' : ''}`;
                bMove.textContent = this.moveHistory[i + 1].san;
                bMove.addEventListener('click', () => this.goToMove(i + 1));
                pair.appendChild(bMove);
            } else {
                pair.appendChild(document.createElement('span'));
            }

            list.appendChild(pair);
        }
        // Auto scroll
        list.scrollTop = list.scrollHeight;
    }

    goToMove(index) {
        if (index < 0 || index >= this.moveHistory.length) return;
        this.moveIndex = index;
        this.renderMoveList();
    }

    makeComputerMove() {
        if (!this.gameActive || this.gameOver) return;
        const color = this.board.turn;
        const move = this.getBestMove(this.board.position, color, this.computerLevel);
        if (move) {
            const prevPos = JSON.parse(JSON.stringify(this.board.position));
            this.board.movePiece(move[0], move[1], move[2], move[3]);
            this.onMoveMade(prevPos, this.board.position, move, color);
        }
    }

    getBestMove(position, color, level) {
        const allMoves = this.getAllMoves(position, color);
        if (!allMoves.length) return null;

        if (level <= 2) {
            // Random move
            return allMoves[Math.floor(Math.random() * allMoves.length)];
        }

        // Evaluate moves with minimax (depth based on level)
        let bestMove = null;
        let bestScore = -Infinity;
        const depth = Math.min(Math.floor(level / 3), 3);

        for (const move of allMoves) {
            const [fr, fc, tr, tc] = move;
            const newPos = JSON.parse(JSON.stringify(position));
            newPos[tr][tc] = newPos[fr][fc];
            newPos[fr][fc] = null;

            const score = -this.minimax(newPos, depth, -Infinity, Infinity, color === 'w' ? 'b' : 'w', color);
            if (score + (Math.random() * (10 - level)) > bestScore) {
                bestScore = score;
                bestMove = move;
            }
        }
        return bestMove || allMoves[0];
    }

    minimax(position, depth, alpha, beta, color, originalColor) {
        if (depth === 0) return this.evaluatePosition(position, originalColor);

        const moves = this.getAllMoves(position, color);
        if (!moves.length) return color === originalColor ? -9999 : 9999;

        let best = -Infinity;
        for (const move of moves.slice(0, 20)) { // Limit moves for performance
            const [fr, fc, tr, tc] = move;
            const newPos = JSON.parse(JSON.stringify(position));
            newPos[tr][tc] = newPos[fr][fc];
            newPos[fr][fc] = null;

            const score = -this.minimax(newPos, depth - 1, -beta, -alpha, color === 'w' ? 'b' : 'w', originalColor);
            best = Math.max(best, score);
            alpha = Math.max(alpha, score);
            if (alpha >= beta) break;
        }
        return best;
    }

    evaluatePosition(position, color) {
        let score = 0;
        const centerSquares = [[3, 3], [3, 4], [4, 3], [4, 4]];

        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = position[r][c];
                if (!piece) continue;
                const value = (PIECE_VALUES[piece[1]] || 0) * 10;
                const centerBonus = centerSquares.some(([cr, cc]) => cr === r && cc === c) ? 3 : 0;
                if (piece[0] === color) {
                    score += value + centerBonus;
                } else {
                    score -= value + centerBonus;
                }
            }
        }
        return score;
    }

    getAllMoves(position, color) {
        const moves = [];
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                const piece = position[r][c];
                if (!piece || piece[0] !== color) continue;
                const tempBoard = new ChessBoard(null, { position });
                tempBoard.position = position;
                const legalMoves = tempBoard.getLegalMoves(r, c);
                legalMoves.forEach(([tr, tc]) => moves.push([r, c, tr, tc]));
            }
        }
        return moves;
    }

    isGameOver(position, color) {
        const moves = this.getAllMoves(position, color);
        return moves.length === 0;
    }

    isInCheck(position, color) {
        // Find king position
        let kingRow = -1, kingCol = -1;
        for (let r = 0; r < 8; r++) {
            for (let c = 0; c < 8; c++) {
                if (position[r][c] === color + 'K') { kingRow = r; kingCol = c; }
            }
        }
        if (kingRow === -1) return false; // No king (shouldn't happen)
        // Check if any opponent piece attacks the king
        const opponent = color === 'w' ? 'b' : 'w';
        const opponentMoves = this.getAllMoves(position, opponent);
        return opponentMoves.some(([, , tr, tc]) => tr === kingRow && tc === kingCol);
    }

    getGameResult(position, color) {
        const opponent = color === 'w' ? 'b' : 'w';
        if (this.isInCheck(position, color)) {
            // Checkmate
            return { winner: opponent, reason: `${color === 'w' ? 'Black' : 'White'} wins by checkmate!` };
        } else {
            // Stalemate — draw
            return { winner: null, reason: 'Draw by stalemate!' };
        }
    }

    endGame(winner, reason) {
        if (this.gameOver) return;
        this.gameOver = true;
        this.gameActive = false;
        clearInterval(this.timerInterval);

        const boardWrapper = document.querySelector('.board-wrapper');
        const resultOverlay = document.createElement('div');
        resultOverlay.className = 'result-overlay';

        let title, trophy, className;
        if (!winner) {
            title = 'Draw!';
            trophy = '🤝';
            className = 'result-draw';
        } else if ((winner === 'w' && this.playerColor === 'w') || (winner === 'b' && this.playerColor === 'b')) {
            title = 'You Won!';
            trophy = '🏆';
            className = 'result-win';
        } else {
            title = 'You Lost';
            trophy = '💀';
            className = 'result-loss';
        }

        resultOverlay.innerHTML = `
      <div class="result-content">
        <span class="result-trophy">${trophy}</span>
        <div class="result-title ${className}">${title}</div>
        <div class="result-sub">${reason}</div>
        <div class="result-actions">
          <button class="btn btn-primary" id="newGameBtn">New Game</button>
          <button class="btn btn-ghost" id="analyzeBtn">Analyze</button>
        </div>
      </div>
    `;
        boardWrapper?.appendChild(resultOverlay);

        document.getElementById('newGameBtn')?.addEventListener('click', () => {
            resultOverlay.remove();
            this.showIdleState();
        });
        document.getElementById('analyzeBtn')?.addEventListener('click', () => {
            resultOverlay.remove();
            this.sendChatMessage('Game analysis mode — review your moves with the arrow keys.', 'System');
        });
    }

    offerDraw() {
        if (!this.gameActive) return;
        this.sendChatMessage('You offered a draw.', 'You');
        if (this.computerMode) {
            setTimeout(() => {
                const accepts = Math.random() > 0.5;
                if (accepts) {
                    this.sendChatMessage('Draw accepted!', 'Opponent');
                    this.endGame(null, 'Game drawn by mutual agreement');
                } else {
                    this.sendChatMessage('Draw declined.', 'Opponent');
                }
            }, 1000);
        }
    }

    resign() {
        if (!this.gameActive) return;
        const confirmed = confirm('Are you sure you want to resign?');
        if (confirmed) {
            const winner = this.playerColor === 'w' ? 'b' : 'w';
            this.endGame(winner, 'You resigned.');
        }
    }

    flipBoard() {
        this.board.options.flipped = !this.board.options.flipped;
        this.board.render();
    }

    sendChatMessage(msg, sender) {
        const chat = document.getElementById('chatMessages');
        if (!chat) return;
        const div = document.createElement('div');
        div.style.cssText = 'padding:4px 0;font-size:12px;border-bottom:1px solid rgba(255,255,255,0.05);';
        const isSystem = sender === 'System';
        div.innerHTML = `<strong style="color:${isSystem ? '#666' : '#81b64c'}">${sender}:</strong> <span style="color:#aaa">${msg}</span>`;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    }

    updateActiveCount() {
        const el = document.getElementById('activeCount');
        if (!el) return;
        const base = 152000 + Math.floor(Math.random() * 2000);
        el.textContent = base.toLocaleString();
    }

    showIdleState() {
        const overlay = document.getElementById('boardOverlay');
        const content = document.getElementById('overlayContent');
        if (!overlay || !content) return;
        overlay.classList.remove('hidden');
        content.innerHTML = `
      <div class="overlay-icon">♟</div>
      <h2>Find a Game</h2>
      <p>Choose your time control and click "Find Game" to start playing!</p>
      <button class="btn btn-primary btn-lg" id="overlayAction">Play Now</button>
    `;
        document.getElementById('overlayAction')?.addEventListener('click', () => this.startSearch());
    }
}

// ========================
// INIT
// ========================
document.addEventListener('DOMContentLoaded', () => {
    // Only init on game page
    if (document.getElementById('gameBoard')) {
        const game = new GameEngine();
        window.gameEngine = game;
    }

    // Re-init auth modal for game page
    const modal = document.getElementById('authModal');
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const closeModal = document.getElementById('closeModal');
    const tabs = document.querySelectorAll('.modal-tab');

    function openModal() { modal?.classList.add('open'); document.body.style.overflow = 'hidden'; }
    function closeModalFn() { modal?.classList.remove('open'); document.body.style.overflow = ''; }

    loginBtn?.addEventListener('click', openModal);
    signupBtn?.addEventListener('click', openModal);
    closeModal?.addEventListener('click', closeModalFn);
    modal?.addEventListener('click', e => { if (e.target === modal) closeModalFn(); });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const signupForm = document.getElementById('signupForm');
            const loginForm = document.getElementById('loginForm');
            signupForm?.classList.toggle('hidden', tab.dataset.tab !== 'signup');
            loginForm?.classList.toggle('hidden', tab.dataset.tab !== 'login');
        });
    });
});
