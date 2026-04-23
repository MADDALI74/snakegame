import { Track, Point } from './types';

export const GRID_SIZE = 20;
export const CELL_SIZE = 20; // pixels
export const INITIAL_SPEED = 150; // ms per tick

export const INITIAL_SNAKE: Point[] = [
    { x: 10, y: 10 },
    { x: 10, y: 11 },
    { x: 10, y: 12 },
];

export const INITIAL_DIRECTION: Point = { x: 0, y: -1 }; // Moving UP

// Using reliable public domain/creative commons placeholder audio for the "AI Generated" demo tracks
export const DUMMY_TRACKS: Track[] = [
    {
        id: 'track-1',
        title: 'Neon Grid Protocol',
        artist: 'AI Gen Alpha',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
        duration: '6:12'
    },
    {
        id: 'track-2',
        title: 'Cybernetic Pulse',
        artist: 'AI Gen Beta',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
        duration: '7:05'
    },
    {
        id: 'track-3',
        title: 'Synthwave Horizon',
        artist: 'AI Gen Gamma',
        url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
        duration: '5:44'
    }
];
