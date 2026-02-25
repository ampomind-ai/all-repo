// ─────────────────────────────────────────────────────────────────────────────
// slider_ui_v1 — Interactive Slider UI Archetype
//
// For interactive learning. Draggable handle, value range.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeDef } from '../types/index';

export const slider_ui_v1: ArchetypeDef = {
    id: 'slider_ui_v1',
    version: '1.0.0',
    category: 'ui',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: ['track', 'handle'],
        },
        track: {
            id: 'track', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: { shape: 'rect', width: 200, height: 6, fill: '#3f3f46' },
        },
        handle: {
            id: 'handle', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: { shape: 'circle', radius: 10, fill: '#ffffff' },
        },
    },
    states: {
        idle: { id: 'idle' },
        active: {
            id: 'active',
            enter: [
                { property: 'handle.scale.x', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 1.2 }], easing: 'easeOutCubic', duration: 150 },
                { property: 'handle.scale.y', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 1.2 }], easing: 'easeOutCubic', duration: 150 },
            ],
        },
        disabled: {
            id: 'disabled',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0.4 }], easing: 'easeOutCubic', duration: 200 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -100, y: -10 }, max: { x: 100, y: 10 } },
    anchors: { left: { x: -100, y: 0 }, right: { x: 100, y: 0 }, handle: { x: 0, y: 0 } },
    animationPresets: {},
    appearanceOverrides: ['fill', 'trackFill', 'handleFill', 'width', 'min', 'max', 'step'],
    metadata: { author: 'AmpoMind', description: 'Interactive slider with draggable handle.', tags: ['ui', 'slider', 'input', 'interactive'] },
};
