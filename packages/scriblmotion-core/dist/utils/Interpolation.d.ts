import type { ScriblKeyframe, Vec2 } from '../types/index';
import type { EasingFn } from './Easing';
/**
 * Find the surrounding keyframe pair for a given time and compute the
 * local interpolation factor `t`.
 * Returns `null` if time is before the first keyframe.
 */
export declare function findKeyframePair(keyframes: ScriblKeyframe[], time: number): {
    from: ScriblKeyframe;
    to: ScriblKeyframe;
    t: number;
} | null;
/** Interpolate a numeric value between two keyframes with easing. */
export declare function interpolateNumber(from: number, to: number, t: number, easing: EasingFn): number;
/** Interpolate a Vec2 between two keyframes with easing. */
export declare function interpolateVec2(from: Vec2, to: Vec2, t: number, easing: EasingFn): Vec2;
/** Interpolate between two hex color strings. */
export declare function interpolateColor(from: string, to: string, t: number, easing: EasingFn): string;
/**
 * Smart interpolation dispatcher.
 * Determines value type and delegates to the appropriate interpolator.
 */
export declare function interpolateValue(from: unknown, to: unknown, t: number, easing: EasingFn): unknown;
//# sourceMappingURL=Interpolation.d.ts.map