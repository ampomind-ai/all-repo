import type { EngineEntity, EngineEventMap, Vec2 } from '../types/index';
import type { EventBus } from './EventBus';
import type { EntityManager } from './EntityManager';
export declare class PhysicsSystem {
    private readonly _bodies;
    private readonly _entityManager;
    private readonly _eventBus;
    /** World gravity (pixels/s²). Default: downward 980 px/s². */
    gravity: Vec2;
    /** Scene bounds for containment. */
    bounds: {
        width: number;
        height: number;
    };
    constructor(entityManager: EntityManager, eventBus: EventBus<EngineEventMap>);
    /**
     * Register a physics body for an entity.
     * Called by SceneManager when entities with `physics` defs are created.
     */
    registerBody(entity: EngineEntity): void;
    /** Remove a physics body. */
    removeBody(entityId: string): void;
    /** Set drag state for a body (kinematic override). */
    setDragged(entityId: string, isDragged: boolean): void;
    /** Apply a force to an entity (in pixels/s²). */
    applyForce(entityId: string, force: Vec2): void;
    /** Apply an impulse (instant velocity change). */
    applyImpulse(entityId: string, impulse: Vec2): void;
    /**
     * Advance the physics simulation by `dt` seconds.
     * Called once per frame from the Engine loop.
     */
    step(dt: number): void;
    private integrate;
    private solveConstraints;
    private solvePin;
    private solveDistance;
    private solveSpring;
    private detectCollisions;
    private aabbOverlap;
    private resolveCollision;
    private enforceBounds;
    private clearAccelerations;
    /** Clear all bodies. */
    clear(): void;
    /** Check if an entity has a physics body. */
    hasBody(entityId: string): boolean;
    /** Number of active physics bodies. */
    get size(): number;
}
//# sourceMappingURL=PhysicsSystem.d.ts.map