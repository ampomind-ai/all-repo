// ─────────────────────────────────────────────────────────────────────────────
// Easing — Pure mathematical easing functions
// All take t ∈ [0, 1] and return a curved t ∈ [0, 1].
// ─────────────────────────────────────────────────────────────────────────────
const linear = (t) => t;
const easeInQuad = (t) => t * t;
const easeOutQuad = (t) => t * (2 - t);
const easeInOutQuad = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
const easeInCubic = (t) => t * t * t;
const easeOutCubic = (t) => --t * t * t + 1;
const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
const easeInSine = (t) => 1 - Math.cos((t * Math.PI) / 2);
const easeOutSine = (t) => Math.sin((t * Math.PI) / 2);
const easeInOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;
const bounce = (t) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1)
        return n1 * t * t;
    if (t < 2 / d1)
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1)
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
};
const spring = (t) => {
    const factor = 0.4;
    return (Math.pow(2, -10 * t) * Math.sin(((t - factor / 4) * (2 * Math.PI)) / factor) + 1);
};
/** Registry mapping easing name → pure function. */
const EASING_MAP = {
    linear,
    easeInQuad,
    easeOutQuad,
    easeInOutQuad,
    easeInCubic,
    easeOutCubic,
    easeInOutCubic,
    easeInSine,
    easeOutSine,
    easeInOutSine,
    bounce,
    spring,
};
/**
 * Resolve an EasingName to a pure easing function.
 * Falls back to `linear` for unknown names (engine safety).
 */
export function getEasingFn(name) {
    return EASING_MAP[name] ?? linear;
}
/** Check if a string is a valid easing name. */
export function isValidEasingName(name) {
    return name in EASING_MAP;
}
//# sourceMappingURL=Easing.js.map