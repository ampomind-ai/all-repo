// ─────────────────────────────────────────────────────────────────────────────
// MathUtils — Stateless numeric helpers
// Zero allocations. Used across interpolation, rig transforms, and guards.
// ─────────────────────────────────────────────────────────────────────────────

/** Clamp `v` between `min` and `max`. */
export function clamp(v: number, min: number, max: number): number {
    return v < min ? min : v > max ? max : v;
}

/** Linear interpolation between `a` and `b` by factor `t ∈ [0,1]`. */
export function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

/** Inverse lerp: returns the `t` that produces `v` in `[a, b]`. */
export function inverseLerp(a: number, b: number, v: number): number {
    if (a === b) return 0;
    return clamp((v - a) / (b - a), 0, 1);
}

/** Remap a value from one range to another. */
export function remap(
    value: number,
    inMin: number,
    inMax: number,
    outMin: number,
    outMax: number,
): number {
    const t = inverseLerp(inMin, inMax, value);
    return lerp(outMin, outMax, t);
}

/** Convert degrees to radians. */
export function degToRad(deg: number): number {
    return (deg * Math.PI) / 180;
}

/** Convert radians to degrees. */
export function radToDeg(rad: number): number {
    return (rad * 180) / Math.PI;
}

/** Shortest angle difference between two angles (radians). */
export function angleDelta(from: number, to: number): number {
    let delta = ((to - from) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return delta;
}

/** Distance between two 2D points. */
export function distance(ax: number, ay: number, bx: number, by: number): number {
    const dx = bx - ax;
    const dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
}
