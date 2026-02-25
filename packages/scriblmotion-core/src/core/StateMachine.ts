// ─────────────────────────────────────────────────────────────────────────────
// StateMachine — Per-entity state machine for archetype states
//
// Manages transitions between declared states. Each transition fires
// exit animations on the old state and enter animations on the new state.
// ─────────────────────────────────────────────────────────────────────────────

import type {
    ArchetypeDef,
    ArchetypeStateDef,
    ScriblAnimationDef,
} from '../types/index';

/** Callback signature for state change notifications. */
export type StateChangeCallback = (
    entityId: string,
    from: string,
    to: string,
    enterAnims: ScriblAnimationDef[],
    exitAnims: ScriblAnimationDef[],
    loopAnims: ScriblAnimationDef[],
) => void;

export class StateMachine {
    readonly entityId: string;
    private _currentState: string;
    private readonly _states: Map<string, ArchetypeStateDef>;
    private readonly _onTransition: StateChangeCallback | null;

    constructor(
        entityId: string,
        archetype: ArchetypeDef,
        onTransition?: StateChangeCallback,
    ) {
        this.entityId = entityId;
        this._states = new Map();
        this._onTransition = onTransition ?? null;

        // Register all archetype states
        for (const [id, stateDef] of Object.entries(archetype.states)) {
            this._states.set(id, { ...stateDef, id });
        }

        this._currentState = archetype.defaultState;
    }

    // ── Accessors ─────────────────────────────────────────────────────────

    /** Current state ID. */
    get currentState(): string {
        return this._currentState;
    }

    /** All declared state IDs. */
    get declaredStates(): string[] {
        return [...this._states.keys()];
    }

    /** Whether a state is declared. */
    hasState(stateId: string): boolean {
        return this._states.has(stateId);
    }

    /** Get the definition for a state. */
    getStateDef(stateId: string): ArchetypeStateDef | undefined {
        return this._states.get(stateId);
    }

    /** Get enter animations for the current state. */
    get currentEnterAnimations(): ScriblAnimationDef[] {
        return this._states.get(this._currentState)?.enter ?? [];
    }

    /** Get loop animations for the current state. */
    get currentLoopAnimations(): ScriblAnimationDef[] {
        return this._states.get(this._currentState)?.loop ?? [];
    }

    // ── Transitions ──────────────────────────────────────────────────────

    /**
     * Transition to a new state.
     * Returns false if the target state is not declared.
     * Returns false if already in the target state.
     */
    transition(to: string): boolean {
        if (!this._states.has(to)) return false;
        if (to === this._currentState) return false;

        const from = this._currentState;
        const fromDef = this._states.get(from);
        const toDef = this._states.get(to)!;

        const exitAnims = fromDef?.exit ?? [];
        const enterAnims = toDef.enter ?? [];
        const loopAnims = toDef.loop ?? [];

        this._currentState = to;

        // Notify listener
        if (this._onTransition) {
            this._onTransition(
                this.entityId,
                from,
                to,
                enterAnims,
                exitAnims,
                loopAnims,
            );
        }

        return true;
    }

    /**
     * Force-set the state without firing transitions.
     * Useful for initialization or serialization.
     */
    forceState(stateId: string): boolean {
        if (!this._states.has(stateId)) return false;
        this._currentState = stateId;
        return true;
    }

    /**
     * Reset to the initial state (first registered).
     */
    reset(defaultState: string): void {
        if (this._states.has(defaultState)) {
            this._currentState = defaultState;
        }
    }
}
