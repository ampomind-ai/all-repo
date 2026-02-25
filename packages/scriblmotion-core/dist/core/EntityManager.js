// ─────────────────────────────────────────────────────────────────────────────
// EntityManager — Entity registry, hierarchy, and transform management
// ─────────────────────────────────────────────────────────────────────────────
export class EntityManager {
    constructor() {
        this._entities = new Map();
    }
    /** Read-only access to the entity map. */
    get entities() {
        return this._entities;
    }
    /** Get an entity by ID, or undefined if not found. */
    get(id) {
        return this._entities.get(id);
    }
    /** Check if an entity exists. */
    has(id) {
        return this._entities.has(id);
    }
    /**
     * Create an internal EngineEntity from a DSL definition.
     * Recursively creates child entities and establishes parent-child links.
     */
    createFromDef(def, layerId, zIndex, parentId = null) {
        const entity = {
            id: def.id,
            type: def.type,
            position: def.position ?? { x: 0, y: 0 },
            scale: def.scale ?? { x: 1, y: 1 },
            rotation: def.rotation ?? 0,
            opacity: def.opacity ?? 1,
            anchor: def.anchor ?? { x: 0.5, y: 0.5 },
            parentId,
            childIds: [],
            zIndex,
            layerId,
            styles: def.styles ?? {},
            behaviors: def.behaviors ?? {},
            archetype: def.archetype,
            characterState: def.initialState
                ? { pose: def.initialState.pose ?? 'idle', expression: def.initialState.expression ?? 'neutral' }
                : undefined,
            archetypeState: def.initialState?.state,
            config: def.config,
            // v2.0 — physics & interaction
            physicsBody: def.physics,
            velocity: def.physics ? { x: 0, y: 0 } : undefined,
            acceleration: def.physics ? { x: 0, y: 0 } : undefined,
            draggable: def.draggable ?? false,
            hintSequence: def.hintSequence,
            renderHandle: null,
        };
        this._entities.set(entity.id, entity);
        // Recursively create children
        if (def.children) {
            for (let i = 0; i < def.children.length; i++) {
                const childDef = def.children[i];
                const child = this.createFromDef(childDef, layerId, zIndex + i + 1, entity.id);
                entity.childIds.push(child.id);
            }
        }
        return entity;
    }
    /**
     * Compute the world-space position of an entity,
     * accumulating parent transforms.
     */
    getWorldPosition(entityId) {
        let x = 0;
        let y = 0;
        let currentId = entityId;
        while (currentId !== null) {
            const entity = this._entities.get(currentId);
            if (!entity)
                break;
            x += entity.position.x;
            y += entity.position.y;
            currentId = entity.parentId;
        }
        return { x, y };
    }
    /**
     * Return entities sorted by z-index for rendering order.
     * Optionally filtered by layer ID.
     */
    getSortedByZIndex(layerId) {
        const arr = [];
        for (const entity of this._entities.values()) {
            if (layerId && entity.layerId !== layerId)
                continue;
            arr.push(entity);
        }
        arr.sort((a, b) => a.zIndex - b.zIndex);
        return arr;
    }
    /** Remove an entity and all of its children recursively. */
    remove(entityId) {
        const entity = this._entities.get(entityId);
        if (!entity)
            return;
        // Remove children first
        for (const childId of entity.childIds) {
            this.remove(childId);
        }
        // Unlink from parent
        if (entity.parentId) {
            const parent = this._entities.get(entity.parentId);
            if (parent) {
                parent.childIds = parent.childIds.filter((id) => id !== entityId);
            }
        }
        this._entities.delete(entityId);
    }
    /** Clear all entities. */
    clear() {
        this._entities.clear();
    }
}
//# sourceMappingURL=EntityManager.js.map