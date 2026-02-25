import type { EngineScene, ScriblScriptPayload, EngineEventMap } from '../types/index';
import type { EventBus } from './EventBus';
import type { EntityManager } from './EntityManager';
import type { AnimationSystem } from './AnimationSystem';
import type { InteractionSystem } from './InteractionSystem';
import type { Timeline } from './Timeline';
export declare class SceneManager {
    private _activeScene;
    private readonly _scenes;
    private readonly _entityManager;
    private readonly _animationSystem;
    private readonly _interactionSystem;
    private readonly _timeline;
    private readonly _eventBus;
    constructor(deps: {
        entityManager: EntityManager;
        animationSystem: AnimationSystem;
        interactionSystem: InteractionSystem;
        timeline: Timeline;
        eventBus: EventBus<EngineEventMap>;
    });
    /** The currently active scene, or null. */
    get activeScene(): EngineScene | null;
    /**
     * Build and register a scene from a validated DSL payload.
     * Does NOT activate it — call `switchScene()` for that.
     */
    addScene(payload: ScriblScriptPayload): EngineScene;
    /**
     * Activate a scene: populate entities, register animations, set timeline.
     */
    switchScene(sceneId: string, payload: ScriblScriptPayload): boolean;
    /** Teardown a scene and free all associated resources. */
    unloadScene(sceneId: string): void;
}
//# sourceMappingURL=SceneManager.d.ts.map