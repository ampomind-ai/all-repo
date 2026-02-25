// ─────────────────────────────────────────────────────────────────────────────
// coordinate_plane_v1 — Interactive Graph Plotter
//
// Renders a cartesian coordinate system and plots mathematical functions.
// ─────────────────────────────────────────────────────────────────────────────
export const coordinate_plane_v1 = {
    id: 'coordinate_plane_v1',
    version: '1.0.0',
    category: 'math',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
        }
    },
    states: {
        idle: { id: 'idle' },
        active: {
            id: 'active',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 0.9 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 300 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 0.9 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 300 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -200, y: -200 }, max: { x: 200, y: 200 } },
    anchors: { center: { x: 0, y: 0 } },
    animationPresets: {},
    appearanceOverrides: ['width', 'height', 'domain', 'range', 'series', 'gridColor', 'axisColor'],
    metadata: { author: 'AmpoMind', description: 'Plot mathematical equations onto a 2D coordinate plane.', tags: ['math', 'graph', 'plot'] },
};
