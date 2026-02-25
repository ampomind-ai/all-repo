import type { PoseDef } from '../types/index';
import type { Rig } from './Rig';
export declare class PoseSystem {
    private readonly _poses;
    private _currentPose;
    private _activeBlend;
    /** Register a pose definition. */
    registerPose(pose: PoseDef): void;
    /** Register multiple pose definitions. */
    registerPoses(poses: PoseDef[]): void;
    /** Get the current pose name. */
    get currentPoseName(): string | null;
    /** Whether a blend is actively in progress. */
    get isBlending(): boolean;
    /**
     * Transition to a named pose.
     * Returns false if the pose is unknown or if a blend is already active.
     */
    transitionTo(poseName: string): boolean;
    /**
     * Force-set a pose without blending.
     * Used for engine resets (e.g., timeline seek to 0).
     */
    forceSet(poseName: string): boolean;
    /**
     * Update the blend. Called per frame.
     * Applies interpolated bone rotations to the rig.
     */
    update(deltaTime: number, rig: Rig): void;
    /** Clear all registered poses and reset state. */
    clear(): void;
}
//# sourceMappingURL=PoseSystem.d.ts.map