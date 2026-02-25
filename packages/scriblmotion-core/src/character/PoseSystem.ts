// ─────────────────────────────────────────────────────────────────────────────
// PoseSystem — Pose blending and transition management
// Blends between full-body pose states over specified durations.
// ─────────────────────────────────────────────────────────────────────────────

import type { PoseDef } from '../types/index';
import type { Rig } from './Rig';
import { clamp } from '../utils/MathUtils';

interface ActiveBlend {
    from: PoseDef;
    to: PoseDef;
    elapsed: number;
    duration: number;
}

export class PoseSystem {
    private readonly _poses: Map<string, PoseDef> = new Map();
    private _currentPose: PoseDef | null = null;
    private _activeBlend: ActiveBlend | null = null;

    /** Register a pose definition. */
    registerPose(pose: PoseDef): void {
        this._poses.set(pose.name, pose);
    }

    /** Register multiple pose definitions. */
    registerPoses(poses: PoseDef[]): void {
        for (const pose of poses) {
            this.registerPose(pose);
        }
    }

    /** Get the current pose name. */
    get currentPoseName(): string | null {
        return this._currentPose?.name ?? null;
    }

    /** Whether a blend is actively in progress. */
    get isBlending(): boolean {
        return this._activeBlend !== null;
    }

    /**
     * Transition to a named pose.
     * Returns false if the pose is unknown or if a blend is already active.
     */
    transitionTo(poseName: string): boolean {
        const target = this._poses.get(poseName);
        if (!target) return false;
        if (this._currentPose?.name === poseName) return true;
        if (this._activeBlend) return false; // Cannot interrupt mid-blend

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
    forceSet(poseName: string): boolean {
        const pose = this._poses.get(poseName);
        if (!pose) return false;
        this._currentPose = pose;
        this._activeBlend = null;
        return true;
    }

    /**
     * Update the blend. Called per frame.
     * Applies interpolated bone rotations to the rig.
     */
    update(deltaTime: number, rig: Rig): void {
        if (!this._activeBlend) return;

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
    clear(): void {
        this._poses.clear();
        this._currentPose = null;
        this._activeBlend = null;
    }
}
