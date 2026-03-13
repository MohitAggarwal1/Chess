/* ===================================================
   PUZZLES.JS
   =================================================== */

const PUZZLE_POSITIONS = [
    {
        position: [
            ['bR', null, 'bB', null, null, 'bR', 'bK', null],
            ['bP', 'bP', 'bP', null, null, 'bP', 'bP', 'bP'],
            [null, null, 'bN', 'bP', null, null, null, null],
            [null, null, null, null, 'bP', null, null, null],
            [null, null, 'wB', 'wP', null, null, null, null],
            [null, null, 'wN', null, null, 'wN', null, null],
            ['wP', 'wP', 'wP', null, null, 'wP', 'wP', 'wP'],
            ['wR', null, 'wB', 'wQ', null, 'wR', 'wK', null],
        ],
        turn: 'w',
        solution: [5, 5, 2, 4], // Ne5 forks
        rating: 1456,
        theme: 'Fork'
    },
    {
        position: [
            [null, null, null, null, 'bK', null, null, null],
            ['bP', null, null, null, 'bQ', null, null, 'bP'],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, 'wQ', null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, 'wK', null, null, null],
        ],
        turn: 'w',
        solution: [3, 6, 1, 4],
        rating: 1823,
        theme: 'Checkmate in 1'
    },
];

let currentPuzzle = 0;
let puzzleBoard = null;
let puzzleSolved = false;

const RUSH_LEADERS = [
    { name: 'pawnmaster99', avatar: 'P', color: '#81b64c', score: 48 },
    { name: 'BlitzWizard', avatar: 'B', color: '#4a90d9', score: 45 },
    { name: 'TactiKal', avatar: 'T', color: '#ef4444', score: 42 },
    { name: 'QuickFinger', avatar: 'Q', color: '#f59e0b', score: 38 },
    { name: 'RushLover', avatar: 'R', color: '#8b5cf6', score: 35 },
    { name: 'SpeedKnight', avatar: 'S', color: '#06b6d4', score: 32 },
];

function loadPuzzle(idx) {
    const puzzle = PUZZLE_POSITIONS[idx % PUZZLE_POSITIONS.length];
    puzzleSolved = false;

    if (!puzzleBoard) {
        puzzleBoard = new ChessBoard('puzzleBoard', {
            position: puzzle.position,
            showCoords: true,
            interactive: true,
        });
    } else {
        puzzleBoard.setPosition(puzzle.position);
        puzzleBoard.turn = puzzle.turn;
        puzzleBoard.selectedSquare = null;
        puzzleBoard.highlightedSquares = [];
        puzzleBoard.lastMove = null;
        puzzleBoard.render();
    }
    puzzleBoard.turn = puzzle.turn;

    // Update UI
    const turnDot = document.querySelector('.turn-dot');
    if (turnDot) {
        turnDot.className = `turn-dot ${puzzle.turn === 'w' ? 'white-dot' : 'black-dot'}`;
    }
    const pzTurnText = document.querySelector('.pz-turn-indicator span');
    if (pzTurnText) {
        pzTurnText.textContent = `${puzzle.turn === 'w' ? 'White' : 'Black'} to move — Find the best move!`;
    }
    const ratingEl = document.getElementById('puzzleRating');
    if (ratingEl) ratingEl.textContent = puzzle.rating;

    // Override move handler to check solution
    const originalClick = puzzleBoard.handleSquareClick.bind(puzzleBoard);
    puzzleBoard.handleSquareClick = (row, col) => {
        if (puzzleSolved) return;
        const prevTurn = puzzleBoard.turn;
        const prevSelected = puzzleBoard.selectedSquare;
        originalClick(row, col);
        if (puzzleBoard.turn !== prevTurn) {
            const lm = puzzleBoard.lastMove;
            const sol = PUZZLE_POSITIONS[idx].solution;
            if (lm && lm[0] === sol[0] && lm[1] === sol[1] && lm[2] === sol[2] && lm[3] === sol[3]) {
                showPuzzleResult(true);
            } else {
                showPuzzleResult(false);
            }
        }
    };
}

function showPuzzleResult(correct) {
    puzzleSolved = true;
    const bar = document.getElementById('puzzlePromptBar');
    if (!bar) return;

    if (correct) {
        bar.innerHTML = `
      <div class="pz-prompt-inner" style="background:rgba(129,182,76,0.15);border-radius:8px;padding:12px 18px;">
        <div style="display:flex;align-items:center;gap:10px;color:#81b64c;font-weight:700;font-size:15px;">
          <span style="font-size:24px;">✓</span>
          Brilliant! That's the best move!
        </div>
        <button class="btn btn-primary btn-sm" id="nextPuzzleBtn">Next Puzzle →</button>
      </div>
    `;
    } else {
        bar.innerHTML = `
      <div class="pz-prompt-inner" style="background:rgba(239,68,68,0.1);border-radius:8px;padding:12px 18px;">
        <div style="display:flex;align-items:center;gap:10px;color:#ef4444;font-weight:700;font-size:15px;">
          <span style="font-size:24px;">✗</span>
          Not the best move. Try again!
        </div>
        <button class="btn btn-sm" style="background:#333;color:#fff;" id="retryPuzzle">Retry</button>
      </div>
    `;
        document.getElementById('retryPuzzle')?.addEventListener('click', () => loadPuzzle(currentPuzzle));
    }

    document.getElementById('nextPuzzleBtn')?.addEventListener('click', () => {
        currentPuzzle++;
        loadPuzzle(currentPuzzle);
        document.getElementById('puzzlePromptBar').innerHTML = `
      <div class="pz-prompt-inner">
        <div class="pz-turn-indicator" id="pzTurnIndicator">
          <div class="turn-dot white-dot"></div>
          <span>White to move — Find the best move!</span>
        </div>
        <div class="pz-rating-badge">Rating: <strong id="puzzleRating">1456</strong></div>
      </div>
    `;
    });
}

function renderRushLeaderboard() {
    const list = document.getElementById('pzLeaderboard');
    if (!list) return;
    RUSH_LEADERS.forEach((p, i) => {
        const item = document.createElement('div');
        item.className = 'pz-lb-item';
        item.innerHTML = `
      <div class="pz-lb-rank" style="${i < 3 ? ['color:#f0b429', 'color:#b0bec5', 'color:#cd7f32'][i] : ''}">${i + 1}</div>
      <div class="pz-lb-avatar" style="background:${p.color}22;color:${p.color}">${p.avatar}</div>
      <div class="pz-lb-name">${p.name}</div>
      <div class="pz-lb-score">${p.score} <span style="font-size:11px;color:#666;font-weight:400;">solved</span></div>
    `;
        list.appendChild(item);
    });
}

// Puzzle mode cards
document.querySelectorAll('.puzzle-mode-card').forEach(card => {
    card.addEventListener('click', () => {
        document.querySelectorAll('.puzzle-mode-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
    });
});

document.addEventListener('DOMContentLoaded', () => {
    loadPuzzle(0);
    renderRushLeaderboard();

    // Auth modal
    const modal = document.getElementById('authModal');
    document.getElementById('loginBtn')?.addEventListener('click', () => modal?.classList.add('open'));
    document.getElementById('signupBtn')?.addEventListener('click', () => modal?.classList.add('open'));
    document.getElementById('closeModal')?.addEventListener('click', () => modal?.classList.remove('open'));
    modal?.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });

    // Header scroll
    const header = document.getElementById('site-header');
    window.addEventListener('scroll', () => {
        header?.classList.toggle('scrolled', window.scrollY > 20);
    });
});
