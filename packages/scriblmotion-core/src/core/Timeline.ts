// ─────────────────────────────────────────────────────────────────────────────
// Timeline — Deterministic time-based playhead controller
// Manages animation tracks and dispatches per-frame updates.
// ─────────────────────────────────────────────────────────────────────────────

import type { AnimationTrack } from '../types/index';
import { MAX_SCENE_DURATION_MS } from '../utils/Guards';

export type TimelineState = 'idle' | 'playing' | 'paused';

export class Timeline {
    private _currentTime: number = 0;
    private _duration: number = 0;
    private _state: TimelineState = 'idle';
    private _loop: boolean = false;
    private readonly _tracks: Map<string, AnimationTrack> = new Map();

    /** Current playhead position in milliseconds. */
    get currentTime(): number {
        return this._currentTime;
    }

    /** Timeline state. */
    get state(): TimelineState {
        return this._state;
    }

    /** Total duration in milliseconds. */
    get duration(): number {
        return this._duration;
    }

    /** Whether timeline loops. */
    get loop(): boolean {
        return this._loop;
    }
    set loop(value: boolean) {
        this._loop = value;
    }

    /** All registered tracks (read-only). */
    get tracks(): ReadonlyMap<string, AnimationTrack> {
        return this._tracks;
    }

    /** Set scene duration with safety clamp. */
    setDuration(ms: number): void {
        this._duration = Math.min(Math.max(0, ms), MAX_SCENE_DURATION_MS);
    }

    /**
     * Advance the timeline by `deltaTime` milliseconds.
     * Returns the set of track IDs that are active at the new time.
     */
    update(deltaTime: number): string[] {
        if (this._state !== 'playing') return [];

        this._currentTime += deltaTime;

        // Handle end-of-timeline
        if (this._currentTime >= this._duration) {
            if (this._loop) {
                this._currentTime = this._currentTime % this._duration;
            } else {
                this._currentTime = this._duration;
                this._state = 'paused';
            }
        }

        // Collect active tracks
        const activeIds: string[] = [];
        for (const [id, track] of this._tracks) {
            if (!track.isActive) continue;
            const effectiveStart = track.delay;
            const effectiveEnd = track.delay + track.totalDuration;
            if (this._currentTime >= effectiveStart && this._currentTime <= effectiveEnd) {
                activeIds.push(id);
            }
        }
        return activeIds;
    }

    /** Seek to a specific time. Clamps within [0, duration]. */
    seek(time: number): void {
        this._currentTime = Math.min(Math.max(0, time), this._duration);
    }

    /** Begin playback. */
    play(): void {
        this._state = 'playing';
    }

    /** Pause playback. */
    pause(): void {
        this._state = 'paused';
    }

    /** Stop and reset to 0. */
    stop(): void {
        this._state = 'idle';
        this._currentTime = 0;
    }

    /** Register an animation track. */
    addTrack(track: AnimationTrack): void {
        this._tracks.set(track.id, track);
    }

    /** Remove an animation track by ID. */
    removeTrack(trackId: string): void {
        this._tracks.delete(trackId);
    }

    /** Clear all tracks and reset time. */
    reset(): void {
        this._tracks.clear();
        this._currentTime = 0;
        this._state = 'idle';
    }
}
