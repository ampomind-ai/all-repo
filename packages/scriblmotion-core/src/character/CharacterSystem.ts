// ─────────────────────────────────────────────────────────────────────────────
// CharacterSystem — v2.0 Character lifecycle orchestrator
//
// Uses ArchetypeRegistry for definitions and StateMachine for per-entity
// state management. Wires Rig / Pose / Expression subsystems.
// ─────────────────────────────────────────────────────────────────────────────

import type {
    ArchetypeDef,
    EngineEntity,
    EngineEventMap,
    ScriblAnimationDef,
} from '../types/index';
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

export class CharacterSystem {
    private readonly _registry: ArchetypeRegistry;
    private readonly _eventBus: EventBus<EngineEventMap>;
    private readonly _instances = new Map<string, CharacterInstance>();

    /** Callback for when a state machine fires animations. */
    private _animationCallback:
        | ((entityId: string, anims: ScriblAnimationDef[]) => void)
        | null = null;

    constructor(registry: ArchetypeRegistry, eventBus: EventBus<EngineEventMap>) {
        this._registry = registry;
        this._eventBus = eventBus;

        // Listen to audio word boundaries for basic lip-sync
        this._eventBus.on('audio:word_boundary', ({ word }) => {
            this.handleLipSync(word);
        });
    }

    // ── Animation Callback ────────────────────────────────────────────────

    /**
     * Set a callback that the AnimationSystem can use to register
     * dynamic animations triggered by state transitions.
     */
    setAnimationCallback(cb: (entityId: string, anims: ScriblAnimationDef[]) => void): void {
        this._animationCallback = cb;
    }

    // ── Archetype Access (delegates to registry) ──────────────────────────

    /** Check if an archetype is registered. */
    hasArchetype(id: string): boolean {
        return this._registry.has(id);
    }

    /** Get archetype definition. */
    getArchetype(id: string): ArchetypeDef | undefined {
        return this._registry.get(id);
    }

    // ── Instance Management ───────────────────────────────────────────────

    /**
     * Instantiate a character from an archetype and bind to an entity.
     * Returns false if the archetype is not registered.
     */
    instantiate(entityId: string, archetypeId: string, initialState?: string): boolean {
        const archetype = this._registry.get(archetypeId);
        if (!archetype) return false;

        // Build the rig
        const rig = new Rig();
        rig.build(archetype.rig);

        // Build pose system
        const poseSystem = new PoseSystem();

        // Build expression system
        const expressionSystem = new ExpressionSystem();
        if (archetype.expressions) {
            expressionSystem.registerExpressions(archetype.expressions);
        }

        // Build state machine with transition callback
        const stateMachine = new StateMachine(
            entityId,
            archetype,
            (eId, from, to, enterAnims, _exitAnims, loopAnims) => {
                // Emit event
                this._eventBus.emit('archetype:state_changed', { entityId: eId, from, to });

                // Fire animations
                if (this._animationCallback) {
                    if (enterAnims.length > 0) {
                        this._animationCallback(eId, enterAnims);
                    }
                    if (loopAnims.length > 0) {
                        this._animationCallback(eId, loopAnims);
                    }
                }
            },
        );

        // Set initial state if specified
        if (initialState && stateMachine.hasState(initialState)) {
            stateMachine.forceState(initialState);
        }

        const instance: CharacterInstance = {
            entityId,
            archetypeId,
            rig,
            poseSystem,
            expressionSystem,
            stateMachine,
        };

        this._instances.set(entityId, instance);
        return true;
    }

    /** Get the character instance bound to an entity. */
    getInstance(entityId: string): CharacterInstance | undefined {
        return this._instances.get(entityId);
    }

    /** Get all instances. */
    get instances(): Map<string, CharacterInstance> {
        return this._instances;
    }

    // ── State Transitions ─────────────────────────────────────────────────

    /**
     * Transition an entity's archetype state.
     */
    transitionState(entityId: string, newState: string): boolean {
        const instance = this._instances.get(entityId);
        if (!instance) return false;
        return instance.stateMachine.transition(newState);
    }

    /** Get the current archetype state for an entity. */
    getState(entityId: string): string | undefined {
        return this._instances.get(entityId)?.stateMachine.currentState;
    }

    // ── Pose / Expression ─────────────────────────────────────────────────

    /** Process a pose change request from the animation system. */
    setPose(entityId: string, poseName: string): boolean {
        const instance = this._instances.get(entityId);
        if (!instance) return false;
        return instance.poseSystem.transitionTo(poseName);
    }

    /** Process an expression change request from the animation system. */
    setExpression(entityId: string, expressionName: string): boolean {
        const instance = this._instances.get(entityId);
        if (!instance) return false;
        return instance.expressionSystem.transitionTo(expressionName);
    }

    private handleLipSync(word: string): void {
        const w = word.toLowerCase();
        let expr = 'speaking_neutral';
        if (w.includes('o') || w.includes('u') || w.includes('w')) {
            expr = 'speaking_o';
        } else if (w.includes('a') || w.includes('i') || w.includes('e')) {
            expr = 'speaking_a';
        } else if (w.includes('m') || w.includes('b') || w.includes('p')) {
            expr = 'speaking_closed';
        } else {
            expr = 'speaking_open';
        }

        for (const [entityId, instance] of this._instances) {
            const state = instance.stateMachine.currentState;
            if (state === 'explain' || state === 'speaking' || state === 'talking') {
                this.setExpression(entityId, expr);
            }
        }
    }

    // ── Per-frame Update ──────────────────────────────────────────────────

    /**
     * Per-frame update. Advances pose blending and expression blending.
     * Syncs entity archetype state with the state machine.
     */
    update(entities: Map<string, EngineEntity>, _currentTime: number): void {
        const deltaTime = 16.67; // fixed delta @ 60fps

        for (const [entityId, instance] of this._instances) {
            const entity = entities.get(entityId);
            if (!entity) continue;

            // Sync entity's archetype state
            entity.archetypeState = instance.stateMachine.currentState;

            // Check if the entity's character state has changed
            if (entity.characterState) {
                const desiredPose = entity.characterState.pose;
                if (desiredPose && desiredPose !== instance.poseSystem.currentPoseName) {
                    instance.poseSystem.transitionTo(desiredPose);
                }

                const desiredExpression = entity.characterState.expression;
                if (desiredExpression && desiredExpression !== instance.expressionSystem.currentExpressionName) {
                    instance.expressionSystem.transitionTo(desiredExpression);
                }
            }

            // Update subsystems
            instance.poseSystem.update(deltaTime, instance.rig);

            const expState = instance.expressionSystem.update(deltaTime);
            // Apply expression state to rig visual overrides
            for (const [boneId, pathD] of Object.entries(expState.components)) {
                const archetype = this._registry.get(instance.archetypeId);
                const def = archetype?.rig[boneId];
                if (def && def.visual && def.visual.shape === 'path') {
                    def.visual.d = pathD;
                }
            }
        }
    }

    // ── Cleanup ───────────────────────────────────────────────────────────

    /** Remove a character instance. */
    removeInstance(entityId: string): void {
        const instance = this._instances.get(entityId);
        if (!instance) return;
        instance.rig.clear();
        instance.poseSystem.clear();
        instance.expressionSystem.clear();
        this._instances.delete(entityId);
    }

    /** Clear all instances (not archetypes). */
    clearInstances(): void {
        for (const instance of this._instances.values()) {
            instance.rig.clear();
            instance.poseSystem.clear();
            instance.expressionSystem.clear();
        }
        this._instances.clear();
    }
}
