import type { RigNodeDef, Vec2 } from '../types/index';
/** Runtime rig node with computed world transforms. */
export interface RigNodeRuntime {
    id: string;
    parentId: string | null;
    localPosition: Vec2;
    localRotation: number;
    worldPosition: Vec2;
    worldRotation: number;
    rotationMin: number;
    rotationMax: number;
    children: string[];
}
export declare class Rig {
    private readonly _nodes;
    private _rootId;
    /** Read-only node map. */
    get nodes(): ReadonlyMap<string, RigNodeRuntime>;
    get rootId(): string | null;
    /**
     * Build the rig from an archetype's rig definition.
     */
    build(rigDef: Record<string, RigNodeDef>): void;
    /**
     * Set a bone's local rotation, clamped to its defined limits.
     */
    setLocalRotation(boneId: string, rotation: number): void;
    /**
     * Interpolate a bone's local rotation toward a target.
     * Used for pose blending.
     */
    blendLocalRotation(boneId: string, targetRotation: number, t: number): void;
    /**
     * Recompute world-space transforms by traversing from root.
     * Must be called after modifying local transforms.
     */
    computeWorldTransforms(): void;
    private computeNodeWorld;
    /** Reset all bones to zero local rotation. */
    reset(): void;
    /** Clear all rig data. */
    clear(): void;
}
//# sourceMappingURL=Rig.d.ts.map