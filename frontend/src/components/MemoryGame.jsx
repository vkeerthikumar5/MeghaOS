import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCcw, Trophy, Timer, Brain } from 'lucide-react';

const icons = ['🚀', '💻', '⚡️', '🌈', '🎨', '🍕', '🎮', '💡'];

const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [solved, setSolved] = useState([]);
    const [moves, setMoves] = useState(0);
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [gameWon, setGameWon] = useState(false);

    useEffect(() => {
        initializeGame();
    }, []);

    useEffect(() => {
        let interval = null;
        if (isActive && !gameWon) {
            interval = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isActive, gameWon]);

    const initializeGame = () => {
        const shuffled = [...icons, ...icons]
            .sort(() => Math.random() - 0.5)
            .map((icon, index) => ({ id: index, icon }));
        setCards(shuffled);
        setFlipped([]);
        setSolved([]);
        setMoves(0);
        setTime(0);
        setIsActive(false);
        setGameWon(false);
    };

    const handleClick = (id) => {
        if (!isActive) setIsActive(true);
        if (flipped.length === 2 || flipped.includes(id) || solved.includes(id)) return;

        const newFlipped = [...flipped, id];
        setFlipped(newFlipped);

        if (newFlipped.length === 2) {
            setMoves(prev => prev + 1);
            const [first, second] = newFlipped;
            if (cards[first].icon === cards[second].icon) {
                setSolved(prev => [...prev, first, second]);
                setFlipped([]);
                if (solved.length + 2 === cards.length) {
                    setGameWon(true);
                    setIsActive(false);
                }
            } else {
                setTimeout(() => setFlipped([]), 800);
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-full bg-[#0f111a] text-white p-6 font-sans overflow-y-auto custom-scrollbar">
            <div className="mb-8 flex items-center justify-between w-full max-w-[340px] bg-[#1c1c1e]/50 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl">
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-sky-400 mb-1">
                        <Timer className="w-4 h-4" />
                        <span className="text-lg font-black font-mono">{time}s</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Time</span>
                </div>
                
                <div className="h-10 w-px bg-white/10" />
                
                <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2 text-purple-400 mb-1">
                        <Brain className="w-4 h-4" />
                        <span className="text-lg font-black font-mono">{moves}</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Moves</span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {cards.map((card) => {
                    const isFlipped = flipped.includes(card.id) || solved.includes(card.id);
                    const isSolved = solved.includes(card.id);
                    
                    return (
                        <div 
                            key={card.id} 
                            className="perspective-1000 w-16 h-16 sm:w-20 sm:h-20 cursor-pointer"
                            onClick={() => handleClick(card.id)}
                        >
                            <motion.div
                                animate={{ rotateY: isFlipped ? 180 : 0 }}
                                transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                                className="relative w-full h-full transform-style-3d duration-500"
                            >
                                {/* Front of Card */}
                                <div className="absolute inset-0 bg-[#1c1c1e] backface-hidden rounded-xl border border-white/10 shadow-lg flex items-center justify-center hover:bg-[#252529] transition-colors overflow-hidden">
                                     <div className="w-full h-full bg-gradient-to-br from-transparent via-white/5 to-transparent absolute inset-0 pointer-events-none" />
                                     <div className="w-4 h-4 border-2 border-white/5 rounded-full absolute top-2 right-2" />
                                     <div className="w-2 h-2 bg-white/5 rounded-full absolute bottom-3 left-3" />
                                </div>
                                
                                {/* Back of Card */}
                                <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl rotateY-180 backface-hidden rounded-xl border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center text-3xl sm:text-4xl">
                                    <span className={isSolved ? 'grayscale-0 opacity-100' : 'grayscale opacity-90'}>
                                        {card.icon}
                                    </span>
                                    {isSolved && (
                                        <motion.div 
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="absolute inset-0 bg-emerald-500/10 border-2 border-emerald-500/30 rounded-xl"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            <button 
                onClick={initializeGame}
                className="mt-10 flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 hover:scale-105 active:scale-95 border border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] transition-all"
            >
                <RefreshCcw className="w-4 h-4" /> Restart
            </button>

            <AnimatePresence>
                {gameWon && (
                    <motion.div
                        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                        animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 pointer-events-none"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            className="bg-[#1c1c1e] border border-white/10 p-10 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.5)] flex flex-col items-center text-center max-w-[320px] relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 to-transparent pointer-events-none" />
                            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.3)] relative z-10">
                                <Trophy className="w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-black mb-2 italic relative z-10">BRILLIANT!</h3>
                            <div className="space-y-1 relative z-10">
                                <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Solved in {moves} moves</p>
                                <p className="text-xs text-white/40 uppercase tracking-[0.2em] font-bold">Time: {time} seconds</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style dangerouslySetInnerHTML={{ __html: `
                .perspective-1000 { perspective: 1000px; }
                .transform-style-3d { transform-style: preserve-3d; }
                .backface-hidden { backface-visibility: hidden; }
                .rotateY-180 { transform: rotateY(180deg); }
            `}} />
        </div>
    );
};

export default MemoryGame;
