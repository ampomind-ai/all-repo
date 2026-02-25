import type { EngineEventMap, ScriblAudioDef } from '../types/index';
import type { EventBus } from '../core/EventBus';
export declare class AudioSystem {
    private _eventBus;
    private _tracks;
    constructor(eventBus: EventBus<EngineEventMap>);
    init(audioDefs?: ScriblAudioDef[]): void;
    update(_dt: number, _timecode: number): void;
    playSound(audioId: string): void;
    pauseAll(): void;
    destroy(): void;
}
//# sourceMappingURL=AudioSystem.d.ts.map