import type { AnimationTrack, ScriblAnimationDef, EngineEntity } from '../types/index';
export declare class AnimationSystem {
    /**
     * Build an internal AnimationTrack from a DSL animation definition.
     */
    createTrack(entityId: string, def: ScriblAnimationDef): AnimationTrack;
    /**
     * Validate that an entity does not exceed the maximum concurrent
     * animation count.
     */
    validateEntityLimit(entityId: string, tracks: ReadonlyMap<string, AnimationTrack>): boolean;
    /**
     * Evaluate all active tracks at a given time and return a list of
     * property mutations to apply.
     */
    evaluate(activeTrackIds: string[], tracks: ReadonlyMap<string, AnimationTrack>, currentTime: number): PropertyMutation[];
    /**
     * Apply mutations to entity objects.
     * Handles dot-notation property paths (`position.x`, `styles.fill`).
     */
    applyMutations(mutations: PropertyMutation[], entities: Map<string, EngineEntity>): void;
}
export interface PropertyMutation {
    entityId: string;
    property: string;
    value: unknown;
}
//# sourceMappingURL=AnimationSystem.d.ts.map