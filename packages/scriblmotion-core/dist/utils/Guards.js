// ─────────────────────────────────────────────────────────────────────────────
// Guards — Runtime safety checks for DSL validation and engine limits
// ─────────────────────────────────────────────────────────────────────────────
/** Regex for valid ScriblScript IDs. */
const ID_REGEX = /^[a-zA-Z0-9_-]+$/;
/** Maximum nesting depth for entity children. */
export const MAX_NESTING_DEPTH = 5;
/** Maximum number of animation tracks per scene. */
export const MAX_ANIMATIONS_PER_SCENE = 500;
/** Maximum concurrent animations per entity. */
export const MAX_ANIMATIONS_PER_ENTITY = 5;
/** Maximum scene duration in milliseconds. */
export const MAX_SCENE_DURATION_MS = 120000;
/** Maximum entities per scene. */
export const MAX_ENTITIES = 2000;
/** Maximum character entities per scene. */
export const MAX_CHARACTERS = 10;
/** Coordinate value clamp range. */
export const COORDINATE_CLAMP = 100000;
/** Validate that a string is a well-formed ScriblScript ID. */
export function isValidId(id) {
    return typeof id === 'string' && id.length > 0 && ID_REGEX.test(id);
}
/** Validate a hex color string (#RRGGBB or #RRGGBBAA). */
export function isValidHex(color) {
    if (typeof color !== 'string')
        return false;
    return /^#([0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(color);
}
/** Recursively measure nesting depth of entity children. */
export function measureEntityDepth(entity, current = 1) {
    if (!entity.children || entity.children.length === 0)
        return current;
    let max = current;
    for (const child of entity.children) {
        const depth = measureEntityDepth(child, current + 1);
        if (depth > max)
            max = depth;
    }
    return max;
}
/** Count total entities recursively in a payload. */
export function countEntities(payload) {
    let count = 0;
    const countEntity = (e) => {
        count++;
        if (e.children)
            e.children.forEach(countEntity);
    };
    for (const layer of payload.layers) {
        layer.entities.forEach(countEntity);
    }
    return count;
}
/** Count total animation definitions in a payload. */
export function countAnimations(payload) {
    let count = 0;
    const countEntity = (e) => {
        if (e.animations)
            count += e.animations.length;
        if (e.children)
            e.children.forEach(countEntity);
    };
    for (const layer of payload.layers) {
        layer.entities.forEach(countEntity);
    }
    return count;
}
/** Guard: check payload size is within safe limits. */
export function isPayloadWithinLimits(payload) {
    return (countEntities(payload) <= MAX_ENTITIES &&
        countAnimations(payload) <= MAX_ANIMATIONS_PER_SCENE &&
        payload.scene.duration <= MAX_SCENE_DURATION_MS);
}
//# sourceMappingURL=Guards.js.map