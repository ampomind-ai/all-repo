// ─────────────────────────────────────────────────────────────────────────────
// Timeline — Deterministic time-based playhead controller
// Manages animation tracks and dispatches per-frame updates.
// ─────────────────────────────────────────────────────────────────────────────
import { MAX_SCENE_DURATION_MS } from '../utils/Guards';
export class Timeline {
    constructor() {
        this._currentTime = 0;
        this._duration = 0;
        this._state = 'idle';
        this._loop = false;
        this._tracks = new Map();
    }
    /** Current playhead position in milliseconds. */
    get currentTime() {
        return this._currentTime;
    }
    /** Timeline state. */
    get state() {
        return this._state;
    }
    /** Total duration in milliseconds. */
    get duration() {
        return this._duration;
    }
    /** Whether timeline loops. */
    get loop() {
        return this._loop;
    }
    set loop(value) {
        this._loop = value;
    }
    /** All registered tracks (read-only). */
    get tracks() {
        return this._tracks;
    }
    /** Set scene duration with safety clamp. */
    setDuration(ms) {
        this._duration = Math.min(Math.max(0, ms), MAX_SCENE_DURATION_MS);
    }
    /**
     * Advance the timeline by `deltaTime` milliseconds.
     * Returns the set of track IDs that are active at the new time.
     */
    update(deltaTime) {
        if (this._state !== 'playing')
            return [];
        this._currentTime += deltaTime;
        // Handle end-of-timeline
        if (this._currentTime >= this._duration) {
            if (this._loop) {
                this._currentTime = this._currentTime % this._duration;
            }
            else {
                this._currentTime = this._duration;
                this._state = 'paused';
            }
        }
        // Collect active tracks
        const activeIds = [];
        for (const [id, track] of this._tracks) {
            if (!track.isActive)
                continue;
            const effectiveStart = track.delay;
            const effectiveEnd = track.delay + track.totalDuration;
            if (this._currentTime >= effectiveStart && this._currentTime <= effectiveEnd) {
                activeIds.push(id);
            }
        }
        return activeIds;
    }
    /** Seek to a specific time. Clamps within [0, duration]. */
    seek(time) {
        this._currentTime = Math.min(Math.max(0, time), this._duration);
    }
    /** Begin playback. */
    play() {
        this._state = 'playing';
    }
    /** Pause playback. */
    pause() {
        this._state = 'paused';
    }
    /** Stop and reset to 0. */
    stop() {
        this._state = 'idle';
        this._currentTime = 0;
    }
    /** Register an animation track. */
    addTrack(track) {
        this._tracks.set(track.id, track);
    }
    /** Remove an animation track by ID. */
    removeTrack(trackId) {
        this._tracks.delete(trackId);
    }
    /** Clear all tracks and reset time. */
    reset() {
        this._tracks.clear();
        this._currentTime = 0;
        this._state = 'idle';
    }
}
