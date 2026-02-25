// ─────────────────────────────────────────────────────────────────────────────
// Interpolation — Value interpolation between keyframes
// Handles numbers, colors (hex), and Vec2.
// ─────────────────────────────────────────────────────────────────────────────

import type { ScriblKeyframe, Vec2 } from '../types/index';
import type { EasingFn } from './Easing';
import { clamp, lerp } from './MathUtils';

/**
 * Find the surrounding keyframe pair for a given time and compute the
 * local interpolation factor `t`.
 * Returns `null` if time is before the first keyframe.
 */
export function findKeyframePair(
    keyframes: ScriblKeyframe[],
    time: number,
): { from: ScriblKeyframe; to: ScriblKeyframe; t: number } | null {
    if (keyframes.length === 0) return null;

    const first = keyframes[0]!;
    if (time <= first.time) return null;

    const last = keyframes[keyframes.length - 1]!;
    if (time >= last.time) {
        return { from: last, to: last, t: 1 };
    }

    for (let i = 0; i < keyframes.length - 1; i++) {
        const a = keyframes[i]!;
        const b = keyframes[i + 1]!;
        if (time >= a.time && time <= b.time) {
            const segmentDuration = b.time - a.time;
            const localT = segmentDuration === 0 ? 1 : (time - a.time) / segmentDuration;
            return { from: a, to: b, t: clamp(localT, 0, 1) };
        }
    }
    return null;
}

/** Interpolate a numeric value between two keyframes with easing. */
export function interpolateNumber(from: number, to: number, t: number, easing: EasingFn): number {
    return lerp(from, to, easing(t));
}

/** Interpolate a Vec2 between two keyframes with easing. */
export function interpolateVec2(from: Vec2, to: Vec2, t: number, easing: EasingFn): Vec2 {
    const et = easing(t);
    return {
        x: lerp(from.x, to.x, et),
        y: lerp(from.y, to.y, et),
    };
}

/**
 * Parse a hex color string to RGB components.
 * Supports `#RRGGBB` and `#RRGGBBAA`.
 */
function hexToRgb(hex: string): [number, number, number] {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16);
    const g = parseInt(clean.substring(2, 4), 16);
    const b = parseInt(clean.substring(4, 6), 16);
    return [r, g, b];
}

function rgbToHex(r: number, g: number, b: number): string {
    const toHex = (n: number) => Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0');
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** Interpolate between two hex color strings. */
export function interpolateColor(from: string, to: string, t: number, easing: EasingFn): string {
    const [fr, fg, fb] = hexToRgb(from);
    const [tr, tg, tb] = hexToRgb(to);
    const et = easing(t);
    return rgbToHex(
        lerp(fr, tr, et),
        lerp(fg, tg, et),
        lerp(fb, tb, et),
    );
}

/**
 * Smart interpolation dispatcher.
 * Determines value type and delegates to the appropriate interpolator.
 */
export function interpolateValue(
    from: unknown,
    to: unknown,
    t: number,
    easing: EasingFn,
): unknown {
    // Number
    if (typeof from === 'number' && typeof to === 'number') {
        return interpolateNumber(from, to, t, easing);
    }
    // Hex color
    if (typeof from === 'string' && typeof to === 'string' && from.startsWith('#') && to.startsWith('#')) {
        return interpolateColor(from, to, t, easing);
    }
    // Vec2 objects
    if (isVec2(from) && isVec2(to)) {
        return interpolateVec2(from, to, t, easing);
    }
    // Discrete: snap at t ≥ 0.5
    return t >= 0.5 ? to : from;
}

function isVec2(v: unknown): v is Vec2 {
    return (
        typeof v === 'object' &&
        v !== null &&
        'x' in v &&
        'y' in v &&
        typeof (v as Vec2).x === 'number' &&
        typeof (v as Vec2).y === 'number'
    );
}
