import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';

const App: React.FC = () => {
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);

    return (
        <div className="min-h-screen bg-[#050505] text-white font-mono relative overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Grid background */}
                <div className="absolute inset-0 opacity-10" 
                     style={{
                         backgroundImage: 'linear-gradient(#39ff14 1px, transparent 1px), linear-gradient(90deg, #39ff14 1px, transparent 1px)',
                         backgroundSize: '40px 40px',
                         transform: 'perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
                         animation: isMusicPlaying ? 'gridMove 20s linear infinite' : 'none'
                     }}>
                </div>
                
                {/* Ambient glows */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-cyan/20 rounded-full blur-[120px]"></div>
            </div>

            {/* Main Content */}
            <div className="z-10 flex flex-col lg:flex-row items-center justify-center gap-12 w-full max-w-6xl">
                
                {/* Left/Top Side: Game */}
                <div className="flex-1 flex justify-center w-full">
                    <SnakeGame />
                </div>

                {/* Right/Bottom Side: Music Player & Info */}
                <div className="flex flex-col items-center lg:items-start gap-8 w-full lg:w-auto">
                    <div className="text-center lg:text-left">
                        <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink drop-shadow-[0_0_10px_rgba(255,0,255,0.5)] tracking-tighter">
                            SYNTH<br/>SNAKE
                        </h1>
                        <p className="text-gray-400 max-w-xs">
                            Navigate the neon grid. Consume energy. Vibe to the AI-generated synthwave.
                        </p>
                    </div>

                    <MusicPlayer onPlayStateChange={setIsMusicPlaying} />
                </div>

            </div>

            {/* Global Styles for animations */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes gridMove {
                    0% { background-position: 0 0; }
                    100% { background-position: 0 40px; }
                }
            `}} />
        </div>
    );
};

export default App;
