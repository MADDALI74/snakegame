import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';
import { DUMMY_TRACKS } from '../constants';

interface MusicPlayerProps {
    onPlayStateChange?: (isPlaying: boolean) => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ onPlayStateChange }) => {
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(0.5);
    const [isMuted, setIsMuted] = useState(false);
    const [progress, setProgress] = useState(0);
    
    const audioRef = useRef<HTMLAudioElement>(null);
    const currentTrack = DUMMY_TRACKS[currentTrackIndex];

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    useEffect(() => {
        if (isPlaying) {
            audioRef.current?.play().catch(e => {
                console.error("Audio playback failed:", e);
                setIsPlaying(false);
            });
        } else {
            audioRef.current?.pause();
        }
        onPlayStateChange?.(isPlaying);
    }, [isPlaying, currentTrackIndex, onPlayStateChange]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleNext = () => {
        setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
        setIsPlaying(true);
    };

    const handlePrev = () => {
        setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
        setIsPlaying(true);
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const duration = audioRef.current.duration;
            if (duration) {
                setProgress((current / duration) * 100);
            }
        }
    };

    const handleTrackEnded = () => {
        handleNext();
    };

    const toggleMute = () => setIsMuted(!isMuted);

    return (
        <div className="bg-gray-900/80 backdrop-blur-md border border-neon-purple/30 rounded-xl p-6 w-full max-w-md shadow-[0_0_30px_rgba(176,38,255,0.15)] flex flex-col gap-4">
            <audio
                ref={audioRef}
                src={currentTrack.url}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleTrackEnded}
            />
            
            {/* Track Info */}
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-800 border border-neon-cyan/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,255,255,0.2)] relative overflow-hidden group">
                    <div className={`absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 ${isPlaying ? 'animate-pulse' : ''}`}></div>
                    <Music className={`text-neon-cyan ${isPlaying ? 'animate-bounce' : ''}`} size={28} />
                </div>
                <div className="flex-1 overflow-hidden">
                    <h3 className="text-neon-cyan font-bold truncate text-lg drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
                        {currentTrack.title}
                    </h3>
                    <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all duration-100 ease-linear shadow-[0_0_10px_rgba(0,255,255,0.8)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                    <button onClick={toggleMute} className="text-gray-400 hover:text-neon-pink transition-colors">
                        {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
                    </button>
                    <input 
                        type="range" 
                        min="0" max="1" step="0.01" 
                        value={isMuted ? 0 : volume}
                        onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            if (isMuted) setIsMuted(false);
                        }}
                        className="w-20 accent-neon-pink cursor-pointer"
                    />
                </div>

                <div className="flex items-center gap-4">
                    <button 
                        onClick={handlePrev}
                        className="text-gray-300 hover:text-neon-cyan transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                    >
                        <SkipBack size={24} />
                    </button>
                    
                    <button 
                        onClick={togglePlay}
                        className="w-12 h-12 rounded-full bg-gray-800 border-2 border-neon-pink flex items-center justify-center text-neon-pink hover:bg-neon-pink hover:text-black transition-all shadow-[0_0_15px_rgba(255,0,255,0.4)] hover:shadow-[0_0_25px_rgba(255,0,255,0.8)]"
                    >
                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>
                    
                    <button 
                        onClick={handleNext}
                        className="text-gray-300 hover:text-neon-cyan transition-colors hover:drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]"
                    >
                        <SkipForward size={24} />
                    </button>
                </div>
            </div>
        </div>
    );
};
