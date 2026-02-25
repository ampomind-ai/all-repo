// ─────────────────────────────────────────────────────────────────────────────
// math_expr_v1 — Math Expression Archetype
//
// Renders mathematical expressions using KaTeX.
// ─────────────────────────────────────────────────────────────────────────────
export const math_expr_v1 = {
    id: 'math_expr_v1',
    version: '1.0.0',
    category: 'math',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
        },
    },
    states: {
        idle: { id: 'idle' },
        active: {
            id: 'active',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 1.1 }], easing: 'easeOutCubic', duration: 150 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 1.1 }], easing: 'easeOutCubic', duration: 150 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -100, y: -30 }, max: { x: 100, y: 30 } },
    anchors: { center: { x: 0, y: 0 } },
    animationPresets: {},
    appearanceOverrides: ['color', 'fontSize', 'latex'],
    metadata: { author: 'AmpoMind', description: 'Mathematical expression rendered with KaTeX.', tags: ['math', 'expression', 'latex'] },
};
//# sourceMappingURL=math_expr_v1.js.map