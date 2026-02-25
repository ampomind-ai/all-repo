// ─────────────────────────────────────────────────────────────────────────────
// AudioSystem — v2.1 Lip-sync and Audio Playback
// ─────────────────────────────────────────────────────────────────────────────
export class AudioSystem {
    constructor(eventBus) {
        this._tracks = new Map();
        this._eventBus = eventBus;
    }
    init(audioDefs) {
        this.destroy(); // clear old scene
        if (!audioDefs)
            return;
        for (const def of audioDefs) {
            const el = new Audio(def.src);
            el.preload = 'auto'; // Attempt to load before play
            this._tracks.set(def.id, { def, element: el, lastWordIndex: -1 });
        }
    }
    update(_dt, _timecode) {
        // Sync timestamp events for playing tracks
        for (const [id, track] of this._tracks) {
            const stamps = track.def.timestamps;
            if (!track.element.paused && stamps) {
                const t = track.element.currentTime;
                let currentIndex = -1;
                for (let i = 0; i < stamps.length; i++) {
                    const stamp = stamps[i];
                    if (stamp && stamp.time <= t) {
                        currentIndex = i;
                    }
                    else {
                        break;
                    }
                }
                if (currentIndex >= 0 && currentIndex > track.lastWordIndex) {
                    track.lastWordIndex = currentIndex;
                    const wordStamp = stamps[currentIndex];
                    if (wordStamp) {
                        this._eventBus.emit('audio:word_boundary', {
                            audioId: id,
                            word: wordStamp.word,
                            time: t
                        });
                    }
                }
            }
        }
    }
    playSound(audioId) {
        const track = this._tracks.get(audioId);
        if (track) {
            track.element.currentTime = 0;
            track.lastWordIndex = -1;
            track.element.play().catch(e => console.error('[ScriblAudio]', 'Playback failed:', e));
        }
        else {
            console.warn('[ScriblAudio]', `Track ${audioId} not found.`);
        }
    }
    pauseAll() {
        for (const track of this._tracks.values()) {
            track.element.pause();
        }
    }
    destroy() {
        for (const track of this._tracks.values()) {
            track.element.pause();
            track.element.src = '';
        }
        this._tracks.clear();
    }
}
//# sourceMappingURL=AudioSystem.js.map