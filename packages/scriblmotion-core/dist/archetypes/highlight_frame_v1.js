// ─────────────────────────────────────────────────────────────────────────────
// highlight_frame_v1 — Highlight Frame Archetype
//
// Draws attention to objects. Focus tool for presentations and tutorials.
// ─────────────────────────────────────────────────────────────────────────────
export const highlight_frame_v1 = {
    id: 'highlight_frame_v1',
    version: '1.0.0',
    category: 'meta',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: ['frame'],
        },
        frame: {
            id: 'frame', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: {
                shape: 'rect',
                width: 120,
                height: 80,
                stroke: '#fbbf24',
                strokeWidth: 3,
            },
        },
    },
    states: {
        idle: { id: 'idle' },
        focus: {
            id: 'focus',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1.2 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 400 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1.2 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 400 },
                { property: 'opacity', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 300 },
            ],
            loop: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 0.7 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 2000, loops: -1 },
            ],
        },
        pulse: {
            id: 'pulse',
            loop: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.05 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1500, loops: -1 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.05 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1500, loops: -1 },
                { property: 'opacity', keyframes: [{ time: 0, value: 0.8 }, { time: 0.5, value: 1 }, { time: 1, value: 0.8 }], easing: 'easeInOutSine', duration: 1500, loops: -1 },
            ],
        },
        dismiss: {
            id: 'dismiss',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0 }], easing: 'easeInCubic', duration: 250 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -60, y: -40 }, max: { x: 60, y: 40 } },
    anchors: { center: { x: 0, y: 0 }, topLeft: { x: -60, y: -40 }, bottomRight: { x: 60, y: 40 } },
    animationPresets: {},
    appearanceOverrides: ['stroke', 'strokeWidth', 'width', 'height', 'rx'],
    metadata: { author: 'AmpoMind', description: 'Attention-focus frame for highlighting objects.', tags: ['meta', 'highlight', 'focus', 'frame'] },
};
//# sourceMappingURL=highlight_frame_v1.js.map