import type { ArchetypeDef, ArchetypeStateDef, ScriblAnimationDef } from '../types/index';
/** Callback signature for state change notifications. */
export type StateChangeCallback = (entityId: string, from: string, to: string, enterAnims: ScriblAnimationDef[], exitAnims: ScriblAnimationDef[], loopAnims: ScriblAnimationDef[]) => void;
export declare class StateMachine {
    readonly entityId: string;
    private _currentState;
    private readonly _states;
    private readonly _onTransition;
    constructor(entityId: string, archetype: ArchetypeDef, onTransition?: StateChangeCallback);
    /** Current state ID. */
    get currentState(): string;
    /** All declared state IDs. */
    get declaredStates(): string[];
    /** Whether a state is declared. */
    hasState(stateId: string): boolean;
    /** Get the definition for a state. */
    getStateDef(stateId: string): ArchetypeStateDef | undefined;
    /** Get enter animations for the current state. */
    get currentEnterAnimations(): ScriblAnimationDef[];
    /** Get loop animations for the current state. */
    get currentLoopAnimations(): ScriblAnimationDef[];
    /**
     * Transition to a new state.
     * Returns false if the target state is not declared.
     * Returns false if already in the target state.
     */
    transition(to: string): boolean;
    /**
     * Force-set the state without firing transitions.
     * Useful for initialization or serialization.
     */
    forceState(stateId: string): boolean;
    /**
     * Reset to the initial state (first registered).
     */
    reset(defaultState: string): void;
}
//# sourceMappingURL=StateMachine.d.ts.map