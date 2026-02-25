// ─────────────────────────────────────────────────────────────────────────────
// vector_arrow_v1 — Arrow Force Archetype
//
// Used for: forces, velocity, acceleration, directional relationships.
// Supports: scale magnitude, animate direction, pulse.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeDef } from '../types/index';

export const vector_arrow_v1: ArchetypeDef = {
    id: 'vector_arrow_v1',
    version: '1.0.0',
    category: 'abstract',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: -360, rotationMax: 360, children: ['shaft', 'head'],
        },
        shaft: {
            id: 'shaft', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: { shape: 'rect', width: 60, height: 6, fill: '#f43f5e' },
        },
        head: {
            id: 'head', parentId: 'root',
            localPosition: { x: 30, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: {
                shape: 'path',
                d: 'M 0 -10 L 16 0 L 0 10 Z',
                fill: '#f43f5e',
            },
        },
    },
    states: {
        idle: {
            id: 'idle',
        },
        pulse: {
            id: 'pulse',
            loop: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 0.5 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1200, loops: -1 },
            ],
        },
        grow: {
            id: 'grow',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 0.5 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 500 },
            ],
        },
        shrink: {
            id: 'shrink',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0.5 }], easing: 'easeInCubic', duration: 400 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -30, y: -10 }, max: { x: 46, y: 10 } },
    anchors: { tail: { x: -30, y: 0 }, tip: { x: 46, y: 0 }, center: { x: 8, y: 0 } },
    animationPresets: {
        pointTo: [
            { property: 'rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 0 }], easing: 'easeOutCubic', duration: 400 },
        ],
    },
    appearanceOverrides: ['fill', 'stroke', 'magnitude'],
    metadata: { author: 'AmpoMind', description: 'Directional force arrow for physics, math, relationships.', tags: ['vector', 'arrow', 'force', 'physics'] },
};
