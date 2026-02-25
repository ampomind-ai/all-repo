// ─────────────────────────────────────────────────────────────────────────────
// ArchetypeRegistry — Global registry for archetype definitions
//
// Manages versioned, validated archetype definitions. Each archetype must
// declare bounded states, a rig, and appearance overrides.
// No arbitrary geometry injection is allowed.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeDef, ArchetypeCategory } from '../types/index';

export class ArchetypeRegistry {
    private readonly _archetypes = new Map<string, ArchetypeDef>();

    // ── Registration ──────────────────────────────────────────────────────

    /**
     * Register an archetype definition.
     * Throws if the definition is invalid.
     */
    register(def: ArchetypeDef): void {
        this.validate(def);
        this._archetypes.set(def.id, def);
    }

    /**
     * Register multiple archetypes at once.
     */
    registerMany(defs: ArchetypeDef[]): void {
        for (const def of defs) {
            this.register(def);
        }
    }

    // ── Lookup ─────────────────────────────────────────────────────────────

    /** Get an archetype by ID, or undefined. */
    get(id: string): ArchetypeDef | undefined {
        return this._archetypes.get(id);
    }

    /** Check if an archetype is registered. */
    has(id: string): boolean {
        return this._archetypes.has(id);
    }

    /** Get all registered archetype IDs. */
    ids(): string[] {
        return [...this._archetypes.keys()];
    }

    /** Filter archetypes by category. */
    listByCategory(category: ArchetypeCategory): ArchetypeDef[] {
        const results: ArchetypeDef[] = [];
        for (const def of this._archetypes.values()) {
            if (def.category === category) results.push(def);
        }
        return results;
    }

    /** Get all registered archetypes. */
    all(): ArchetypeDef[] {
        return [...this._archetypes.values()];
    }

    /** Remove an archetype by ID. Returns true if it was registered. */
    unregister(id: string): boolean {
        return this._archetypes.delete(id);
    }

    /** Clear all registered archetypes. */
    clear(): void {
        this._archetypes.clear();
    }

    /** Total count of registered archetypes. */
    get size(): number {
        return this._archetypes.size;
    }

    // ── Validation ────────────────────────────────────────────────────────

    /**
     * Validate an archetype definition.
     * Ensures:
     *  - Has an id and version
     *  - Has at least one state
     *  - defaultState exists in states
     *  - bounds are valid (min < max)
     *  - Rig nodes have valid parent references
     *  - No duplicate state/node IDs
     */
    private validate(def: ArchetypeDef): void {
        const errors: string[] = [];

        // Required fields
        if (!def.id || typeof def.id !== 'string') {
            errors.push('Archetype must have a string id');
        }
        if (!def.version || typeof def.version !== 'string') {
            errors.push('Archetype must have a version string');
        }
        if (!def.category) {
            errors.push('Archetype must have a category');
        }

        // States
        const stateIds = Object.keys(def.states ?? {});
        if (stateIds.length === 0) {
            errors.push('Archetype must have at least one state');
        }
        if (def.defaultState && !stateIds.includes(def.defaultState)) {
            errors.push(`defaultState "${def.defaultState}" not found in states: [${stateIds.join(', ')}]`);
        }

        // Bounds
        if (def.bounds) {
            if (def.bounds.min.x >= def.bounds.max.x || def.bounds.min.y >= def.bounds.max.y) {
                errors.push('bounds.min must be less than bounds.max');
            }
        } else {
            errors.push('Archetype must have a bounds AABB');
        }

        // Rig integrity
        if (def.rig) {
            const nodeIds = new Set(Object.keys(def.rig));
            for (const [nodeId, node] of Object.entries(def.rig)) {
                if (node.parentId !== null && !nodeIds.has(node.parentId)) {
                    errors.push(`Rig node "${nodeId}" references unknown parent "${node.parentId}"`);
                }
            }
        }

        if (errors.length > 0) {
            throw new Error(
                `Invalid archetype "${def.id}":\n  - ${errors.join('\n  - ')}`,
            );
        }
    }
}
