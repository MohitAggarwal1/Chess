/**
 * Chess.in - Global Site Configuration
 * Centralized settings for easy customization
 */

module.exports = {
    // Brand Settings
    BRAND_NAME: 'Chess.in',
    TAGLINE: "The World's #1 Chess Site",
    SUPPORT_EMAIL: 'support@chess.in',

    // UI Settings
    COLORS: {
        PRIMARY: '#81b64c',
        SECONDARY: '#5a8a2c',
        BG_DARK: '#161512',
    },

    // Game Engine Config
    ENGINE: {
        DEFAULT_LEVEL: 3,
        MAX_LEVEL: 10,
        DEFAULT_TIME: 10, // minutes
    },

    // Feature Toggles
    FEATURES: {
        AUTH_REQUIRED: true,
        PUZZLES_ENABLED: true,
        BETA_ACCES: false,
    },

    // API Configuration
    API: {
        BASE_URL: process.env.NODE_ENV === 'production'
            ? 'https://api.chess.in'
            : 'http://localhost:5000',
        ENDPOINTS: {
            AUTH: '/api/auth',
            GAMES: '/api/games',
            PUZZLES: '/api/puzzles',
        }
    },

    // SEO Defaults
    SEO: {
        DEFAULT_TITLE: 'Chess.in - Play Chess Online',
        DEFAULT_DESC: 'Play chess online for free, solve puzzles and learn from masters.',
    }
};
