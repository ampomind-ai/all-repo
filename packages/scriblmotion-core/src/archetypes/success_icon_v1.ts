// ─────────────────────────────────────────────────────────────────────────────
// success_icon_v1 — Checkmark Feedback Archetype
//
// Used for: quiz success, correct answers, validation confirmation.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeDef } from '../types/index';

export const success_icon_v1: ArchetypeDef = {
    id: 'success_icon_v1',
    version: '1.0.0',
    category: 'feedback',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: ['circle', 'check'],
        },
        circle: {
            id: 'circle', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: { shape: 'circle', radius: 24, fill: '#22c55e' },
        },
        check: {
            id: 'check', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: {
                shape: 'path',
                d: 'M -10 0 L -3 8 L 12 -8',
                stroke: '#ffffff',
                strokeWidth: 3,
            },
        },
    },
    states: {
        idle: { id: 'idle' },
        appear: {
            id: 'appear',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 0 }, { time: 0.6, value: 1.2 }, { time: 1, value: 1 }], easing: 'spring', duration: 500 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 0 }, { time: 0.6, value: 1.2 }, { time: 1, value: 1 }], easing: 'spring', duration: 500 },
                { property: 'opacity', keyframes: [{ time: 0, value: 0 }, { time: 0.3, value: 1 }], easing: 'easeOutCubic', duration: 300 },
            ],
        },
        pulse: {
            id: 'pulse',
            loop: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.1 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1500, loops: -1 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.1 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1500, loops: -1 },
            ],
        },
        dismiss: {
            id: 'dismiss',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0 }], easing: 'easeInCubic', duration: 300 },
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0.5 }], easing: 'easeInCubic', duration: 300 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0.5 }], easing: 'easeInCubic', duration: 300 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -24, y: -24 }, max: { x: 24, y: 24 } },
    anchors: { center: { x: 0, y: 0 } },
    animationPresets: {
        celebrate: [
            { property: 'rotation', keyframes: [{ time: 0, value: 0 }, { time: 0.25, value: -10 }, { time: 0.75, value: 10 }, { time: 1, value: 0 }], easing: 'easeInOutSine', duration: 400 },
        ],
    },
    appearanceOverrides: ['fill', 'checkColor'],
    metadata: { author: 'AmpoMind', description: 'Checkmark success icon for feedback and validation.', tags: ['feedback', 'success', 'checkmark', 'quiz'] },
};
