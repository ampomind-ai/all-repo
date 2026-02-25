// ─────────────────────────────────────────────────────────────────────────────
// EntityManager — Entity registry, hierarchy, and transform management
// ─────────────────────────────────────────────────────────────────────────────

import type { EngineEntity, ScriblEntityDef, Vec2 } from '../types/index';

export class EntityManager {
    private readonly _entities: Map<string, EngineEntity> = new Map();

    /** Read-only access to the entity map. */
    get entities(): Map<string, EngineEntity> {
        return this._entities;
    }

    /** Get an entity by ID, or undefined if not found. */
    get(id: string): EngineEntity | undefined {
        return this._entities.get(id);
    }

    /** Check if an entity exists. */
    has(id: string): boolean {
        return this._entities.has(id);
    }

    /**
     * Create an internal EngineEntity from a DSL definition.
     * Recursively creates child entities and establishes parent-child links.
     */
    createFromDef(
        def: ScriblEntityDef,
        layerId: string,
        zIndex: number,
        parentId: string | null = null,
    ): EngineEntity {
        const entity: EngineEntity = {
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
                const childDef = def.children[i]!;
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
    getWorldPosition(entityId: string): Vec2 {
        let x = 0;
        let y = 0;
        let currentId: string | null = entityId;

        while (currentId !== null) {
            const entity = this._entities.get(currentId);
            if (!entity) break;
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
    getSortedByZIndex(layerId?: string): EngineEntity[] {
        const arr: EngineEntity[] = [];
        for (const entity of this._entities.values()) {
            if (layerId && entity.layerId !== layerId) continue;
            arr.push(entity);
        }
        arr.sort((a, b) => a.zIndex - b.zIndex);
        return arr;
    }

    /** Remove an entity and all of its children recursively. */
    remove(entityId: string): void {
        const entity = this._entities.get(entityId);
        if (!entity) return;

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
    clear(): void {
        this._entities.clear();
    }
}
