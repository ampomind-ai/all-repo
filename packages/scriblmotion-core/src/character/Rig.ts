// ─────────────────────────────────────────────────────────────────────────────
// Rig — 2D skeletal bone hierarchy for character animation
// Represents a tree of transform nodes with rotation limits.
// ─────────────────────────────────────────────────────────────────────────────

import type { RigNodeDef, Vec2 } from '../types/index';
import { clamp, angleDelta } from '../utils/MathUtils';

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

export class Rig {
    private readonly _nodes: Map<string, RigNodeRuntime> = new Map();
    private _rootId: string | null = null;

    /** Read-only node map. */
    get nodes(): ReadonlyMap<string, RigNodeRuntime> {
        return this._nodes;
    }

    get rootId(): string | null {
        return this._rootId;
    }

    /**
     * Build the rig from an archetype's rig definition.
     */
    build(rigDef: Record<string, RigNodeDef>): void {
        this._nodes.clear();
        for (const [id, def] of Object.entries(rigDef)) {
            const node: RigNodeRuntime = {
                id,
                parentId: def.parentId,
                localPosition: { ...def.localPosition },
                localRotation: def.localRotation,
                worldPosition: { x: 0, y: 0 },
                worldRotation: 0,
                rotationMin: def.rotationMin,
                rotationMax: def.rotationMax,
                children: [...def.children],
            };
            this._nodes.set(id, node);
            if (def.parentId === null) {
                this._rootId = id;
            }
        }
        this.computeWorldTransforms();
    }

    /**
     * Set a bone's local rotation, clamped to its defined limits.
     */
    setLocalRotation(boneId: string, rotation: number): void {
        const node = this._nodes.get(boneId);
        if (!node) return;
        node.localRotation = clamp(rotation, node.rotationMin, node.rotationMax);
    }

    /**
     * Interpolate a bone's local rotation toward a target.
     * Used for pose blending.
     */
    blendLocalRotation(boneId: string, targetRotation: number, t: number): void {
        const node = this._nodes.get(boneId);
        if (!node) return;
        const delta = angleDelta(node.localRotation, targetRotation);
        const newRotation = node.localRotation + delta * t;
        node.localRotation = clamp(newRotation, node.rotationMin, node.rotationMax);
    }

    /**
     * Recompute world-space transforms by traversing from root.
     * Must be called after modifying local transforms.
     */
    computeWorldTransforms(): void {
        if (this._rootId === null) return;
        this.computeNodeWorld(this._rootId, { x: 0, y: 0 }, 0);
    }

    private computeNodeWorld(nodeId: string, parentWorldPos: Vec2, parentWorldRot: number): void {
        const node = this._nodes.get(nodeId);
        if (!node) return;

        // Compute world rotation
        node.worldRotation = parentWorldRot + node.localRotation;

        // Compute world position (rotate local offset by parent world rotation)
        const cos = Math.cos(parentWorldRot);
        const sin = Math.sin(parentWorldRot);
        node.worldPosition = {
            x: parentWorldPos.x + cos * node.localPosition.x - sin * node.localPosition.y,
            y: parentWorldPos.y + sin * node.localPosition.x + cos * node.localPosition.y,
        };

        // Recurse into children
        for (const childId of node.children) {
            this.computeNodeWorld(childId, node.worldPosition, node.worldRotation);
        }
    }

    /** Reset all bones to zero local rotation. */
    reset(): void {
        for (const node of this._nodes.values()) {
            node.localRotation = 0;
        }
        this.computeWorldTransforms();
    }

    /** Clear all rig data. */
    clear(): void {
        this._nodes.clear();
        this._rootId = null;
    }
}
