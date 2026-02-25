import type { EngineEntity, ScriblEntityDef, Vec2 } from '../types/index';
export declare class EntityManager {
    private readonly _entities;
    /** Read-only access to the entity map. */
    get entities(): Map<string, EngineEntity>;
    /** Get an entity by ID, or undefined if not found. */
    get(id: string): EngineEntity | undefined;
    /** Check if an entity exists. */
    has(id: string): boolean;
    /**
     * Create an internal EngineEntity from a DSL definition.
     * Recursively creates child entities and establishes parent-child links.
     */
    createFromDef(def: ScriblEntityDef, layerId: string, zIndex: number, parentId?: string | null): EngineEntity;
    /**
     * Compute the world-space position of an entity,
     * accumulating parent transforms.
     */
    getWorldPosition(entityId: string): Vec2;
    /**
     * Return entities sorted by z-index for rendering order.
     * Optionally filtered by layer ID.
     */
    getSortedByZIndex(layerId?: string): EngineEntity[];
    /** Remove an entity and all of its children recursively. */
    remove(entityId: string): void;
    /** Clear all entities. */
    clear(): void;
}
//# sourceMappingURL=EntityManager.d.ts.map