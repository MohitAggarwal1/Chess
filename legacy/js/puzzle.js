/* ===================================================
   CHESS.IN CLONE — PUZZLE.JS
   Interactive daily puzzle logic
   =================================================== */

const PUZZLES = [
    {
        id: '#12,847',
        rating: 1250,
        difficulty: 'easy',
        turn: 'w',
        turnText: 'White to move — find the best move!',
        turnPiece: '♙',
        tags: ['Pin', 'Tactic', 'Intermediate', 'Middlegame'],
        source: 'Magnus - Caruana 2023',
        solvedBy: '142,831',
        position: [
            [null, null, 'bK', null, null, null, null, null],
            ['bP', 'bP', null, null, null, 'bP', 'bP', null],
            [null, null, null, 'bP', null, null, null, null],
            [null, null, null, null, 'bQ', null, null, null],
            [null, null, null, null, 'wR', null, null, null],
            [null, null, null, null, null, null, null, null],
            ['wP', 'wP', null, null, null, 'wP', 'wP', 'wP'],
            [null, null, null, null, 'wK', null, null, null],
        ],
        solution: [[4, 4, 3, 4]],
        solutionSan: ['Rxe5'],
        hint: 'The rook can capture something very valuable...',
    },
    {
        id: '#12,848',
        rating: 1480,
        difficulty: 'medium',
        turn: 'w',
        turnText: 'White to move — find the knight fork!',
        turnPiece: '♘',
        tags: ['Fork', 'Knight', 'Tactic', 'Middlegame'],
        source: 'Tactical Puzzles Collection',
        solvedBy: '89,214',
        position: [
            ['bR', null, null, null, 'bK', null, null, 'bR'],
            ['bP', 'bP', 'bP', null, null, 'bP', 'bP', 'bP'],
            [null, null, 'bN', null, 'bP', null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, 'wN', null, null, null, null],
            [null, null, null, null, null, null, null, null],
            ['wP', 'wP', 'wP', null, null, 'wP', 'wP', 'wP'],
            ['wR', null, null, null, 'wK', null, null, 'wR'],
        ],
        solution: [[4, 3, 2, 4]],
        solutionSan: ['Ne6+'],
        hint: 'Knights can jump! Look for a square that attacks two pieces at once.',
    },
];

let currentPuzzle = 0;
let puzzleBoard = null;
let puzzleSolved = false;
let solutionShown = false;

function initPuzzlePage() {
    if (!document.getElementById('puzzleBoard')) return;

    document.querySelectorAll('.puzzle-cat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.puzzle-cat-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPuzzle = (currentPuzzle + 1) % PUZZLES.length;
            loadPuzzle(currentPuzzle);
        });
    });

    document.getElementById('hintBtn')?.addEventListener('click', showHint);
    document.getElementById('solutionBtn')?.addEventListener('click', showSolution);
    document.getElementById('nextPuzzleBtn')?.addEventListener('click', () => { currentPuzzle++; loadPuzzle(currentPuzzle); });
    document.getElementById('retryBtn')?.addEventListener('click', () => loadPuzzle(currentPuzzle));

    loadPuzzle(0);
}

function loadPuzzle(index) {
    const puzzle = PUZZLES[index % PUZZLES.length];
    puzzleSolved = false;
    solutionShown = false;

    document.getElementById('puzzleId').textContent = puzzle.id;
    document.getElementById('thisPuzzleRating').textContent = puzzle.rating;
    document.getElementById('puzzleTurnText').textContent = puzzle.turnText;
    document.querySelector('.turn-indicator-piece').textContent = puzzle.turnPiece;

    const diffEl = document.getElementById('puzzleDifficulty');
    diffEl.className = `puzzle-difficulty ${puzzle.difficulty}`;
    diffEl.textContent = { easy: '⭐ Daily Puzzle', medium: '🔥 Tactics', hard: '💀 Advanced' }[puzzle.difficulty];

    const themesEl = document.getElementById('puzzleThemes');
    if (themesEl) themesEl.innerHTML = puzzle.tags.map(t => `<span class="theme-tag">${t}</span>`).join('');

    const solMoves = document.getElementById('solutionMoves');
    if (solMoves) solMoves.innerHTML = '<div class="solution-move-placeholder">Solve the puzzle to reveal moves</div>';

    setFeedback('neutral', '💡', 'Click a piece to start solving');

    if (puzzleBoard && puzzleBoard.container) puzzleBoard.container.innerHTML = '';
    puzzleBoard = new ChessBoard('puzzleBoard', { showCoords: true, interactive: true, position: puzzle.position });
    puzzleBoard.turn = puzzle.turn;

    const originalClick = puzzleBoard.handleSquareClick.bind(puzzleBoard);
    puzzleBoard.handleSquareClick = (row, col) => {
        if (puzzleSolved || solutionShown) return;
        const prevTurn = puzzleBoard.turn;
        originalClick(row, col);
        if (puzzleBoard.turn !== prevTurn && puzzleBoard.lastMove) {
            checkSolution(puzzleBoard.lastMove, puzzle);
        }
    };
}

function checkSolution(move, puzzle) {
    const [fr, fc, tr, tc] = move;
    const [sr, sc, str, stc] = puzzle.solution[0];
    if (fr === sr && fc === sc && tr === str && tc === stc) {
        puzzleSolved = true;
        setFeedback('correct', '✓', "Excellent! That's the best move!");
        revealSolutionMoves(puzzle);
        animateRatingBump();
    } else {
        setFeedback('wrong', '✗', 'Not quite — try again!');
        setTimeout(() => {
            const p = PUZZLES[currentPuzzle % PUZZLES.length];
            puzzleBoard.position = JSON.parse(JSON.stringify(p.position));
            puzzleBoard.turn = p.turn;
            puzzleBoard.selectedSquare = null;
            puzzleBoard.highlightedSquares = [];
            puzzleBoard.lastMove = null;
            puzzleBoard.render();
            setFeedback('neutral', '💡', 'Try again — find the best move!');
        }, 900);
    }
}

function revealSolutionMoves(puzzle) {
    const el = document.getElementById('solutionMoves');
    if (!el) return;
    el.innerHTML = puzzle.solutionSan.map((san, i) => `
        <div class="sol-move">
            <span class="sol-move-num">${Math.floor(i / 2) + 1}${i % 2 === 0 ? '.' : '...'}</span>
            <span class="sol-move-san">${san}</span>
            <span class="sol-move-comment">${i === 0 ? '✓ Best move' : ''}</span>
        </div>`).join('');
}

function showHint() {
    if (puzzleSolved) return;
    const puzzle = PUZZLES[currentPuzzle % PUZZLES.length];
    setFeedback('neutral', '💡', puzzle.hint);
    const [fr, fc] = puzzle.solution[0];
    puzzleBoard.selectedSquare = [fr, fc];
    puzzleBoard.highlightedSquares = puzzleBoard.getLegalMoves(fr, fc);
    puzzleBoard.render();
    setTimeout(() => { puzzleBoard.selectedSquare = null; puzzleBoard.highlightedSquares = []; puzzleBoard.render(); }, 2500);
}

function showSolution() {
    const puzzle = PUZZLES[currentPuzzle % PUZZLES.length];
    solutionShown = true;
    const [fr, fc, tr, tc] = puzzle.solution[0];
    puzzleBoard.movePiece(fr, fc, tr, tc);
    setFeedback('neutral', '👁', `Solution: ${puzzle.solutionSan.join(', ')}`);
    revealSolutionMoves(puzzle);
}

function setFeedback(type, icon, text) {
    const bar = document.getElementById('puzzleFeedback');
    if (!bar) return;
    bar.className = 'puzzle-feedback-bar' + (type === 'correct' ? ' correct' : type === 'wrong' ? ' wrong' : '');
    const iconEl = document.getElementById('feedbackIcon');
    const textEl = document.getElementById('feedbackText');
    if (iconEl) iconEl.textContent = icon;
    if (textEl) textEl.textContent = text;
}

function animateRatingBump() {
    const el = document.getElementById('puzzleRating');
    if (!el) return;
    const target = parseInt(el.textContent.replace(/\D/g, '')) + 4 + Math.floor(Math.random() * 8);
    let val = parseInt(el.textContent.replace(/\D/g, ''));
    const step = () => { val = Math.min(val + 1, target); el.textContent = val.toLocaleString(); if (val < target) requestAnimationFrame(step); };
    requestAnimationFrame(step);
}

document.addEventListener('DOMContentLoaded', initPuzzlePage);
