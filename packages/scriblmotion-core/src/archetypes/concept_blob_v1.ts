// ─────────────────────────────────────────────────────────────────────────────
// concept_blob_v1 — Morphable Abstract Concept Archetype
//
// A fluid, shape-shifting abstract entity representing ideas, data, tokens.
// Used for: ideas, thoughts, data units, variables, packets.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeDef } from '../types/index';

export const concept_blob_v1: ArchetypeDef = {
    id: 'concept_blob_v1',
    version: '1.0.0',
    category: 'abstract',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: -360, rotationMax: 360, children: ['core'],
        },
        core: {
            id: 'core', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: -360, rotationMax: 360, children: [],
            visual: {
                shape: 'path',
                d: 'M 0 -25 Q 25 -25 25 0 Q 25 25 0 25 Q -25 25 -25 0 Q -25 -25 0 -25',
                fill: '#a78bfa',
            },
        },
    },
    states: {
        calm: {
            id: 'calm',
            loop: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.05 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 3000, loops: -1 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 0.95 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 3000, loops: -1 },
            ],
        },
        energetic: {
            id: 'energetic',
            loop: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.25, value: 1.2 }, { time: 0.5, value: 0.85 }, { time: 0.75, value: 1.15 }, { time: 1, value: 1 }], easing: 'easeInOutQuad', duration: 800, loops: -1 },
                { property: 'rotation', keyframes: [{ time: 0, value: 0 }, { time: 0.5, value: 5 }, { time: 1, value: 0 }], easing: 'easeInOutSine', duration: 600, loops: -1 },
            ],
        },
        split: {
            id: 'split',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.5 }, { time: 1, value: 1 }], easing: 'spring', duration: 700 },
            ],
        },
        merge: {
            id: 'merge',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1.5 }, { time: 1, value: 1 }], easing: 'easeInOutCubic', duration: 500 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 0.8 }, { time: 1, value: 1 }], easing: 'easeInOutCubic', duration: 500 },
            ],
        },
        pulse: {
            id: 'pulse',
            loop: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 0.6 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1000, loops: -1 },
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.15 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1000, loops: -1 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.15 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1000, loops: -1 },
            ],
        },
    },
    defaultState: 'calm',
    bounds: { min: { x: -30, y: -30 }, max: { x: 30, y: 30 } },
    anchors: { center: { x: 0, y: 0 }, top: { x: 0, y: -25 } },
    animationPresets: {
        wobble: [
            { property: 'rotation', keyframes: [{ time: 0, value: 0 }, { time: 0.2, value: 8 }, { time: 0.4, value: -6 }, { time: 0.6, value: 4 }, { time: 0.8, value: -2 }, { time: 1, value: 0 }], easing: 'easeOutCubic', duration: 800 },
        ],
    },
    appearanceOverrides: ['fill', 'stroke', 'opacity'],
    metadata: { author: 'AmpoMind', description: 'Morphable abstract concept — ideas, data, tokens.', tags: ['abstract', 'concept', 'data', 'idea'] },
};
