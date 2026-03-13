/* ===================================================
   CHESS.IN CLONE — LEARN.JS
   Course grid, filtering, and interactivity
   =================================================== */

const COURSES = [
    {
        id: 1, category: 'Basics', filter: 'basics', level: 'beginner', emoji: '♟', color: '#243824',
        title: 'Chess Fundamentals',
        desc: 'Learn how every piece moves, the rules of the game, and how to set up the board.',
        lessons: 12, duration: '2h 30m', enrolled: '3.2M', progress: 100, progressLabel: 'Completed',
    },
    {
        id: 2, category: 'Openings', filter: 'openings', level: 'beginner', emoji: '📖', color: '#1a2035',
        title: 'The Italian Game',
        desc: 'Master one of the oldest and most popular openings — develop quickly and control the center.',
        lessons: 18, duration: '3h 45m', enrolled: '1.8M', progress: 40, progressLabel: '40% complete',
    },
    {
        id: 3, category: 'Tactics', filter: 'tactics', level: 'intermediate', emoji: '⚔️', color: '#2a1515',
        title: 'Tactics Master: Forks & Pins',
        desc: 'Double your attacking power with knight forks, bishop pins, and rook skewers.',
        lessons: 24, duration: '5h 00m', enrolled: '2.1M', progress: 0, progressLabel: 'Not started',
    },
    {
        id: 4, category: 'Endgames', filter: 'endgames', level: 'beginner', emoji: '♔', color: '#251f0a',
        title: 'King & Pawn Endgames',
        desc: 'The king is powerful in the endgame! Learn to promote pawns and use opposition.',
        lessons: 16, duration: '3h 20m', enrolled: '980K', progress: 0, progressLabel: 'Not started',
    },
    {
        id: 5, category: 'Openings', filter: 'openings', level: 'intermediate', emoji: '🐉', color: '#1a0a2e',
        title: 'The Sicilian Dragon',
        desc: 'Play the sharpest and most dynamic response to 1.e4. Fight for the initiative from move one.',
        lessons: 22, duration: '4h 30m', enrolled: '1.4M', progress: 0, progressLabel: 'Not started',
    },
    {
        id: 6, category: 'Strategy', filter: 'strategy', level: 'intermediate', emoji: '🗺️', color: '#0a1f1f',
        title: 'Positional Play: Weak Squares',
        desc: 'Understand pawn structure, outposts, and how to exploit long-term positional advantages.',
        lessons: 20, duration: '4h 00m', enrolled: '760K', progress: 0, progressLabel: 'Not started',
    },
    {
        id: 7, category: 'Tactics', filter: 'tactics', level: 'intermediate', emoji: '💣', color: '#2a1515',
        title: 'Combinations & Sacrifices',
        desc: 'Learn to calculate tactical sequences involving piece sacrifices for a decisive advantage.',
        lessons: 28, duration: '6h 00m', enrolled: '1.1M', progress: 0, progressLabel: 'Not started',
    },
    {
        id: 8, category: 'Masterclass', filter: 'masterclass', level: 'advanced', emoji: '👑', color: '#1f1500',
        title: 'Magnus Carlsen: Endgame Secrets',
        desc: 'The World Champion shares his endgame technique, grinding down opponents with precision.',
        lessons: 30, duration: '7h 30m', enrolled: '2.8M', progress: 0, progressLabel: 'Not started',
    },
    {
        id: 9, category: 'Openings', filter: 'openings', level: 'beginner', emoji: '🌱', color: '#1a2a1a',
        title: "Queen's Gambit Explained",
        desc: "Control the center and fight for d5 with one of the most important openings in chess.",
        lessons: 14, duration: '3h 00m', enrolled: '1.6M', progress: 0, progressLabel: 'Not started',
    },
    {
        id: 10, category: 'Strategy', filter: 'strategy', level: 'advanced', emoji: '🔭', color: '#0a1020',
        title: 'Prophylaxis & Restriction',
        desc: "Think like a grandmaster — prevent your opponent's plans before they start.",
        lessons: 18, duration: '4h 00m', enrolled: '420K', progress: 0, progressLabel: 'Not started',
    },
    {
        id: 11, category: 'Endgames', filter: 'endgames', level: 'intermediate', emoji: '⚖️', color: '#1a1505',
        title: 'Rook Endgame Mastery',
        desc: 'Rook endgames are the most common in chess. Learn Lucena, Philidor, and key techniques.',
        lessons: 20, duration: '4h 30m', enrolled: '680K', progress: 0, progressLabel: 'Not started',
    },
    {
        id: 12, category: 'Masterclass', filter: 'masterclass', level: 'advanced', emoji: '⚡', color: '#1a0a20',
        title: 'Hikaru Nakamura: Blitz Domination',
        desc: 'Hikaru reveals his time management, pattern recognition, and blitz philosophy.',
        lessons: 25, duration: '5h 30m', enrolled: '3.4M', progress: 0, progressLabel: 'Not started',
    },
];

let activeFilter = 'all';
let activeLevel = 'all';

function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

function renderCourses() {
    const grid = document.getElementById('coursesGrid');
    const countEl = document.getElementById('coursesCount');
    if (!grid) return;

    const filtered = COURSES.filter(c =>
        (activeFilter === 'all' || c.filter === activeFilter) &&
        (activeLevel === 'all' || c.level === activeLevel)
    );

    if (countEl) countEl.textContent = `Showing ${filtered.length} course${filtered.length !== 1 ? 's' : ''}`;
    grid.innerHTML = '';

    filtered.forEach(course => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div class="course-card-banner" style="background:${course.color};">
                <span class="course-card-emoji">${course.emoji}</span>
                <span class="course-card-badge badge-${course.level}">${capitalize(course.level)}</span>
            </div>
            <div class="course-card-body">
                <div class="course-category">${course.category}</div>
                <div class="course-title">${course.title}</div>
                <div class="course-desc">${course.desc}</div>
                <div class="course-meta">
                    <span>📚 ${course.lessons} lessons</span>
                    <span>⏱ ${course.duration}</span>
                </div>
                ${course.progress > 0 ? `
                    <div class="course-progress-bar"><div class="course-progress-fill" style="width:${course.progress}%"></div></div>
                    <div class="course-progress-label">${course.progressLabel}</div>
                ` : ''}
            </div>
            <div class="course-card-footer">
                <span class="course-enrolled">👥 ${course.enrolled} enrolled</span>
                <span class="course-cta">${course.progress === 100 ? 'Review →' : course.progress > 0 ? 'Continue →' : 'Start →'}</span>
            </div>`;
        card.addEventListener('click', () => {
            card.style.borderColor = 'var(--green-primary)';
            setTimeout(() => { card.style.borderColor = ''; }, 800);
        });
        grid.appendChild(card);
    });
}

function initLearnPage() {
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            activeFilter = tab.dataset.filter;
            renderCourses();
        });
    });

    const levelSelect = document.getElementById('levelSelect');
    levelSelect?.addEventListener('change', () => { activeLevel = levelSelect.value; renderCourses(); });

    renderCourses();
}

document.addEventListener('DOMContentLoaded', initLearnPage);
