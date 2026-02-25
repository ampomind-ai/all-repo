import type { EngineEventMap, ScriblInteractionDef } from '../types/index';
import type { EventBus } from './EventBus';
import type { EntityManager } from './EntityManager';
export declare class InteractionSystem {
    private readonly _registered;
    private readonly _eventBus;
    private readonly _entityManager;
    /** Global state store for conditions. */
    private readonly _state;
    /** Currently active drag. */
    private _activeDrag;
    /** Entity currently hovered (for pointer_enter/leave). */
    private _hoveredEntityId;
    /** Stores the current hint index for each entity with a hint sequence. */
    private _hintIndexes;
    /** Callback for physics drag state. */
    private _onDragStateChange;
    /** Callback for property mutation. */
    private _onSetProperty;
    constructor(eventBus: EventBus<EngineEventMap>, entityManager: EntityManager);
    /** Callback when drag state changes (for PhysicsSystem). */
    setDragStateCallback(cb: (entityId: string, isDragged: boolean) => void): void;
    /** Callback for set_property actions. */
    setPropertyCallback(cb: (entityId: string, property: string, value: unknown) => void): void;
    /** Read-only access to global state. */
    getState(key: string): unknown;
    /** Whether a drag is currently active. */
    get isDragging(): boolean;
    /** The entity being dragged, or null. */
    get draggedEntityId(): string | null;
    /** Register all interactions from an entity definition. */
    registerEntity(entityId: string, interactions: ScriblInteractionDef[]): void;
    /**
     * Handle pointer down. Starts drag if entity is draggable.
     */
    handlePointerDown(x: number, y: number): void;
    /**
     * Handle pointer move. Updates drag position and fires hover events.
     */
    handlePointerMove(x: number, y: number): void;
    /**
     * Handle pointer up. Ends active drag.
     */
    handlePointerUp(x: number, y: number): void;
    /**
     * Programmatically fire a state_update event.
     */
    updateState(key: string, value: unknown): void;
    /** Clear all registered interactions and state. */
    clear(): void;
    private fireInteractionsForEntity;
    private executeActions;
    private evaluateConditions;
    /**
     * Hit-test all entities, returning the topmost (highest z-index) match.
     */
    private hitTestAll;
    /**
     * AABB hit-test using entity position and style dimensions.
     */
    private hitTest;
}
//# sourceMappingURL=InteractionSystem.d.ts.map