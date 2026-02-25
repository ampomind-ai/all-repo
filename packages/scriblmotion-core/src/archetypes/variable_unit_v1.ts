// ─────────────────────────────────────────────────────────────────────────────
// variable_unit_v1 — Variable Character Archetype
//
// A box with dynamic label. Used for: variables, values, comparisons.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeDef } from '../types/index';

export const variable_unit_v1: ArchetypeDef = {
    id: 'variable_unit_v1',
    version: '1.0.0',
    category: 'math',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: -5, rotationMax: 5, children: ['box'],
        },
        box: {
            id: 'box', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: { shape: 'rect', width: 50, height: 40, fill: '#8b5cf6' },
        },
    },
    states: {
        idle: {
            id: 'idle',
        },
        highlight: {
            id: 'highlight',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.15 }, { time: 1, value: 1.1 }], easing: 'spring', duration: 400 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.15 }, { time: 1, value: 1.1 }], easing: 'spring', duration: 400 },
            ],
        },
        update: {
            id: 'update',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.3, value: 0.4 }, { time: 0.6, value: 1 }], easing: 'easeInOutSine', duration: 400 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.3, value: 0.9 }, { time: 0.6, value: 1.05 }, { time: 1, value: 1 }], easing: 'spring', duration: 500 },
            ],
        },
        compare: {
            id: 'compare',
            loop: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 0.7 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1200, loops: -1 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -25, y: -20 }, max: { x: 25, y: 20 } },
    anchors: { center: { x: 0, y: 0 }, label: { x: 0, y: 0 } },
    animationPresets: {
        flash: [
            { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.25, value: 0.3 }, { time: 0.5, value: 1 }, { time: 0.75, value: 0.3 }, { time: 1, value: 1 }], easing: 'linear', duration: 600 },
        ],
    },
    appearanceOverrides: ['fill', 'stroke', 'label', 'fontSize', 'fontFamily'],
    metadata: { author: 'AmpoMind', description: 'Dynamic-label variable box for math and programming.', tags: ['variable', 'math', 'programming', 'algebra'] },
};
