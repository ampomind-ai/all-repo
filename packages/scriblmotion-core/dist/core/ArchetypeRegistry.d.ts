import type { ArchetypeDef, ArchetypeCategory } from '../types/index';
export declare class ArchetypeRegistry {
    private readonly _archetypes;
    /**
     * Register an archetype definition.
     * Throws if the definition is invalid.
     */
    register(def: ArchetypeDef): void;
    /**
     * Register multiple archetypes at once.
     */
    registerMany(defs: ArchetypeDef[]): void;
    /** Get an archetype by ID, or undefined. */
    get(id: string): ArchetypeDef | undefined;
    /** Check if an archetype is registered. */
    has(id: string): boolean;
    /** Get all registered archetype IDs. */
    ids(): string[];
    /** Filter archetypes by category. */
    listByCategory(category: ArchetypeCategory): ArchetypeDef[];
    /** Get all registered archetypes. */
    all(): ArchetypeDef[];
    /** Remove an archetype by ID. Returns true if it was registered. */
    unregister(id: string): boolean;
    /** Clear all registered archetypes. */
    clear(): void;
    /** Total count of registered archetypes. */
    get size(): number;
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
    private validate;
}
//# sourceMappingURL=ArchetypeRegistry.d.ts.map