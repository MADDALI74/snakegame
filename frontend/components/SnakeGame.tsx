import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GRID_SIZE, CELL_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, INITIAL_SPEED } from '../constants';
import { Point, GameState } from '../types';
import { Trophy, Play as PlayIcon, RotateCcw } from 'lucide-react';

const generateFood = (snake: Point[]): Point => {
    let newFood: Point;
    let isOccupied = true;
    while (isOccupied) {
        newFood = {
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE)
        };
        // eslint-disable-next-line no-loop-func
        isOccupied = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
    }
    return newFood!;
};

export const SnakeGame: React.FC = () => {
    const [gameState, setGameState] = useState<GameState>({
        snake: INITIAL_SNAKE,
        food: { x: 5, y: 5 }, // Initial dummy food, will be replaced on start
        score: 0,
        gameOver: false,
        isPaused: true, // Start paused
    });
    
    const [highScore, setHighScore] = useState(0);
    const [hasStarted, setHasStarted] = useState(false);

    // Refs for mutable state that shouldn't trigger re-renders or are needed in intervals
    const directionRef = useRef<Point>(INITIAL_DIRECTION);
    const currentDirectionRef = useRef<Point>(INITIAL_DIRECTION);
    const gameBoardRef = useRef<HTMLDivElement>(null);

    // Initialize food properly once
    useEffect(() => {
        setGameState(prev => ({ ...prev, food: generateFood(prev.snake) }));
    }, []);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        // Prevent default scrolling for arrow keys and space
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }

        if (e.key === ' ') {
            if (gameState.gameOver) {
                resetGame();
            } else {
                setGameState(prev => {
                    const newPaused = !prev.isPaused;
                    if (!newPaused && !hasStarted) setHasStarted(true);
                    return { ...prev, isPaused: newPaused };
                });
            }
            return;
        }

        if (gameState.isPaused || gameState.gameOver) return;

        const currentDir = currentDirectionRef.current;
        
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
                break;
        }
    }, [gameState.isPaused, gameState.gameOver, hasStarted]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    // Focus board on click to ensure keyboard events work if user clicks away
    const handleBoardClick = () => {
        gameBoardRef.current?.focus();
    };

    const resetGame = () => {
        setGameState({
            snake: INITIAL_SNAKE,
            food: generateFood(INITIAL_SNAKE),
            score: 0,
            gameOver: false,
            isPaused: false,
        });
        directionRef.current = INITIAL_DIRECTION;
        currentDirectionRef.current = INITIAL_DIRECTION;
        setHasStarted(true);
        gameBoardRef.current?.focus();
    };

    useEffect(() => {
        if (gameState.isPaused || gameState.gameOver) return;

        const moveSnake = () => {
            setGameState(prevState => {
                const currentSnake = prevState.snake;
                const head = currentSnake[0];
                
                // Update current direction to the one we are actually moving in this tick
                currentDirectionRef.current = directionRef.current;
                const dir = currentDirectionRef.current;

                const newHead = {
                    x: head.x + dir.x,
                    y: head.y + dir.y
                };

                // 1. Check Wall Collision
                if (
                    newHead.x < 0 || 
                    newHead.x >= GRID_SIZE || 
                    newHead.y < 0 || 
                    newHead.y >= GRID_SIZE
                ) {
                    if (prevState.score > highScore) setHighScore(prevState.score);
                    return { ...prevState, gameOver: true };
                }

                // 2. Check Self Collision
                if (currentSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
                    if (prevState.score > highScore) setHighScore(prevState.score);
                    return { ...prevState, gameOver: true };
                }

                const newSnake = [newHead, ...currentSnake];
                let newScore = prevState.score;
                let newFood = prevState.food;

                // 3. Check Food Collision
                if (newHead.x === prevState.food.x && newHead.y === prevState.food.y) {
                    newScore += 10;
                    newFood = generateFood(newSnake);
                    // Don't pop the tail, so it grows
                } else {
                    newSnake.pop(); // Remove tail if no food eaten
                }

                return {
                    ...prevState,
                    snake: newSnake,
                    score: newScore,
                    food: newFood
                };
            });
        };

        // Speed increases slightly as score goes up
        const currentSpeed = Math.max(50, INITIAL_SPEED - Math.floor(gameState.score / 50) * 10);
        const intervalId = setInterval(moveSnake, currentSpeed);

        return () => clearInterval(intervalId);
    }, [gameState.isPaused, gameState.gameOver, highScore, gameState.score]);


    return (
        <div className="flex flex-col items-center gap-6">
            {/* Score Board */}
            <div className="flex justify-between w-full max-w-[400px] px-4 py-3 bg-gray-900/80 backdrop-blur-sm border border-neon-green/30 rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.1)]">
                <div className="flex flex-col">
                    <span className="text-gray-400 text-xs uppercase tracking-wider">Score</span>
                    <span className="text-neon-green font-bold text-2xl drop-shadow-[0_0_8px_rgba(57,255,20,0.8)]">
                        {gameState.score.toString().padStart(4, '0')}
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-gray-400 text-xs uppercase tracking-wider flex items-center gap-1">
                        <Trophy size={12} /> High Score
                    </span>
                    <span className="text-neon-pink font-bold text-2xl drop-shadow-[0_0_8px_rgba(255,0,255,0.8)]">
                        {highScore.toString().padStart(4, '0')}
                    </span>
                </div>
            </div>

            {/* Game Board Container */}
            <div 
                className="relative p-2 bg-gray-900 rounded-xl border-2 border-gray-800 shadow-[0_0_40px_rgba(0,255,255,0.15)]"
                onClick={handleBoardClick}
            >
                {/* The Grid */}
                <div 
                    ref={gameBoardRef}
                    tabIndex={0}
                    className="relative bg-black outline-none overflow-hidden"
                    style={{ 
                        width: GRID_SIZE * CELL_SIZE, 
                        height: GRID_SIZE * CELL_SIZE,
                        backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(90deg, #1a1a1a 1px, transparent 1px)',
                        backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px`
                    }}
                >
                    {/* Food */}
                    <div 
                        className="absolute bg-neon-pink rounded-full shadow-[0_0_15px_rgba(255,0,255,1)] animate-pulse"
                        style={{
                            width: CELL_SIZE - 2,
                            height: CELL_SIZE - 2,
                            left: gameState.food.x * CELL_SIZE + 1,
                            top: gameState.food.y * CELL_SIZE + 1,
                        }}
                    />

                    {/* Snake */}
                    {gameState.snake.map((segment, index) => {
                        const isHead = index === 0;
                        return (
                            <div 
                                key={`${segment.x}-${segment.y}-${index}`}
                                className={`absolute rounded-sm ${isHead ? 'bg-neon-cyan z-10 shadow-[0_0_15px_rgba(0,255,255,0.8)]' : 'bg-neon-green shadow-[0_0_8px_rgba(57,255,20,0.5)] opacity-90'}`}
                                style={{
                                    width: CELL_SIZE - 2,
                                    height: CELL_SIZE - 2,
                                    left: segment.x * CELL_SIZE + 1,
                                    top: segment.y * CELL_SIZE + 1,
                                }}
                            >
                                {isHead && (
                                    <div className="w-full h-full relative">
                                        {/* Simple eyes for the snake head */}
                                        <div className="absolute w-1 h-1 bg-black rounded-full top-1 left-1"></div>
                                        <div className="absolute w-1 h-1 bg-black rounded-full top-1 right-1"></div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Overlays */}
                    {(!hasStarted || gameState.gameOver || (gameState.isPaused && hasStarted && !gameState.gameOver)) && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center z-20">
                            {gameState.gameOver ? (
                                <>
                                    <h2 className="text-4xl font-bold text-neon-pink mb-2 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">GAME OVER</h2>
                                    <p className="text-gray-300 mb-6">Final Score: {gameState.score}</p>
                                    <button 
                                        onClick={resetGame}
                                        className="flex items-center gap-2 px-6 py-3 bg-transparent border-2 border-neon-cyan text-neon-cyan rounded-full hover:bg-neon-cyan hover:text-black transition-all shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.8)] font-bold tracking-wider"
                                    >
                                        <RotateCcw size={20} /> PLAY AGAIN
                                    </button>
                                </>
                            ) : !hasStarted ? (
                                <>
                                    <h2 className="text-3xl font-bold text-neon-cyan mb-6 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] tracking-widest">NEON SNAKE</h2>
                                    <button 
                                        onClick={() => { setHasStarted(true); setGameState(p => ({...p, isPaused: false})); }}
                                        className="flex items-center gap-2 px-8 py-3 bg-neon-green text-black rounded-full hover:bg-white transition-all shadow-[0_0_20px_rgba(57,255,20,0.6)] hover:shadow-[0_0_30px_rgba(255,255,255,0.8)] font-bold tracking-wider"
                                    >
                                        <PlayIcon size={20} fill="currentColor" /> START
                                    </button>
                                    <p className="text-gray-400 mt-6 text-sm">Use Arrow Keys or WASD to move</p>
                                    <p className="text-gray-500 text-xs mt-1">Press Space to Pause</p>
                                </>
                            ) : (
                                <>
                                    <h2 className="text-3xl font-bold text-white mb-6 tracking-widest">PAUSED</h2>
                                    <button 
                                        onClick={() => setGameState(p => ({...p, isPaused: false}))}
                                        className="flex items-center gap-2 px-8 py-3 bg-transparent border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition-all font-bold tracking-wider"
                                    >
                                        <PlayIcon size={20} fill="currentColor" /> RESUME
                                    </button>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
