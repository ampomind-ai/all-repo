// ─────────────────────────────────────────────────────────────────────────────
// AnimationSystem — Keyframe interpolation engine
// Reads tracks from the Timeline, computes interpolated values, and applies
// property mutations to entities via the EntityManager.
// ─────────────────────────────────────────────────────────────────────────────
import { getEasingFn } from '../utils/Easing';
import { findKeyframePair, interpolateValue } from '../utils/Interpolation';
import { MAX_ANIMATIONS_PER_ENTITY } from '../utils/Guards';
/** Counter for generating unique animation track IDs. */
let trackIdCounter = 0;
export class AnimationSystem {
    /**
     * Build an internal AnimationTrack from a DSL animation definition.
     */
    createTrack(entityId, def) {
        const keyframes = [...def.keyframes].sort((a, b) => a.time - b.time);
        const firstTime = keyframes[0]?.time ?? 0;
        const lastTime = keyframes[keyframes.length - 1]?.time ?? 0;
        return {
            id: def.id ?? `track_${trackIdCounter++}`,
            entityId,
            property: def.property,
            keyframes,
            easing: def.easing,
            delay: def.delay ?? 0,
            loops: def.loops ?? 1,
            currentLoop: 0,
            totalDuration: def.duration ?? (lastTime - firstTime),
            isActive: true,
            chainedTo: def.chainedTo ?? null,
        };
    }
    /**
     * Validate that an entity does not exceed the maximum concurrent
     * animation count.
     */
    validateEntityLimit(entityId, tracks) {
        let count = 0;
        for (const track of tracks.values()) {
            if (track.entityId === entityId && track.isActive)
                count++;
        }
        return count < MAX_ANIMATIONS_PER_ENTITY;
    }
    /**
     * Evaluate all active tracks at a given time and return a list of
     * property mutations to apply.
     */
    evaluate(activeTrackIds, tracks, currentTime) {
        const mutations = [];
        for (const trackId of activeTrackIds) {
            const track = tracks.get(trackId);
            if (!track)
                continue;
            const localTime = currentTime - track.delay;
            const pair = findKeyframePair(track.keyframes, localTime);
            if (!pair)
                continue;
            const easingFn = getEasingFn(track.easing);
            const value = interpolateValue(pair.from.value, pair.to.value, pair.t, easingFn);
            mutations.push({
                entityId: track.entityId,
                property: track.property,
                value,
            });
        }
        return mutations;
    }
    /**
     * Apply mutations to entity objects.
     * Handles dot-notation property paths (`position.x`, `styles.fill`).
     */
    applyMutations(mutations, entities) {
        for (const mutation of mutations) {
            const entity = entities.get(mutation.entityId);
            if (!entity)
                continue;
            setNestedProperty(entity, mutation.property, mutation.value);
        }
    }
}
/**
 * Set a nested property on an object using dot-notation path.
 * e.g., `setNestedProperty(entity, "position.x", 100)`
 */
function setNestedProperty(obj, path, value) {
    const parts = path.split('.');
    let current = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        const key = parts[i];
        if (typeof current[key] !== 'object' || current[key] === null) {
            current[key] = {};
        }
        current = current[key];
    }
    const lastKey = parts[parts.length - 1];
    current[lastKey] = value;
}
