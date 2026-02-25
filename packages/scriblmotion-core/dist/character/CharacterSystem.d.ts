import type { ArchetypeDef, EngineEntity, EngineEventMap, ScriblAnimationDef } from '../types/index';
import type { EventBus } from '../core/EventBus';
import type { ArchetypeRegistry } from '../core/ArchetypeRegistry';
import { StateMachine } from '../core/StateMachine';
import { Rig } from './Rig';
import { PoseSystem } from './PoseSystem';
import { ExpressionSystem } from './ExpressionSystem';
/** Runtime per-character instance. */
export interface CharacterInstance {
    entityId: string;
    archetypeId: string;
    rig: Rig;
    poseSystem: PoseSystem;
    expressionSystem: ExpressionSystem;
    /** v2.0 — per-entity state machine */
    stateMachine: StateMachine;
}
export declare class CharacterSystem {
    private readonly _registry;
    private readonly _eventBus;
    private readonly _instances;
    /** Callback for when a state machine fires animations. */
    private _animationCallback;
    constructor(registry: ArchetypeRegistry, eventBus: EventBus<EngineEventMap>);
    /**
     * Set a callback that the AnimationSystem can use to register
     * dynamic animations triggered by state transitions.
     */
    setAnimationCallback(cb: (entityId: string, anims: ScriblAnimationDef[]) => void): void;
    /** Check if an archetype is registered. */
    hasArchetype(id: string): boolean;
    /** Get archetype definition. */
    getArchetype(id: string): ArchetypeDef | undefined;
    /**
     * Instantiate a character from an archetype and bind to an entity.
     * Returns false if the archetype is not registered.
     */
    instantiate(entityId: string, archetypeId: string, initialState?: string): boolean;
    /** Get the character instance bound to an entity. */
    getInstance(entityId: string): CharacterInstance | undefined;
    /** Get all instances. */
    get instances(): Map<string, CharacterInstance>;
    /**
     * Transition an entity's archetype state.
     */
    transitionState(entityId: string, newState: string): boolean;
    /** Get the current archetype state for an entity. */
    getState(entityId: string): string | undefined;
    /** Process a pose change request from the animation system. */
    setPose(entityId: string, poseName: string): boolean;
    /** Process an expression change request from the animation system. */
    setExpression(entityId: string, expressionName: string): boolean;
    private handleLipSync;
    /**
     * Per-frame update. Advances pose blending and expression blending.
     * Syncs entity archetype state with the state machine.
     */
    update(entities: Map<string, EngineEntity>, _currentTime: number): void;
    /** Remove a character instance. */
    removeInstance(entityId: string): void;
    /** Clear all instances (not archetypes). */
    clearInstances(): void;
}
//# sourceMappingURL=CharacterSystem.d.ts.map