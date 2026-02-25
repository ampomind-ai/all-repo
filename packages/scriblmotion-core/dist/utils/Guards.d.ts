import type { ScriblScriptPayload, ScriblEntityDef } from '../types/index';
/** Maximum nesting depth for entity children. */
export declare const MAX_NESTING_DEPTH = 5;
/** Maximum number of animation tracks per scene. */
export declare const MAX_ANIMATIONS_PER_SCENE = 500;
/** Maximum concurrent animations per entity. */
export declare const MAX_ANIMATIONS_PER_ENTITY = 5;
/** Maximum scene duration in milliseconds. */
export declare const MAX_SCENE_DURATION_MS = 120000;
/** Maximum entities per scene. */
export declare const MAX_ENTITIES = 2000;
/** Maximum character entities per scene. */
export declare const MAX_CHARACTERS = 10;
/** Coordinate value clamp range. */
export declare const COORDINATE_CLAMP = 100000;
/** Validate that a string is a well-formed ScriblScript ID. */
export declare function isValidId(id: unknown): id is string;
/** Validate a hex color string (#RRGGBB or #RRGGBBAA). */
export declare function isValidHex(color: unknown): color is string;
/** Recursively measure nesting depth of entity children. */
export declare function measureEntityDepth(entity: ScriblEntityDef, current?: number): number;
/** Count total entities recursively in a payload. */
export declare function countEntities(payload: ScriblScriptPayload): number;
/** Count total animation definitions in a payload. */
export declare function countAnimations(payload: ScriblScriptPayload): number;
/** Guard: check payload size is within safe limits. */
export declare function isPayloadWithinLimits(payload: ScriblScriptPayload): boolean;
//# sourceMappingURL=Guards.d.ts.map