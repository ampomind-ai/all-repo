// ─────────────────────────────────────────────────────────────────────────────
// StateMachine — Per-entity state machine for archetype states
//
// Manages transitions between declared states. Each transition fires
// exit animations on the old state and enter animations on the new state.
// ─────────────────────────────────────────────────────────────────────────────
export class StateMachine {
    constructor(entityId, archetype, onTransition) {
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
    get currentState() {
        return this._currentState;
    }
    /** All declared state IDs. */
    get declaredStates() {
        return [...this._states.keys()];
    }
    /** Whether a state is declared. */
    hasState(stateId) {
        return this._states.has(stateId);
    }
    /** Get the definition for a state. */
    getStateDef(stateId) {
        return this._states.get(stateId);
    }
    /** Get enter animations for the current state. */
    get currentEnterAnimations() {
        return this._states.get(this._currentState)?.enter ?? [];
    }
    /** Get loop animations for the current state. */
    get currentLoopAnimations() {
        return this._states.get(this._currentState)?.loop ?? [];
    }
    // ── Transitions ──────────────────────────────────────────────────────
    /**
     * Transition to a new state.
     * Returns false if the target state is not declared.
     * Returns false if already in the target state.
     */
    transition(to) {
        if (!this._states.has(to))
            return false;
        if (to === this._currentState)
            return false;
        const from = this._currentState;
        const fromDef = this._states.get(from);
        const toDef = this._states.get(to);
        const exitAnims = fromDef?.exit ?? [];
        const enterAnims = toDef.enter ?? [];
        const loopAnims = toDef.loop ?? [];
        this._currentState = to;
        // Notify listener
        if (this._onTransition) {
            this._onTransition(this.entityId, from, to, enterAnims, exitAnims, loopAnims);
        }
        return true;
    }
    /**
     * Force-set the state without firing transitions.
     * Useful for initialization or serialization.
     */
    forceState(stateId) {
        if (!this._states.has(stateId))
            return false;
        this._currentState = stateId;
        return true;
    }
    /**
     * Reset to the initial state (first registered).
     */
    reset(defaultState) {
        if (this._states.has(defaultState)) {
            this._currentState = defaultState;
        }
    }
}
//# sourceMappingURL=StateMachine.js.map