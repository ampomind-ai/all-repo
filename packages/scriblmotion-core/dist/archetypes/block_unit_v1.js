// ─────────────────────────────────────────────────────────────────────────────
// block_unit_v1 — Stackable Block Archetype
//
// Used for: blockchain, data blocks, memory units, modular explanations.
// ─────────────────────────────────────────────────────────────────────────────
export const block_unit_v1 = {
    id: 'block_unit_v1',
    version: '1.0.0',
    category: 'abstract',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: -5, rotationMax: 5, children: ['face', 'top'],
        },
        face: {
            id: 'face', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: { shape: 'rect', width: 60, height: 40, fill: '#3b82f6' },
        },
        top: {
            id: 'top', parentId: 'root',
            localPosition: { x: 0, y: -20 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: {
                shape: 'path',
                d: 'M -30 0 L -15 -12 L 45 -12 L 30 0 Z',
                fill: '#60a5fa',
            },
        },
    },
    states: {
        connect: {
            id: 'connect',
            enter: [
                { property: 'position.y', keyframes: [{ time: 0, value: 0 }, { time: 0.5, value: -10 }, { time: 1, value: 0 }], easing: 'easeOutCubic', duration: 400 },
            ],
        },
        stack: {
            id: 'stack',
            enter: [
                { property: 'position.y', keyframes: [{ time: 0, value: -30 }, { time: 1, value: 0 }], easing: 'bounce', duration: 500 },
            ],
        },
        validate: {
            id: 'validate',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.3, value: 0.6 }, { time: 0.6, value: 1 }], easing: 'easeInOutSine', duration: 600 },
            ],
            loop: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.03 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 2000, loops: -1 },
            ],
        },
        reject: {
            id: 'reject',
            enter: [
                { property: 'position.x', keyframes: [{ time: 0, value: 0 }, { time: 0.15, value: 6 }, { time: 0.3, value: -6 }, { time: 0.45, value: 4 }, { time: 0.6, value: -4 }, { time: 1, value: 0 }], easing: 'easeOutCubic', duration: 500 },
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0.5 }], easing: 'easeOutCubic', duration: 500 },
            ],
        },
    },
    defaultState: 'validate',
    bounds: { min: { x: -30, y: -32 }, max: { x: 30, y: 20 } },
    anchors: { top: { x: 0, y: -32 }, bottom: { x: 0, y: 20 }, left: { x: -30, y: 0 }, right: { x: 30, y: 0 } },
    animationPresets: {
        drop: [
            { property: 'position.y', keyframes: [{ time: 0, value: -50 }, { time: 1, value: 0 }], easing: 'bounce', duration: 600 },
        ],
    },
    appearanceOverrides: ['fill', 'stroke', 'topFill'],
    metadata: { author: 'AmpoMind', description: 'Stackable block for blockchain, memory, modular explanations.', tags: ['block', 'blockchain', 'data', 'stack'] },
};
//# sourceMappingURL=block_unit_v1.js.map