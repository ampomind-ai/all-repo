// ─────────────────────────────────────────────────────────────────────────────
// speech_bubble_v1 — Speech Bubble UI Archetype
//
// Anchored to characters. Supports text typing animation, emphasis pulse.
// ─────────────────────────────────────────────────────────────────────────────
export const speech_bubble_v1 = {
    id: 'speech_bubble_v1',
    version: '1.0.0',
    category: 'ui',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: ['bubble'],
        },
        bubble: {
            id: 'bubble', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: {
                shape: 'path',
                d: 'M -80 -30 Q -80 -45 -65 -45 L 65 -45 Q 80 -45 80 -30 L 80 20 Q 80 35 65 35 L 10 35 L 0 50 L -10 35 L -65 35 Q -80 35 -80 20 Z',
                fill: '#1e1e2e',
                stroke: '#3f3f46',
                strokeWidth: 1.5,
            },
        },
    },
    states: {
        idle: { id: 'idle' },
        appear: {
            id: 'appear',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 0 }, { time: 0.6, value: 1.1 }, { time: 1, value: 1 }], easing: 'spring', duration: 400 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 0 }, { time: 0.6, value: 1.1 }, { time: 1, value: 1 }], easing: 'spring', duration: 400 },
                { property: 'opacity', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 300 },
            ],
        },
        typing: {
            id: 'typing',
            loop: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 0.8 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 800, loops: -1 },
            ],
        },
        emphasis: {
            id: 'emphasis',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.3, value: 1.08 }, { time: 1, value: 1 }], easing: 'spring', duration: 500 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.3, value: 1.08 }, { time: 1, value: 1 }], easing: 'spring', duration: 500 },
            ],
        },
        dismiss: {
            id: 'dismiss',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0 }], easing: 'easeInCubic', duration: 200 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0 }], easing: 'easeInCubic', duration: 200 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -80, y: -45 }, max: { x: 80, y: 50 } },
    anchors: { tail: { x: 0, y: 50 }, center: { x: 0, y: -5 }, text: { x: 0, y: -5 } },
    animationPresets: {
        popIn: [
            { property: 'scale.x', keyframes: [{ time: 0, value: 0 }, { time: 0.7, value: 1.12 }, { time: 1, value: 1 }], easing: 'spring', duration: 350 },
            { property: 'scale.y', keyframes: [{ time: 0, value: 0 }, { time: 0.7, value: 1.12 }, { time: 1, value: 1 }], easing: 'spring', duration: 350 },
        ],
    },
    appearanceOverrides: ['fill', 'stroke', 'color', 'fontSize', 'fontFamily', 'content'],
    metadata: { author: 'AmpoMind', description: 'Anchored speech bubble with typing and emphasis animations.', tags: ['ui', 'speech', 'dialogue', 'bubble'] },
};
