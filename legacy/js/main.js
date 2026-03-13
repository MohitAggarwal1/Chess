/* ===================================================
   CHESS.IN CLONE — MAIN.JS
   Board rendering, UI interactions, animations
   =================================================== */

// ========================
// CHESS PIECE UNICODE
// ========================
const PIECES = {
  wK: '♔', wQ: '♕', wR: '♖', wB: '♗', wN: '♘', wP: '♙',
  bK: '♚', bQ: '♛', bR: '♜', bB: '♝', bN: '♞', bP: '♟'
};

const PIECE_COLORS = {
  w: '#ffffff', b: '#1a1a1a'
};

// ========================
// INITIAL BOARD POSITION
// ========================
const INITIAL_POSITION = [
  ['bR', 'bN', 'bB', 'bQ', 'bK', 'bB', 'bN', 'bR'],
  ['bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP', 'bP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP', 'wP'],
  ['wR', 'wN', 'wB', 'wQ', 'wK', 'wB', 'wN', 'wR']
];

// ========================
// CHESS BOARD RENDERER
// ========================
class ChessBoard {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;
    this.options = {
      interactive: options.interactive || false,
      showCoords: options.showCoords !== false,
      flipped: options.flipped || false,
      size: options.size || null,
    };
    this.position = JSON.parse(JSON.stringify(options.position || INITIAL_POSITION));
    this.selectedSquare = null;
    this.lastMove = null;
    this.highlightedSquares = [];
    this.turn = 'w';
    this.render();
  }

  getSquareClass(row, col) {
    return (row + col) % 2 === 0 ? 'light' : 'dark';
  }

  render() {
    if (!this.container) return;
    this.container.innerHTML = '';
    const board = document.createElement('div');
    board.className = 'chess-board';

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const r = this.options.flipped ? 7 - row : row;
        const c = this.options.flipped ? 7 - col : col;
        const piece = this.position[r][c];
        const sq = document.createElement('div');
        sq.className = `chess-square ${this.getSquareClass(r, c)}`;
        sq.dataset.row = r;
        sq.dataset.col = c;

        // Add highlight classes
        if (this.lastMove) {
          const [fr, fc, tr, tc] = this.lastMove;
          if ((r === fr && c === fc) || (r === tr && c === tc)) {
            sq.classList.add(this.getSquareClass(r, c) === 'light' ? 'last-move-light' : 'last-move-dark');
          }
        }
        if (this.selectedSquare && this.selectedSquare[0] === r && this.selectedSquare[1] === c) {
          sq.classList.add('selected');
        }
        if (this.highlightedSquares.some(([hr, hc]) => hr === r && hc === c)) {
          sq.classList.add('highlighted');
        }

        // Piece
        if (piece) {
          const pieceEl = document.createElement('div');
          pieceEl.className = 'chess-piece';
          pieceEl.textContent = PIECES[piece];
          pieceEl.style.color = PIECE_COLORS[piece[0]];
          if (piece[0] === 'w') {
            pieceEl.style.textShadow = '0 0 2px rgba(0,0,0,0.4)';
          } else {
            pieceEl.style.textShadow = '0 0 2px rgba(255,255,255,0.1)';
          }
          sq.appendChild(pieceEl);
        }

        // Coordinate labels
        if (this.options.showCoords) {
          if (col === 0) {
            const rankLabel = document.createElement('span');
            rankLabel.className = 'coord-label rank';
            rankLabel.textContent = this.options.flipped ? (row + 1) : (8 - row);
            sq.appendChild(rankLabel);
          }
          if (row === 7) {
            const fileLabel = document.createElement('span');
            fileLabel.className = 'coord-label file';
            fileLabel.textContent = 'abcdefgh'[this.options.flipped ? 7 - col : col];
            sq.appendChild(fileLabel);
          }
        }

        // Click handler
        if (this.options.interactive) {
          sq.addEventListener('click', () => this.handleSquareClick(r, c));
        }

        board.appendChild(sq);
      }
    }

    this.container.appendChild(board);
  }

  handleSquareClick(row, col) {
    const piece = this.position[row][col];
    if (this.selectedSquare) {
      const [sr, sc] = this.selectedSquare;
      if (sr === row && sc === col) {
        this.selectedSquare = null;
        this.highlightedSquares = [];
        this.render();
        return;
      }
      // Move
      if (this.highlightedSquares.some(([hr, hc]) => hr === row && hc === col)) {
        this.movePiece(sr, sc, row, col);
        return;
      }
    }
    // Select a piece
    if (piece && piece[0] === this.turn) {
      this.selectedSquare = [row, col];
      this.highlightedSquares = this.getLegalMoves(row, col);
      this.render();
    }
  }

  getLegalMoves(row, col) {
    const piece = this.position[row][col];
    if (!piece) return [];
    const type = piece[1];
    const color = piece[0];
    const moves = [];

    const addMove = (r, c) => {
      if (r < 0 || r > 7 || c < 0 || c > 7) return false;
      const target = this.position[r][c];
      if (target && target[0] === color) return false;
      moves.push([r, c]);
      return !target;
    };

    const slideMove = (dr, dc) => {
      let r = row + dr, c = col + dc;
      while (r >= 0 && r < 8 && c >= 0 && c < 8) {
        if (!addMove(r, c)) break;
        r += dr; c += dc;
      }
    };

    switch (type) {
      case 'P': {
        const dir = color === 'w' ? -1 : 1;
        const startRow = color === 'w' ? 6 : 1;
        if (!this.position[row + dir]?.[col]) {
          moves.push([row + dir, col]);
          if (row === startRow && !this.position[row + 2 * dir]?.[col]) {
            moves.push([row + 2 * dir, col]);
          }
        }
        [-1, 1].forEach(dc => {
          const target = this.position[row + dir]?.[col + dc];
          if (target && target[0] !== color) moves.push([row + dir, col + dc]);
        });
        break;
      }
      case 'R': [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(([dr, dc]) => slideMove(dr, dc)); break;
      case 'B': [[-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => slideMove(dr, dc)); break;
      case 'Q': [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]].forEach(([dr, dc]) => slideMove(dr, dc)); break;
      case 'N': [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]].forEach(([dr, dc]) => addMove(row + dr, col + dc)); break;
      case 'K': [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]].forEach(([dr, dc]) => addMove(row + dr, col + dc)); break;
    }
    return moves;
  }

  movePiece(fr, fc, tr, tc) {
    this.position[tr][tc] = this.position[fr][fc];
    this.position[fr][fc] = null;
    this.lastMove = [fr, fc, tr, tc];
    this.selectedSquare = null;
    this.highlightedSquares = [];
    this.turn = this.turn === 'w' ? 'b' : 'w';
    this.render();
  }

  setPosition(position) {
    this.position = JSON.parse(JSON.stringify(position));
    this.render();
  }
}

// ========================
// DEMO GAME MOVES (for auto-play)
// ========================
const DEMO_MOVES = [
  // e4 e5 Nf3 Nc6 Bb5 (Ruy Lopez opening)
  [[6, 4], [4, 4]], // e4
  [[1, 4], [3, 4]], // e5
  [[7, 6], [5, 5]], // Nf3
  [[0, 1], [2, 2]], // Nc6
  [[7, 5], [4, 2]], // Bb5
  [[0, 6], [2, 5]], // Nf6
  [[4, 2], [3, 2]], // Bb5-a4 (retreat)
  [[1, 0], [2, 0]], // a6
  [[3, 2], [4, 2]], // Ba4
  [[3, 4], [4, 4]], // ...d5
  [[4, 4], [3, 4]], // exd5
  [[2, 5], [4, 4]], // Nxd5
  [[5, 5], [4, 3]], // Nxe5
  [[2, 2], [4, 3]], // Nxe5
  [[7, 3], [4, 3]], // Qxd5
];

let demoIndex = 0;
let demoPlaying = true;
let demoInterval;

// ========================
// NAVBAR
// ========================
function initNavbar() {
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });
}

// ========================
// AUTH MODAL
// ========================
function initAuthModal() {
  const modal = document.getElementById('authModal');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const closeModal = document.getElementById('closeModal');
  const tabs = document.querySelectorAll('.modal-tab');
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  function openModal(tab) {
    modal?.classList.add('open');
    document.body.style.overflow = 'hidden';
    showTab(tab);
  }

  function closeModalFn() {
    modal?.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showTab(tabName) {
    tabs.forEach(t => t.classList.toggle('active', t.dataset.tab === tabName));
    signupForm?.classList.toggle('hidden', tabName !== 'signup');
    loginForm?.classList.toggle('hidden', tabName !== 'login');
  }

  loginBtn?.addEventListener('click', () => openModal('login'));
  signupBtn?.addEventListener('click', () => openModal('signup'));
  closeModal?.addEventListener('click', closeModalFn);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModalFn(); });

  tabs.forEach(tab => {
    tab.addEventListener('click', () => showTab(tab.dataset.tab));
  });

  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('open')) closeModalFn();
  });
}

// ========================
// ANIMATED COUNTER
// ========================
function animateCounter(el, target, duration = 2000) {
  const isLarge = target > 1000000;
  const start = Date.now();
  const startVal = 0;

  function formatNum(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M+';
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K+';
    return n.toLocaleString();
  }

  function update() {
    const elapsed = Date.now() - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = formatNum(current);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ========================
// DEMO BOARD AUTO-PLAY
// ========================
function initDemoBoard() {
  const heroBoardEl = document.getElementById('heroBoard');
  const miniBoard = document.getElementById('miniBoard');
  const puzzleBoard = document.getElementById('puzzlePreviewBoard');

  // Hero board — static with full initial position
  if (heroBoardEl) {
    const heroChess = new ChessBoard('heroBoard', { showCoords: true, interactive: false });
    // Play a few moves for visual interest
    setTimeout(() => {
      heroChess.movePiece(6, 4, 4, 4); // e4
      setTimeout(() => {
        heroChess.movePiece(1, 4, 3, 4); // e5
        setTimeout(() => {
          heroChess.movePiece(7, 6, 5, 5); // Nf3
          setTimeout(() => {
            heroChess.movePiece(0, 1, 2, 2); // Nc6
            setTimeout(() => {
              heroChess.movePiece(7, 5, 4, 2); // Bb5
            }, 1200);
          }, 1000);
        }, 900);
      }, 800);
    }, 1000);
  }

  // Mini board with auto-play
  if (miniBoard) {
    const chess = new ChessBoard('miniBoard', { showCoords: true, interactive: true });
    const prevBtn = document.getElementById('prevMove');
    const playPauseBtn = document.getElementById('playPause');
    const nextBtn = document.getElementById('nextMove');

    function playNextMove() {
      if (demoIndex < DEMO_MOVES.length) {
        const [from, to] = DEMO_MOVES[demoIndex];
        chess.movePiece(from[0], from[1], to[0], to[1]);
        demoIndex++;
      } else {
        // Reset
        demoIndex = 0;
        chess.setPosition(INITIAL_POSITION);
        chess.turn = 'w';
      }
    }

    function startAutoPlay() {
      demoInterval = setInterval(playNextMove, 1500);
      demoPlaying = true;
      if (playPauseBtn) playPauseBtn.textContent = '⏸';
    }

    function stopAutoPlay() {
      clearInterval(demoInterval);
      demoPlaying = false;
      if (playPauseBtn) playPauseBtn.textContent = '▶';
    }

    playPauseBtn?.addEventListener('click', () => {
      if (demoPlaying) stopAutoPlay(); else startAutoPlay();
    });

    nextBtn?.addEventListener('click', () => {
      stopAutoPlay();
      playNextMove();
    });

    prevBtn?.addEventListener('click', () => {
      stopAutoPlay();
      if (demoIndex > 0) {
        demoIndex--;
        // Reset and replay up to demoIndex
        chess.setPosition(INITIAL_POSITION);
        chess.turn = 'w';
        chess.lastMove = null;
        for (let i = 0; i < demoIndex; i++) {
          const [from, to] = DEMO_MOVES[i];
          chess.movePiece(from[0], from[1], to[0], to[1]);
        }
      }
    });

    startAutoPlay();
  }

  // Puzzle board — a tactical position
  if (puzzleBoard) {
    const puzzlePosition = [
      ['bR', null, 'bB', 'bQ', null, 'bR', 'bK', null],
      ['bP', 'bP', 'bP', null, null, 'bP', 'bP', 'bP'],
      [null, null, 'bN', null, null, 'bN', null, null],
      [null, null, null, 'bP', null, null, null, null],
      [null, null, 'wB', 'wP', null, null, null, null],
      [null, null, 'wN', null, null, 'wN', null, null],
      ['wP', 'wP', 'wP', null, null, 'wP', 'wP', 'wP'],
      ['wR', null, 'wB', 'wQ', null, 'wR', 'wK', null],
    ];
    new ChessBoard('puzzlePreviewBoard', { position: puzzlePosition, showCoords: true, interactive: false });
  }

  // Phone boards
  ['phoneBoard', 'phoneBoardFront'].forEach(id => {
    if (document.getElementById(id)) {
      new ChessBoard(id, { showCoords: false, interactive: false });
    }
  });
}

// ========================
// TICKER DUPLICATION (infinite scroll)
// ========================
function initTicker() {
  const content = document.getElementById('tickerContent');
  if (!content) return;
  // Duplicate content for seamless loop
  const originalHTML = content.innerHTML;
  content.innerHTML = originalHTML + originalHTML;
}

// ========================
// LEADERBOARD
// ========================
const LEADERBOARD_DATA = {
  blitz: [
    { name: 'Magnus Carlsen', country: '🇳🇴 Norway', rating: 3202, avatar: 'M', color: '#81b64c' },
    { name: 'Hikaru Nakamura', country: '🇺🇸 USA', rating: 3185, avatar: 'H', color: '#4a90d9' },
    { name: 'Alireza Firouzja', country: '🇫🇷 France', rating: 3167, avatar: 'A', color: '#ef4444' },
    { name: 'Fabiano Caruana', country: '🇺🇸 USA', rating: 3149, avatar: 'F', color: '#f59e0b' },
    { name: 'Ding Liren', country: '🇨🇳 China', rating: 3141, avatar: 'D', color: '#8b5cf6' },
    { name: 'Wesley So', country: '🇵🇭 Philippines', rating: 3128, avatar: 'W', color: '#06b6d4' },
    { name: 'Anish Giri', country: '🇳🇱 Netherlands', rating: 3112, avatar: 'G', color: '#10b981' },
  ],
  rapid: [
    { name: 'Magnus Carlsen', country: '🇳🇴 Norway', rating: 3256, avatar: 'M', color: '#81b64c' },
    { name: 'Fabiano Caruana', country: '🇺🇸 USA', rating: 3198, avatar: 'F', color: '#f59e0b' },
    { name: 'Hikaru Nakamura', country: '🇺🇸 USA', rating: 3172, avatar: 'H', color: '#4a90d9' },
    { name: 'Ding Liren', country: '🇨🇳 China', rating: 3155, avatar: 'D', color: '#8b5cf6' },
    { name: 'Ian Nepomniachtchi', country: '🇷🇺 Russia', rating: 3138, avatar: 'I', color: '#ef4444' },
    { name: 'Wang Hao', country: '🇨🇳 China', rating: 3120, avatar: 'W', color: '#06b6d4' },
    { name: 'Levon Aronian', country: '🇦🇲 Armenia', rating: 3102, avatar: 'L', color: '#f59e0b' },
  ],
  bullet: [
    { name: 'Hikaru Nakamura', country: '🇺🇸 USA', rating: 3348, avatar: 'H', color: '#4a90d9' },
    { name: 'Magnus Carlsen', country: '🇳🇴 Norway', rating: 3295, avatar: 'M', color: '#81b64c' },
    { name: 'Alireza Firouzja', country: '🇫🇷 France', rating: 3287, avatar: 'A', color: '#ef4444' },
    { name: 'MVL', country: '🇫🇷 France', rating: 3241, avatar: 'V', color: '#8b5cf6' },
    { name: 'Дaniil Dubov', country: '🇷🇺 Russia', rating: 3219, avatar: 'X', color: '#06b6d4' },
    { name: 'Anish Giri', country: '🇳🇱 Netherlands', rating: 3198, avatar: 'G', color: '#10b981' },
    { name: 'Wesley So', country: '🇵🇭 Philippines', rating: 3181, avatar: 'W', color: '#f59e0b' },
  ],
  classical: [
    { name: 'Magnus Carlsen', country: '🇳🇴 Norway', rating: 2862, avatar: 'M', color: '#81b64c' },
    { name: 'Fabiano Caruana', country: '🇺🇸 USA', rating: 2820, avatar: 'F', color: '#f59e0b' },
    { name: 'Ding Liren', country: '🇨🇳 China', rating: 2811, avatar: 'D', color: '#8b5cf6' },
    { name: 'Alireza Firouzja', country: '🇫🇷 France', rating: 2793, avatar: 'A', color: '#ef4444' },
    { name: 'Ian Nepomniachtchi', country: '🇷🇺 Russia', rating: 2789, avatar: 'I', color: '#4a90d9' },
    { name: 'Anish Giri', country: '🇳🇱 Netherlands', rating: 2779, avatar: 'G', color: '#10b981' },
    { name: 'Wesley So', country: '🇵🇭 Philippines', rating: 2775, avatar: 'W', color: '#06b6d4' },
  ]
};

const RANK_CLASSES = ['gold-rank', 'silver-rank', 'bronze-rank'];

function renderLeaderboard(type) {
  const list = document.getElementById('leaderboardList');
  if (!list) return;
  const players = LEADERBOARD_DATA[type] || [];
  list.innerHTML = '';
  players.forEach((player, i) => {
    const item = document.createElement('div');
    item.className = 'leaderboard-item';
    item.innerHTML = `
      <div class="lb-rank ${i < 3 ? RANK_CLASSES[i] : ''}">${i + 1}</div>
      <div class="lb-avatar" style="background:${player.color}22;color:${player.color};border:1.5px solid ${player.color}44;">${player.avatar}</div>
      <div class="lb-info">
        <div class="lb-name">${player.name}</div>
        <div class="lb-country">${player.country}</div>
      </div>
      <div class="lb-rating">${player.rating}</div>
    `;
    list.appendChild(item);
  });
}

function initLeaderboard() {
  const tabs = document.querySelectorAll('.lboard-tab');
  renderLeaderboard('blitz');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderLeaderboard(tab.dataset.type);
    });
  });
}

// ========================
// SCROLL ANIMATIONS
// ========================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const animateTargets = document.querySelectorAll(
    '.game-card, .membership-card, .learn-card, .news-card, .news-card-sm, .comm-feat, .feature-item'
  );

  animateTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
    observer.observe(el);
  });
}

// ========================
// PLAY COMPUTER BUTTON
// ========================
function initPlayComputerBtn() {
  const btn = document.getElementById('playComputerBtn');
  btn?.addEventListener('click', () => {
    window.location.href = 'game.html?mode=computer';
  });
}

// ========================
// TICKER LIVE COUNTER UPDATE
// ========================
function initLiveTicker() {
  // Simulate live player count changes
  const liveGamesEl = document.querySelector('.stat-number[data-target="152847"]');
  if (!liveGamesEl) return;
  let base = 152847;
  setInterval(() => {
    base += Math.floor(Math.random() * 20) - 8;
    if (base < 140000) base = 140000;
    if (base > 170000) base = 170000;
    // Only update if already counted up
    const current = parseInt(liveGamesEl.textContent.replace(/[^0-9]/g, ''));
    if (current > 100000) {
      liveGamesEl.textContent = (base / 1000).toFixed(0) + 'K+';
    }
  }, 3000);
}

// ========================
// SMOOTH SCROLL FOR NAV LINKS
// ========================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

// ========================
// INIT ALL
// ========================
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initAuthModal();
  initCounters();
  initDemoBoard();
  initTicker();
  initLeaderboard();
  initScrollAnimations();
  initPlayComputerBtn();
  initLiveTicker();
  initSmoothScroll();
});
