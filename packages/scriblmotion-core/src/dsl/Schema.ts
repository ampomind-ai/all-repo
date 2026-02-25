// ─────────────────────────────────────────────────────────────────────────────
// Schema — Validation constants and structural schema definitions
// Used by DSLValidator to enforce payload correctness.
// ─────────────────────────────────────────────────────────────────────────────

import type { EasingName, LayerType, EntityType, CoordinateSystem } from '../types/index';

/** All valid easing function names. */
export const VALID_EASING_NAMES: ReadonlySet<string> = new Set<EasingName>([
    'linear',
    'easeInQuad',
    'easeOutQuad',
    'easeInOutQuad',
    'easeInCubic',
    'easeOutCubic',
    'easeInOutCubic',
    'easeInSine',
    'easeOutSine',
    'easeInOutSine',
    'bounce',
    'spring',
]);

/** All valid layer types. */
export const VALID_LAYER_TYPES: ReadonlySet<string> = new Set<LayerType>([
    'svg',
    'canvas',
    'hybrid',
]);

/** All valid entity types. */
export const VALID_ENTITY_TYPES: ReadonlySet<string> = new Set<EntityType>([
    'shape',
    'character',
    'text',
    'image',
    'path',
    'group',
    'graph',
    'ui',
    'button',
    'slider',
    'tooltip',
    'speech_bubble',
    'math_expr',
    'coordinate_plane',
]);

/** All valid coordinate systems. */
export const VALID_COORDINATE_SYSTEMS: ReadonlySet<string> = new Set<CoordinateSystem>([
    'cartesian',
    'screen',
]);

/** Required top-level fields in the scene object. */
export const REQUIRED_SCENE_FIELDS: readonly string[] = [
    'id',
    'width',
    'height',
    'duration',
    'background',
    'coordinateSystem',
    'frameRate',
];

/** Required fields per entity. */
export const REQUIRED_ENTITY_FIELDS: readonly string[] = ['id', 'type'];

/** Required fields per layer. */
export const REQUIRED_LAYER_FIELDS: readonly string[] = ['id', 'type', 'zIndex'];

/** DSL version currently supported. */
export const SUPPORTED_VERSION = '1.0';
