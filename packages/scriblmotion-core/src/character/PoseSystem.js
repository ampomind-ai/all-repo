// ─────────────────────────────────────────────────────────────────────────────
// PoseSystem — Pose blending and transition management
// Blends between full-body pose states over specified durations.
// ─────────────────────────────────────────────────────────────────────────────
import { clamp } from '../utils/MathUtils';
export class PoseSystem {
    constructor() {
        this._poses = new Map();
        this._currentPose = null;
        this._activeBlend = null;
    }
    /** Register a pose definition. */
    registerPose(pose) {
        this._poses.set(pose.name, pose);
    }
    /** Register multiple pose definitions. */
    registerPoses(poses) {
        for (const pose of poses) {
            this.registerPose(pose);
        }
    }
    /** Get the current pose name. */
    get currentPoseName() {
        return this._currentPose?.name ?? null;
    }
    /** Whether a blend is actively in progress. */
    get isBlending() {
        return this._activeBlend !== null;
    }
    /**
     * Transition to a named pose.
     * Returns false if the pose is unknown or if a blend is already active.
     */
    transitionTo(poseName) {
        const target = this._poses.get(poseName);
        if (!target)
            return false;
        if (this._currentPose?.name === poseName)
            return true;
        if (this._activeBlend)
            return false; // Cannot interrupt mid-blend
        const from = this._currentPose ?? target; // If no current, snap to target
        this._activeBlend = {
            from,
            to: target,
            elapsed: 0,
            duration: target.blendDuration,
        };
        return true;
    }
    /**
     * Force-set a pose without blending.
     * Used for engine resets (e.g., timeline seek to 0).
     */
    forceSet(poseName) {
        const pose = this._poses.get(poseName);
        if (!pose)
            return false;
        this._currentPose = pose;
        this._activeBlend = null;
        return true;
    }
    /**
     * Update the blend. Called per frame.
     * Applies interpolated bone rotations to the rig.
     */
    update(deltaTime, rig) {
        if (!this._activeBlend)
            return;
        this._activeBlend.elapsed += deltaTime;
        const t = clamp(this._activeBlend.elapsed / this._activeBlend.duration, 0, 1);
        // Apply easeInOutQuad blend factor
        const easedT = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        // Blend all target bones
        for (const [boneId, targetRotation] of Object.entries(this._activeBlend.to.boneRotations)) {
            rig.blendLocalRotation(boneId, targetRotation, easedT);
        }
        rig.computeWorldTransforms();
        // Complete?
        if (t >= 1) {
            this._currentPose = this._activeBlend.to;
            this._activeBlend = null;
        }
    }
    /** Clear all registered poses and reset state. */
    clear() {
        this._poses.clear();
        this._currentPose = null;
        this._activeBlend = null;
    }
}
