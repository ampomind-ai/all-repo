// ─────────────────────────────────────────────────────────────────────────────
// Rig — 2D skeletal bone hierarchy for character animation
// Represents a tree of transform nodes with rotation limits.
// ─────────────────────────────────────────────────────────────────────────────
import { clamp, angleDelta } from '../utils/MathUtils';
export class Rig {
    constructor() {
        this._nodes = new Map();
        this._rootId = null;
    }
    /** Read-only node map. */
    get nodes() {
        return this._nodes;
    }
    get rootId() {
        return this._rootId;
    }
    /**
     * Build the rig from an archetype's rig definition.
     */
    build(rigDef) {
        this._nodes.clear();
        for (const [id, def] of Object.entries(rigDef)) {
            const node = {
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
    setLocalRotation(boneId, rotation) {
        const node = this._nodes.get(boneId);
        if (!node)
            return;
        node.localRotation = clamp(rotation, node.rotationMin, node.rotationMax);
    }
    /**
     * Interpolate a bone's local rotation toward a target.
     * Used for pose blending.
     */
    blendLocalRotation(boneId, targetRotation, t) {
        const node = this._nodes.get(boneId);
        if (!node)
            return;
        const delta = angleDelta(node.localRotation, targetRotation);
        const newRotation = node.localRotation + delta * t;
        node.localRotation = clamp(newRotation, node.rotationMin, node.rotationMax);
    }
    /**
     * Recompute world-space transforms by traversing from root.
     * Must be called after modifying local transforms.
     */
    computeWorldTransforms() {
        if (this._rootId === null)
            return;
        this.computeNodeWorld(this._rootId, { x: 0, y: 0 }, 0);
    }
    computeNodeWorld(nodeId, parentWorldPos, parentWorldRot) {
        const node = this._nodes.get(nodeId);
        if (!node)
            return;
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
    reset() {
        for (const node of this._nodes.values()) {
            node.localRotation = 0;
        }
        this.computeWorldTransforms();
    }
    /** Clear all rig data. */
    clear() {
        this._nodes.clear();
        this._rootId = null;
    }
}
