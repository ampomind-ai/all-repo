// ─────────────────────────────────────────────────────────────────────────────
// chart_bar_v1 — Bar Chart Entity Archetype
//
// Used for: data visualization, comparisons, statistics.
// Supports: grow animation, highlight, reorder.
// ─────────────────────────────────────────────────────────────────────────────
export const chart_bar_v1 = {
    id: 'chart_bar_v1',
    version: '1.0.0',
    category: 'visualization',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: ['bar'],
        },
        bar: {
            id: 'bar', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: { shape: 'rect', width: 30, height: 100, fill: '#06b6d4' },
        },
    },
    states: {
        idle: {
            id: 'idle',
        },
        grow: {
            id: 'grow',
            enter: [
                { property: 'scale.y', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 800 },
            ],
        },
        highlight: {
            id: 'highlight',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 1.15 }], easing: 'easeOutCubic', duration: 300 },
            ],
            loop: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 0.85 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 1500, loops: -1 },
            ],
        },
        reorder: {
            id: 'reorder',
            enter: [
                { property: 'position.x', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 0 }], easing: 'easeInOutCubic', duration: 600 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -15, y: -100 }, max: { x: 15, y: 0 } },
    anchors: { top: { x: 0, y: -100 }, bottom: { x: 0, y: 0 }, label: { x: 0, y: 10 } },
    animationPresets: {
        reveal: [
            { property: 'scale.y', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 1000 },
            { property: 'opacity', keyframes: [{ time: 0, value: 0 }, { time: 0.3, value: 1 }], easing: 'easeOutCubic', duration: 400 },
        ],
    },
    appearanceOverrides: ['fill', 'stroke', 'width', 'height', 'value'],
    metadata: { author: 'AmpoMind', description: 'Animated bar chart entity for data visualization.', tags: ['chart', 'bar', 'visualization', 'data'] },
};
//# sourceMappingURL=chart_bar_v1.js.map