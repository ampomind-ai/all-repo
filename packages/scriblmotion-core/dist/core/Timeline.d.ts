import type { AnimationTrack } from '../types/index';
export type TimelineState = 'idle' | 'playing' | 'paused';
export declare class Timeline {
    private _currentTime;
    private _duration;
    private _state;
    private _loop;
    private readonly _tracks;
    /** Current playhead position in milliseconds. */
    get currentTime(): number;
    /** Timeline state. */
    get state(): TimelineState;
    /** Total duration in milliseconds. */
    get duration(): number;
    /** Whether timeline loops. */
    get loop(): boolean;
    set loop(value: boolean);
    /** All registered tracks (read-only). */
    get tracks(): ReadonlyMap<string, AnimationTrack>;
    /** Set scene duration with safety clamp. */
    setDuration(ms: number): void;
    /**
     * Advance the timeline by `deltaTime` milliseconds.
     * Returns the set of track IDs that are active at the new time.
     */
    update(deltaTime: number): string[];
    /** Seek to a specific time. Clamps within [0, duration]. */
    seek(time: number): void;
    /** Begin playback. */
    play(): void;
    /** Pause playback. */
    pause(): void;
    /** Stop and reset to 0. */
    stop(): void;
    /** Register an animation track. */
    addTrack(track: AnimationTrack): void;
    /** Remove an animation track by ID. */
    removeTrack(trackId: string): void;
    /** Clear all tracks and reset time. */
    reset(): void;
}
//# sourceMappingURL=Timeline.d.ts.map