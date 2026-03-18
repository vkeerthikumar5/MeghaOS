import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Trophy, User, Monitor } from 'lucide-react';

const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);
    const [winningLine, setWinningLine] = useState([]);

    const calculateWinner = (squares) => {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
            [0, 4, 8], [2, 4, 6]             // diags
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return { winner: squares[a], line: lines[i] };
            }
        }
        return null;
    };

    const handleClick = (i) => {
        if (winner || board[i]) return;
        const newBoard = board.slice();
        newBoard[i] = isXNext ? 'X' : 'O';
        setBoard(newBoard);
        setIsXNext(!isXNext);

        const result = calculateWinner(newBoard);
        if (result) {
            setWinner(result.winner);
            setWinningLine(result.line);
        } else if (!newBoard.includes(null)) {
            setWinner('Draw');
        }
    };

    const resetGame = () => {
        setBoard(Array(9).fill(null));
        setIsXNext(true);
        setWinner(null);
        setWinningLine([]);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-[#0f111a] text-white p-4 font-sans overflow-hidden">
            <div className="mb-6 flex items-center justify-between w-full max-w-[300px]">
                <div className="flex flex-col items-center gap-1">
                    <div className={`p-2 rounded-xl border-2 transition-all ${isXNext && !winner ? 'border-sky-500 bg-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'border-white/10 bg-white/5'}`}>
                        <User className={`w-5 h-5 ${isXNext && !winner ? 'text-sky-400' : 'text-white/40'}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Player X</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <h2 className="text-xl font-black tracking-tighter text-white/80 italic">MEGHTAC</h2>
                </div>

                <div className="flex flex-col items-center gap-1">
                    <div className={`p-2 rounded-xl border-2 transition-all ${!isXNext && !winner ? 'border-purple-500 bg-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.3)]' : 'border-white/10 bg-white/5'}`}>
                        <Monitor className={`w-5 h-5 ${!isXNext && !winner ? 'text-purple-400' : 'text-white/40'}`} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Player O</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 shadow-2xl relative">
                {board.map((square, i) => (
                    <motion.button
                        key={i}
                        whileHover={{ scale: square ? 1 : 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleClick(i)}
                        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-xl flex items-center justify-center text-4xl font-black transition-all duration-300 relative overflow-hidden active:shadow-inner ${winningLine.includes(i) ? 'bg-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.2)]' : 'bg-[#1c1c1e] hover:bg-[#252529] shadow-lg'}`}
                    >
                        <AnimatePresence mode="wait">
                            {square === 'X' && (
                                <motion.span
                                    key="X"
                                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    className="text-sky-400 drop-shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                                >
                                    X
                                </motion.span>
                            )}
                            {square === 'O' && (
                                <motion.span
                                    key="O"
                                    initial={{ scale: 0, rotate: 45, opacity: 0 }}
                                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                                    className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                >
                                    O
                                </motion.span>
                            )}
                        </AnimatePresence>
                        {winningLine.includes(i) && (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: [0, 0.5, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5 }}
                                className="absolute inset-0 bg-emerald-400/10"
                            />
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="mt-8 flex gap-4 items-center">
                <button 
                    onClick={resetGame}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-widest transition-all"
                >
                    <RefreshCcw className="w-4 h-4" /> Reset Game
                </button>
            </div>

            <AnimatePresence>
                {winner && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-none"
                    >
                        <div className="bg-[#1c1c1e] border border-white/10 p-8 rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col items-center text-center max-w-[280px]">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${winner === 'Draw' ? 'bg-gray-500/20 text-gray-400' : winner === 'X' ? 'bg-sky-500/20 text-sky-400 shadow-[0_0_20px_rgba(14,165,233,0.3)]' : 'bg-purple-500/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]'}`}>
                                <Trophy className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-black mb-1 italic">
                                {winner === 'Draw' ? "IT'S A DRAW!" : `PLAYER ${winner} WINS!`}
                            </h3>
                            <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Game Over</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TicTacToe;
