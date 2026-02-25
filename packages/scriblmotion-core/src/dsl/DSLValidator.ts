// ─────────────────────────────────────────────────────────────────────────────
// DSLValidator — Structural validation of ScriblScript payloads
// Returns structured error arrays. Never throws.
// ─────────────────────────────────────────────────────────────────────────────

import type {
    ScriblScriptPayload,
    ScriblEntityDef,
    ScriblAnimationDef,
    ValidationResult,
    ValidationError,
} from '../types/index';
import {
    SUPPORTED_VERSION,
    VALID_LAYER_TYPES,
    VALID_ENTITY_TYPES,
    VALID_EASING_NAMES,
    VALID_COORDINATE_SYSTEMS,
} from './Schema';
import {
    isValidId,
    isValidHex,
    MAX_NESTING_DEPTH,
    MAX_SCENE_DURATION_MS,
    MAX_ENTITIES,
    MAX_ANIMATIONS_PER_SCENE,
    MAX_CHARACTERS,
} from '../utils/Guards';

export class DSLValidator {
    /**
     * Validate a parsed ScriblScript payload against the complete schema.
     */
    validate(payload: ScriblScriptPayload): ValidationResult {
        const errors: ValidationError[] = [];
        const entityIds = new Set<string>();
        let totalEntities = 0;
        let totalAnimations = 0;
        let totalCharacters = 0;

        // ── Root validation ──────────────────────────────────────────────────
        if (payload.version !== SUPPORTED_VERSION) {
            errors.push({ path: 'version', message: `Unsupported version "${payload.version}". Expected "${SUPPORTED_VERSION}".`, severity: 'error' });
        }

        // ── Scene validation ─────────────────────────────────────────────────
        const scene = payload.scene;
        if (!scene) {
            errors.push({ path: 'scene', message: 'Missing required "scene" object.', severity: 'error' });
            return { valid: false, errors };
        }

        if (!isValidId(scene.id)) {
            errors.push({ path: 'scene.id', message: 'Invalid or missing scene ID.', severity: 'error' });
        }
        if (typeof scene.width !== 'number' || scene.width <= 0) {
            errors.push({ path: 'scene.width', message: 'Width must be a positive number.', severity: 'error' });
        }
        if (typeof scene.height !== 'number' || scene.height <= 0) {
            errors.push({ path: 'scene.height', message: 'Height must be a positive number.', severity: 'error' });
        }
        if (typeof scene.duration !== 'number' || scene.duration <= 0) {
            errors.push({ path: 'scene.duration', message: 'Duration must be a positive number.', severity: 'error' });
        }
        if (scene.duration > MAX_SCENE_DURATION_MS) {
            errors.push({ path: 'scene.duration', message: `Duration exceeds maximum of ${MAX_SCENE_DURATION_MS}ms.`, severity: 'error' });
        }
        if (!isValidHex(scene.background)) {
            errors.push({ path: 'scene.background', message: 'Background must be a valid hex color.', severity: 'warning' });
        }
        if (!VALID_COORDINATE_SYSTEMS.has(scene.coordinateSystem)) {
            errors.push({ path: 'scene.coordinateSystem', message: `Invalid coordinate system. Expected one of: ${[...VALID_COORDINATE_SYSTEMS].join(', ')}.`, severity: 'error' });
        }
        if (typeof scene.frameRate !== 'number' || scene.frameRate <= 0 || scene.frameRate > 120) {
            errors.push({ path: 'scene.frameRate', message: 'Frame rate must be between 1 and 120.', severity: 'error' });
        }

        // ── Layers validation ────────────────────────────────────────────────
        if (!Array.isArray(payload.layers) || payload.layers.length === 0) {
            errors.push({ path: 'layers', message: 'At least one layer is required.', severity: 'error' });
            return { valid: false, errors };
        }

        const layerIds = new Set<string>();
        for (let li = 0; li < payload.layers.length; li++) {
            const layer = payload.layers[li]!;
            const lPath = `layers[${li}]`;

            if (!isValidId(layer.id)) {
                errors.push({ path: `${lPath}.id`, message: 'Invalid or missing layer ID.', severity: 'error' });
            } else if (layerIds.has(layer.id)) {
                errors.push({ path: `${lPath}.id`, message: `Duplicate layer ID "${layer.id}".`, severity: 'error' });
            } else {
                layerIds.add(layer.id);
            }

            if (!VALID_LAYER_TYPES.has(layer.type)) {
                errors.push({ path: `${lPath}.type`, message: `Invalid layer type "${layer.type}".`, severity: 'error' });
            }

            // Validate entities
            this.validateEntities(layer.entities, lPath, errors, entityIds, {
                incrementEntity: () => { totalEntities++; },
                incrementAnimation: () => { totalAnimations++; },
                incrementCharacter: () => { totalCharacters++; },
            });
        }

        // ── Global limit checks ──────────────────────────────────────────────
        if (totalEntities > MAX_ENTITIES) {
            errors.push({ path: 'global', message: `Total entity count (${totalEntities}) exceeds max of ${MAX_ENTITIES}.`, severity: 'error' });
        }
        if (totalAnimations > MAX_ANIMATIONS_PER_SCENE) {
            errors.push({ path: 'global', message: `Total animation count (${totalAnimations}) exceeds max of ${MAX_ANIMATIONS_PER_SCENE}.`, severity: 'error' });
        }
        if (totalCharacters > MAX_CHARACTERS) {
            errors.push({ path: 'global', message: `Total character count (${totalCharacters}) exceeds max of ${MAX_CHARACTERS}.`, severity: 'error' });
        }

        return { valid: errors.filter((e) => e.severity === 'error').length === 0, errors };
    }

    // ── Private ────────────────────────────────────────────────────────────────

    private validateEntities(
        entities: ScriblEntityDef[],
        parentPath: string,
        errors: ValidationError[],
        entityIds: Set<string>,
        counters: { incrementEntity: () => void; incrementAnimation: () => void; incrementCharacter: () => void },
        depth: number = 1,
    ): void {
        for (let i = 0; i < entities.length; i++) {
            const entity = entities[i]!;
            const ePath = `${parentPath}.entities[${i}]`;
            counters.incrementEntity();

            if (!isValidId(entity.id)) {
                errors.push({ path: `${ePath}.id`, message: 'Invalid or missing entity ID.', severity: 'error' });
            } else if (entityIds.has(entity.id)) {
                errors.push({ path: `${ePath}.id`, message: `Duplicate entity ID "${entity.id}".`, severity: 'error' });
            } else {
                entityIds.add(entity.id);
            }

            if (!VALID_ENTITY_TYPES.has(entity.type)) {
                errors.push({ path: `${ePath}.type`, message: `Invalid entity type "${entity.type}".`, severity: 'error' });
            }

            if (entity.type === 'character') {
                counters.incrementCharacter();
            }

            // Validate animations
            if (entity.animations) {
                for (let ai = 0; ai < entity.animations.length; ai++) {
                    const anim = entity.animations[ai]!;
                    counters.incrementAnimation();
                    this.validateAnimation(anim, `${ePath}.animations[${ai}]`, errors);
                }
            }

            // Validate nesting depth
            if (entity.children && entity.children.length > 0) {
                if (depth >= MAX_NESTING_DEPTH) {
                    errors.push({ path: `${ePath}.children`, message: `Nesting depth exceeds max of ${MAX_NESTING_DEPTH}.`, severity: 'error' });
                } else {
                    this.validateEntities(entity.children, ePath, errors, entityIds, counters, depth + 1);
                }
            }
        }
    }

    private validateAnimation(anim: ScriblAnimationDef, path: string, errors: ValidationError[]): void {
        if (!anim.property || typeof anim.property !== 'string') {
            errors.push({ path: `${path}.property`, message: 'Animation must specify a property string.', severity: 'error' });
        }

        if (!anim.easing || !VALID_EASING_NAMES.has(anim.easing)) {
            errors.push({ path: `${path}.easing`, message: `Invalid or missing easing function "${anim.easing}".`, severity: 'error' });
        }

        if (!Array.isArray(anim.keyframes) || anim.keyframes.length === 0) {
            errors.push({ path: `${path}.keyframes`, message: 'Animation must have at least one keyframe.', severity: 'error' });
        } else {
            // Check monotonic time ordering
            for (let ki = 1; ki < anim.keyframes.length; ki++) {
                const prev = anim.keyframes[ki - 1]!;
                const curr = anim.keyframes[ki]!;
                if (curr.time <= prev.time) {
                    errors.push({ path: `${path}.keyframes[${ki}]`, message: `Keyframe times must be strictly monotonically increasing (${prev.time} → ${curr.time}).`, severity: 'error' });
                }
            }
        }
    }
}
