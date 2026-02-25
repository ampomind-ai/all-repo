// ─────────────────────────────────────────────────────────────────────────────
// input_field_v1 — Interactive Number Input Archetype
//
// Allows users to type numeric answers. Renders an HTML input via foreignObject.
// ─────────────────────────────────────────────────────────────────────────────
export const input_field_v1 = {
    id: 'input_field_v1',
    version: '1.0.0',
    category: 'ui',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
        },
    },
    states: {
        idle: { id: 'idle' },
        focus: {
            id: 'focus',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 1.05 }], easing: 'easeOutCubic', duration: 150 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 1.05 }], easing: 'easeOutCubic', duration: 150 },
            ],
            exit: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1.05 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 150 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1.05 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 150 },
            ]
        },
        disabled: {
            id: 'disabled',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0.5 }], easing: 'easeOutCubic', duration: 200 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -60, y: -16 }, max: { x: 60, y: 16 } },
    anchors: { center: { x: 0, y: 0 } },
    animationPresets: {},
    appearanceOverrides: ['width', 'height', 'placeholder', 'type'],
    metadata: { author: 'AmpoMind', description: 'Interactive input field for typed answers.', tags: ['ui', 'input', 'form'] },
};
//# sourceMappingURL=input_field_v1.js.map