export interface Point {
    x: number;
    y: number;
}

export interface Track {
    id: string;
    title: string;
    artist: string;
    url: string;
    duration: string;
}

export interface GameState {
    snake: Point[];
    food: Point;
    score: number;
    gameOver: boolean;
    isPaused: boolean;
}
