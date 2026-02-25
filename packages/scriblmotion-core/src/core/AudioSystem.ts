// ─────────────────────────────────────────────────────────────────────────────
// AudioSystem — Web Audio API wrapper for synchronized playback
// Manages audio buffers, start delays, and emits word boundary events.
// ─────────────────────────────────────────────────────────────────────────────

import type { ScriblAudioDef, EngineEventMap } from '../types/index';
import type { EventBus } from './EventBus';

export class AudioSystem {
    private _audioContext: AudioContext | null = null;
    private _eventBus: EventBus<EngineEventMap>;
    private _buffers: Map<string, AudioBuffer> = new Map();
    private _activeNodes: Map<string, AudioBufferSourceNode> = new Map();

    private _audioDefs: ScriblAudioDef[] = [];
    private _isPaused: boolean = true;
    private _lastEmittedWord: string | null = null;

    constructor(eventBus: EventBus<EngineEventMap>) {
        this._eventBus = eventBus;
    }

    /**
     * Initializes the AudioContext. Must be called after a user interaction
     * due to browser autoplay policies.
     */
    init(): void {
        if (!this._audioContext) {
            this._audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    /** Preload audio buffers for a scene. */
    async loadAudio(audioDefs: ScriblAudioDef[]): Promise<void> {
        this.init();
        if (!this._audioContext) return;

        this._audioDefs = audioDefs;
        this._buffers.clear();

        const loadPromises = audioDefs.map(async (def) => {
            try {
                const response = await fetch(def.src);
                const arrayBuffer = await response.arrayBuffer();
                const audioBuffer = await this._audioContext!.decodeAudioData(arrayBuffer);
                this._buffers.set(def.id, audioBuffer);
            } catch (err) {
                console.error(`Failed to load audio ${def.id} from ${def.src}`, err);
            }
        });

        await Promise.all(loadPromises);
    }

    /** Schedule and play all timeline-synced audio for the scene. */
    playScheduled(): void {
        this.init();
        if (!this._audioContext) return;

        this._isPaused = false;
        const now = this._audioContext.currentTime;

        for (const def of this._audioDefs) {
            const buffer = this._buffers.get(def.id);
            if (!buffer) continue;

            const source = this._audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this._audioContext.destination);

            // AudioContext schedules exact start times (startAt is in ms)
            const delaySec = def.startAt / 1000;
            source.start(now + delaySec);

            this._activeNodes.set(def.id, source);

            source.onended = () => {
                if (this._activeNodes.get(def.id) === source) {
                    this._activeNodes.delete(def.id);
                }
            };
        }
    }

    /** Play an audio clip immediately (e.g. from an interaction). */
    play(audioIdOrSrc: string, volume: number = 1.0): void {
        this.init();
        if (!this._audioContext) return;

        // Try looking up by ID
        let buffer = this._buffers.get(audioIdOrSrc);

        // If not found, in a full implementation we'd fetch it dynamically.
        if (!buffer) {
            console.warn(`Audio buffer not found for: ${audioIdOrSrc}`);
            return;
        }

        const source = this._audioContext.createBufferSource();
        source.buffer = buffer;

        const gainNode = this._audioContext.createGain();
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(this._audioContext.destination);

        source.start(0);
    }

    /** Sync update called every frame for precise event firing (like lip sync) */
    update(timeMillis: number): void {
        if (!this._audioContext || this._isPaused) return;

        for (const def of this._audioDefs) {
            if (!def.timestamps || def.timestamps.length === 0) continue;

            const trackElapsedMs = timeMillis - def.startAt;
            if (trackElapsedMs >= 0) {
                let currentWord: string | null = null;

                // Find the word that corresponds to the current local playback time
                for (let i = 0; i < def.timestamps.length; i++) {
                    const wordTs = def.timestamps[i]!;
                    if (trackElapsedMs >= wordTs.time) {
                        currentWord = wordTs.word;
                    } else {
                        break;
                    }
                }

                if (currentWord && currentWord !== this._lastEmittedWord) {
                    this._lastEmittedWord = currentWord;
                    this._eventBus.emit('audio:word_boundary', {
                        audioId: def.id,
                        word: currentWord,
                        time: trackElapsedMs,
                    });
                }
            }
        }
    }

    pause(): void {
        if (!this._audioContext) return;
        this._isPaused = true;
        this._audioContext.suspend();
    }

    resume(): void {
        if (!this._audioContext) return;
        this._isPaused = false;
        this._audioContext.resume();
    }

    stopAll(): void {
        this._activeNodes.forEach(node => {
            try { node.stop(); } catch (e) { }
        });
        this._activeNodes.clear();
        this._isPaused = true;
        this._lastEmittedWord = null;
    }

    clear(): void {
        this.stopAll();
        // Option to keep buffers cached for performance if scenes switch back/forth
        // this._buffers.clear();
        this._audioDefs = [];
    }
}
