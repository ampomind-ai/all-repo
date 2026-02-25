// ─────────────────────────────────────────────────────────────────────────────
// MathUtils — Stateless numeric helpers
// Zero allocations. Used across interpolation, rig transforms, and guards.
// ─────────────────────────────────────────────────────────────────────────────
/** Clamp `v` between `min` and `max`. */
export function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
}
/** Linear interpolation between `a` and `b` by factor `t ∈ [0,1]`. */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}
/** Inverse lerp: returns the `t` that produces `v` in `[a, b]`. */
export function inverseLerp(a, b, v) {
    if (a === b)
        return 0;
    return clamp((v - a) / (b - a), 0, 1);
}
/** Remap a value from one range to another. */
export function remap(value, inMin, inMax, outMin, outMax) {
    const t = inverseLerp(inMin, inMax, value);
    return lerp(outMin, outMax, t);
}
/** Convert degrees to radians. */
export function degToRad(deg) {
    return (deg * Math.PI) / 180;
}
/** Convert radians to degrees. */
export function radToDeg(rad) {
    return (rad * 180) / Math.PI;
}
/** Shortest angle difference between two angles (radians). */
export function angleDelta(from, to) {
    let delta = ((to - from) % (2 * Math.PI) + 3 * Math.PI) % (2 * Math.PI) - Math.PI;
    return delta;
}
/** Distance between two 2D points. */
export function distance(ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    return Math.sqrt(dx * dx + dy * dy);
}
