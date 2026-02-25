// ─────────────────────────────────────────────────────────────────────────────
// InteractionSystem — v2.0 Pointer event mapping, drag lifecycle, and dispatch
//
// Handles the full drag lifecycle (drag_start, drag_move, drag_end),
// pointer enter/leave tracking, and routes actions to engine subsystems.
// ─────────────────────────────────────────────────────────────────────────────
export class InteractionSystem {
    constructor(eventBus, entityManager) {
        this._registered = [];
        /** Global state store for conditions. */
        this._state = new Map();
        /** Currently active drag. */
        this._activeDrag = null;
        /** Entity currently hovered (for pointer_enter/leave). */
        this._hoveredEntityId = null;
        /** Stores the current hint index for each entity with a hint sequence. */
        this._hintIndexes = new Map();
        /** Callback for physics drag state. */
        this._onDragStateChange = null;
        /** Callback for property mutation. */
        this._onSetProperty = null;
        this._eventBus = eventBus;
        this._entityManager = entityManager;
    }
    // ── Callbacks ─────────────────────────────────────────────────────────
    /** Callback when drag state changes (for PhysicsSystem). */
    setDragStateCallback(cb) {
        this._onDragStateChange = cb;
    }
    /** Callback for set_property actions. */
    setPropertyCallback(cb) {
        this._onSetProperty = cb;
    }
    // ── State ─────────────────────────────────────────────────────────────
    /** Read-only access to global state. */
    getState(key) {
        return this._state.get(key);
    }
    /** Whether a drag is currently active. */
    get isDragging() {
        return this._activeDrag !== null;
    }
    /** The entity being dragged, or null. */
    get draggedEntityId() {
        return this._activeDrag?.entityId ?? null;
    }
    // ── Registration ──────────────────────────────────────────────────────
    /** Register all interactions from an entity definition. */
    registerEntity(entityId, interactions) {
        for (const def of interactions) {
            this._registered.push({ entityId, def });
        }
    }
    // ── Pointer Events ────────────────────────────────────────────────────
    /**
     * Handle pointer down. Starts drag if entity is draggable.
     */
    handlePointerDown(x, y) {
        const hit = this.hitTestAll(x, y);
        if (!hit)
            return;
        // Click event
        this._eventBus.emit('entity:click', { entityId: hit.id, x, y });
        this.fireInteractionsForEntity(hit.id, 'click');
        // Start drag if draggable
        if (hit.draggable) {
            this._activeDrag = {
                entityId: hit.id,
                startX: x,
                startY: y,
                offsetX: x - hit.position.x,
                offsetY: y - hit.position.y,
                entityStartPos: { ...hit.position },
            };
            this._eventBus.emit('entity:drag_start', { entityId: hit.id, x, y });
            this.fireInteractionsForEntity(hit.id, 'drag_start');
            // Notify physics
            if (this._onDragStateChange) {
                this._onDragStateChange(hit.id, true);
            }
        }
    }
    /**
     * Handle pointer move. Updates drag position and fires hover events.
     */
    handlePointerMove(x, y) {
        // Drag active — update entity position
        if (this._activeDrag) {
            const entity = this._entityManager.get(this._activeDrag.entityId);
            if (entity) {
                entity.position.x = x - this._activeDrag.offsetX;
                entity.position.y = y - this._activeDrag.offsetY;
                const dx = entity.position.x - this._activeDrag.entityStartPos.x;
                const dy = entity.position.y - this._activeDrag.entityStartPos.y;
                this._eventBus.emit('entity:drag_move', {
                    entityId: this._activeDrag.entityId,
                    x, y, dx, dy,
                });
                this.fireInteractionsForEntity(this._activeDrag.entityId, 'drag_move');
            }
            return;
        }
        // Hover tracking
        const hit = this.hitTestAll(x, y);
        const hitId = hit?.id ?? null;
        if (hitId !== this._hoveredEntityId) {
            // Leave old
            if (this._hoveredEntityId) {
                this._eventBus.emit('entity:pointer_leave', { entityId: this._hoveredEntityId });
                this.fireInteractionsForEntity(this._hoveredEntityId, 'pointer_leave');
            }
            // Enter new
            if (hitId) {
                this._eventBus.emit('entity:pointer_enter', { entityId: hitId });
                this.fireInteractionsForEntity(hitId, 'pointer_enter');
            }
            this._hoveredEntityId = hitId;
        }
        // Continuous hover
        if (hitId) {
            this._eventBus.emit('entity:hover', { entityId: hitId, x, y });
            this.fireInteractionsForEntity(hitId, 'hover');
        }
    }
    /**
     * Handle pointer up. Ends active drag.
     */
    handlePointerUp(x, y) {
        if (!this._activeDrag)
            return;
        const entityId = this._activeDrag.entityId;
        this._eventBus.emit('entity:drag_end', { entityId, x, y });
        this.fireInteractionsForEntity(entityId, 'drag_end');
        // Notify physics
        if (this._onDragStateChange) {
            this._onDragStateChange(entityId, false);
        }
        this._activeDrag = null;
    }
    // ── State Updates ─────────────────────────────────────────────────────
    /**
     * Programmatically fire a state_update event.
     */
    updateState(key, value) {
        this._state.set(key, value);
        this._eventBus.emit('state:update', { key, value });
        // Evaluate conditional interactions
        for (const reg of this._registered) {
            if (reg.def.on !== 'state_update')
                continue;
            if (!this.evaluateConditions(reg.def.conditions))
                continue;
            this.executeActions(reg.entityId, reg.def.actions);
        }
    }
    /** Clear all registered interactions and state. */
    clear() {
        this._registered.length = 0;
        this._state.clear();
        this._hintIndexes.clear();
        this._activeDrag = null;
        this._hoveredEntityId = null;
    }
    // ── Private ──────────────────────────────────────────────────────────
    fireInteractionsForEntity(entityId, type) {
        for (const reg of this._registered) {
            if (reg.entityId !== entityId)
                continue;
            if (reg.def.on !== type)
                continue;
            if (!this.evaluateConditions(reg.def.conditions))
                continue;
            this.executeActions(entityId, reg.def.actions);
        }
    }
    executeActions(entityId, actions) {
        for (const action of actions) {
            this._eventBus.emit('interaction:triggered', { entityId, action });
            switch (action.type) {
                case 'state_update': {
                    if (action.payload) {
                        const key = action.payload['key'];
                        const value = action.payload['value'];
                        if (typeof key === 'string') {
                            this._state.set(key, value);
                            this._eventBus.emit('state:update', { key, value });
                        }
                    }
                    break;
                }
                case 'set_property': {
                    if (action.payload && this._onSetProperty) {
                        const target = action.payload['target'] ?? entityId;
                        const property = action.payload['property'];
                        const value = action.payload['value'];
                        if (property) {
                            this._onSetProperty(target, property, value);
                        }
                    }
                    break;
                }
                case 'transition_state': {
                    // Emitted as event — CharacterSystem listens
                    if (action.payload) {
                        const target = action.payload['target'] ?? entityId;
                        const state = action.payload['state'];
                        if (state) {
                            this._eventBus.emit('archetype:state_changed', {
                                entityId: target,
                                from: '',
                                to: state,
                            });
                        }
                    }
                    break;
                }
                case 'apply_force': {
                    // Emitted for PhysicsSystem — handled by Engine wiring
                    break;
                }
                case 'emit_event': {
                    // Custom event — payload forwarded
                    break;
                }
                case 'jump_to_scene': {
                    if (action.payload && action.payload['sceneId']) {
                        const sceneId = action.payload['sceneId'];
                        this._eventBus.emit('scene:switch_requested', { sceneId });
                    }
                    break;
                }
                case 'play_sound': {
                    if (action.payload && action.payload['audioId']) {
                        const audioId = action.payload['audioId'];
                        // Emitting a custom event that Engine will route to AudioSystem
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        this._eventBus.emit('audio:play_requested', { audioId });
                    }
                    break;
                }
                case 'show_hint': {
                    const target = action.payload?.['target'] ?? entityId;
                    const entity = this._entityManager.get(target);
                    if (entity && entity.hintSequence && entity.hintSequence.length > 0) {
                        const currentIndex = this._hintIndexes.get(target) ?? 0;
                        if (currentIndex < entity.hintSequence.length) {
                            const hintText = entity.hintSequence[currentIndex];
                            this._hintIndexes.set(target, currentIndex + 1);
                            this._eventBus.emit('ui:show_hint', {
                                entityId: target,
                                text: hintText
                            });
                        }
                    }
                    break;
                }
                default:
                    // play, pause, seek, switch_scene — handled by Engine
                    break;
            }
        }
    }
    evaluateConditions(conditions) {
        if (!conditions)
            return true;
        for (const [key, expected] of Object.entries(conditions)) {
            if (this._state.get(key) !== expected)
                return false;
        }
        return true;
    }
    /**
     * Hit-test all entities, returning the topmost (highest z-index) match.
     */
    hitTestAll(x, y) {
        let best = null;
        let bestZ = -Infinity;
        for (const entity of this._entityManager.entities.values()) {
            if (this.hitTest(entity, x, y) && entity.zIndex > bestZ) {
                best = entity;
                bestZ = entity.zIndex;
            }
        }
        return best;
    }
    /**
     * AABB hit-test using entity position and style dimensions.
     */
    hitTest(entity, x, y) {
        const pos = this._entityManager.getWorldPosition(entity.id);
        // Use styles for dimensions, with sensible defaults
        const shape = entity.styles['shape'];
        let halfW, halfH;
        if (shape === 'circle') {
            const r = entity.styles['radius'] ?? 25;
            halfW = r;
            halfH = r;
        }
        else {
            halfW = (entity.styles['width'] ?? 50) / 2;
            halfH = (entity.styles['height'] ?? 50) / 2;
        }
        // Apply entity scale
        halfW *= entity.scale.x;
        halfH *= entity.scale.y;
        return (x >= pos.x - halfW &&
            x <= pos.x + halfW &&
            y >= pos.y - halfH &&
            y <= pos.y + halfH);
    }
}
//# sourceMappingURL=InteractionSystem.js.map