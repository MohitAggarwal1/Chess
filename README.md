# 🌐 Chess.in — Premium Full-Stack Chess Platform

![Status](https://img.shields.io/badge/Status-Completed-success)
![Tech](https://img.shields.io/badge/Tech-React%2FNode%2FMongoDB-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-v4-cyan)
![Realtime](https://img.shields.io/badge/Realtime-Socket.io-green)

� **Project Developer:** Mohit Aggarwal  
🔗 **Premium Theme:** Hand-Crafted Wooden Edition

---

## 📌 Project Overview

**Chess.in** is a high-performance, full-stack chess application built with the **MERN** stack. It features a masterfully crafted **Wooden Theme**, real-time online multiplayer, and a robust AI engine. The platform provides a grandmaster-level experience with precise move validation, cinematic overlays, and responsive design.

### Core Features:
* 🪓 **Premium Wooden Theme:** Custom design tokens with polished walnut and teak textures, wood-grain patterns, and high-contrast "Ivory & Ebony" pieces.
* 🤖 **Advanced AI Engine:** Challenge yourself against 'Easy', 'Medium', or 'Hard' bots powered by a custom Minimax algorithm.
* 🌍 **Real-Time Online Play:** Play with anyone globally using room-based synchronization powered by **Socket.io**.
* 🛡️ **Engine Precision:** Move validation, checkmate detection, and state management handled by the industry-standard `chess.js`.
* ⚡ **React & Vite:** Lightning-fast SPA performance with **Tailwind CSS v4** for a cutting-edge UI.
* ⏳ **Precise Timers:** Real-time synchronized clocks for both players in all modes.

---

## 🪵 Look & Feel

### Hand-Crafted Wooden Board
The board features hand-picked wood textures (Walnut and Teak) with subtle grain overlays, providing a tactile feel to every move.

### High-Contrast Pieces
- **White:** Pure White (`#FFFFFF`) with a subtle teak-colored 1px border.
- **Black:** Deep Obsidian (`#111111`) for maximum clarity.

---

## 🎮 Game Modes

1. **Play vs Computer:** Choose your difficulty level and hone your skills.
2. **Play vs Friend:** Local turn-based play on a shared screen.
3. **Play Online:** Secure, real-time remote play via the **Chess.in** global network.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS v4
- **State Management:** Custom `useChessGame` hook
- **Interactions:** React-DnD (Drag and Drop)
- **Icons:** Lucide React

### Backend
- **Environment:** Node.js & Express
- **Real-time:** Socket.io
- **Database:** MongoDB (Mongoose)
- **Security:** JWT Authentication & Bcrypt hashing

---

## 📂 Project Structure

```
chess-clone/
├── client/
│   ├── src/
│   │   ├── components/    # ChessBoard, Navbar, Footer
│   │   ├── hooks/         # useChessGame (Core Engine)
│   │   ├── pages/         # Home, Game, Login, Register
│   │   ├── utils/         # chessAI.js (Minimax Algorithm)
│   │   └── assets/        # Official Chess.in Logos
├── server/
│   ├── models/            # User & Game schemas
│   ├── routes/            # Auth & Move APIs
│   └── index.js           # Socket.io & Server Logic
```

---

## 🚀 Local Setup Instructions

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/MohitAggarwal1/chess-in.git
cd chess
```

### 2️⃣ Backend Setup
```bash
cd server
npm install
# Create a .env file with MONGODB_URI and JWT_SECRET
npm start
```

### 3️⃣ Frontend Setup
```bash
cd ../client
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 About the Developer

Developed by **Mohit Aggarwal**, focusing on building premium, performant, and player-centric web applications.

---

### ⭐ Star this project if you love the wooden aesthetic!
