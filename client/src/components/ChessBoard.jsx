import React, { useState, useEffect } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const PIECE_UNICODE = {
    w: { p: '♙', r: '♖', n: '♘', b: '♗', q: '♕', k: '♔' },
    b: { p: '♟', r: '♜', n: '♞', b: '♝', q: '♛', k: '♚' }
};

const Piece = ({ type, color, square, isDraggable }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: 'piece',
        item: { type, color, square },
        canDrag: isDraggable,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [type, color, square, isDraggable]);

    return (
        <span
            ref={drag}
            className={`text-[calc(min(10vw,5rem))] md:text-6xl select-none transition-transform cursor-grab active:cursor-grabbing drop-shadow-md z-20
        ${color === 'w' ? 'text-wood-piece-white' : 'text-wood-piece-black'} 
        ${isDragging ? 'opacity-0' : 'opacity-100'}
      `}
            style={{
                color: color === 'w' ? 'var(--color-wood-piece-white)' : 'var(--color-wood-piece-black)',
                WebkitTextStroke: color === 'w' ? '1px rgba(0, 0, 0, 0.15)' : 'none'
            }}
        >
            {PIECE_UNICODE[color][type]}
        </span>
    );
};

const Square = ({ square, i, j, game, onMove, selectedSquare, handleSquareClick, legalMoves }) => {
    const piece = game.get(square);
    const isLight = (i + j) % 2 === 0;
    const isSelected = selectedSquare === square;
    const isLastMove = game.history({ verbose: true }).slice(-1)[0]?.to === square ||
        game.history({ verbose: true }).slice(-1)[0]?.from === square;
    const isLegalMove = legalMoves.includes(square);
    const isCheck = game.inCheck() && piece?.type === 'k' && piece?.color === game.turn();

    const [, drop] = useDrop(() => ({
        accept: 'piece',
        drop: (item) => {
            onMove({ from: item.square, to: square, promotion: 'q' });
            return undefined;
        },
    }), [square, onMove]);

    return (
        <div
            ref={drop}
            onClick={() => handleSquareClick(square)}
            className={`relative aspect-square flex items-center justify-center cursor-pointer transition-all duration-200 select-none wood-pattern
        ${isLight ? 'bg-wood-light' : 'bg-wood-dark'}
        ${isSelected ? 'ring-4 ring-gold-primary ring-inset z-10 scale-[1.02] shadow-2xl bg-gold-primary/10' : ''}
        ${isLastMove ? 'after:content-[""] after:absolute after:inset-0 after:bg-gold-primary/30 after:mix-blend-multiply' : ''}
        ${isCheck ? 'bg-red-500/60 ring-4 ring-red-600 ring-inset animate-pulse' : ''}
      `}
        >
            {/* Coordinate Labels */}
            {j === 0 && (
                <span className={`absolute top-1 left-1.5 text-[10px] font-black ${isLight ? 'text-wood-dark/70' : 'text-wood-light/70'}`}>
                    {8 - i}
                </span>
            )}
            {i === 7 && (
                <span className={`absolute bottom-1 right-1.5 text-[10px] font-black ${isLight ? 'text-wood-dark/70' : 'text-wood-light/70'}`}>
                    {String.fromCharCode(97 + j)}
                </span>
            )}

            {/* Legal Move Indicator */}
            {isLegalMove && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                    <div className={`rounded-full bg-gold-primary/30 ${piece ? 'w-full h-full border-[6px] border-gold-primary/40 rounded-none' : 'w-4 h-4'}`} />
                </div>
            )}

            {/* Piece */}
            {piece && (
                <Piece
                    type={piece.type}
                    color={piece.color}
                    square={square}
                    isDraggable={piece.color === game.turn()}
                />
            )}
        </div>
    );
};

const ChessBoard = ({ game, onMove }) => {
    const [selectedSquare, setSelectedSquare] = useState(null);
    const [legalMoves, setLegalMoves] = useState([]);

    const handleSquareClick = (square) => {
        if (selectedSquare === square) {
            setSelectedSquare(null);
            setLegalMoves([]);
            return;
        }

        if (selectedSquare) {
            const moveResult = onMove({
                from: selectedSquare,
                to: square,
                promotion: 'q'
            });

            if (moveResult) {
                setSelectedSquare(null);
                setLegalMoves([]);
                return;
            }
        }

        const piece = game.get(square);
        if (piece && piece.color === game.turn()) {
            setSelectedSquare(square);
            const moves = game.moves({ square, verbose: true });
            setLegalMoves(moves.map(m => m.to));
        } else {
            setSelectedSquare(null);
            setLegalMoves([]);
        }
    };

    const squares = [];
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const square = String.fromCharCode(97 + j) + (8 - i);
            squares.push(
                <Square
                    key={square}
                    square={square}
                    i={i}
                    j={j}
                    game={game}
                    onMove={onMove}
                    selectedSquare={selectedSquare}
                    handleSquareClick={handleSquareClick}
                    legalMoves={legalMoves}
                />
            );
        }
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="relative group p-1.5 bg-dark-card border border-white/10 rounded-2xl shadow-[0_50px_100px_rgba(0,0,0,0.8)]">
                <div className="absolute -top-1 -left-1 w-8 h-8 border-t-2 border-l-2 border-gold-primary/30 rounded-tl-xl" />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-2 border-r-2 border-gold-primary/30 rounded-br-xl" />

                <div className="grid grid-cols-8 grid-rows-8 w-full aspect-square rounded-xl overflow-hidden shadow-inner touch-none">
                    {squares}
                </div>
            </div>
        </DndProvider>
    );
};

export default ChessBoard;
