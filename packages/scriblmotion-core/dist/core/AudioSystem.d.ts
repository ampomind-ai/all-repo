import type { ScriblAudioDef, EngineEventMap } from '../types/index';
import type { EventBus } from './EventBus';
export declare class AudioSystem {
    private _audioContext;
    private _eventBus;
    private _buffers;
    private _activeNodes;
    private _audioDefs;
    private _isPaused;
    private _lastEmittedWord;
    constructor(eventBus: EventBus<EngineEventMap>);
    /**
     * Initializes the AudioContext. Must be called after a user interaction
     * due to browser autoplay policies.
     */
    init(): void;
    /** Preload audio buffers for a scene. */
    loadAudio(audioDefs: ScriblAudioDef[]): Promise<void>;
    /** Schedule and play all timeline-synced audio for the scene. */
    playScheduled(): void;
    /** Play an audio clip immediately (e.g. from an interaction). */
    play(audioIdOrSrc: string, volume?: number): void;
    /** Sync update called every frame for precise event firing (like lip sync) */
    update(timeMillis: number): void;
    pause(): void;
    resume(): void;
    stopAll(): void;
    clear(): void;
}
//# sourceMappingURL=AudioSystem.d.ts.map