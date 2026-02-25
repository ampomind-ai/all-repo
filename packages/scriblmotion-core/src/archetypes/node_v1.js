// ─────────────────────────────────────────────────────────────────────────────
// node_v1 — Graph Node Archetype
//
// Used for: graph theory, networks, blockchain nodes, neural networks.
// ─────────────────────────────────────────────────────────────────────────────
export const node_v1 = {
    id: 'node_v1',
    version: '1.0.0',
    category: 'abstract',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: ['ring', 'core'],
        },
        ring: {
            id: 'ring', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 360, children: [],
            visual: { shape: 'circle', radius: 22, stroke: '#6366f1', strokeWidth: 2 },
        },
        core: {
            id: 'core', parentId: 'root',
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: { shape: 'circle', radius: 16, fill: '#6366f1' },
        },
    },
    states: {
        active: {
            id: 'active',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 0.5 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 300 },
            ],
            loop: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.08 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 2000, loops: -1 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.08 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 2000, loops: -1 },
            ],
        },
        inactive: {
            id: 'inactive',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0.4 }], easing: 'easeOutCubic', duration: 300 },
            ],
        },
        selected: {
            id: 'selected',
            enter: [
                { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.2 }, { time: 1, value: 1.1 }], easing: 'spring', duration: 400 },
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.2 }, { time: 1, value: 1.1 }], easing: 'spring', duration: 400 },
            ],
        },
        broadcast: {
            id: 'broadcast',
            loop: [
                { property: 'ring.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 360 }], easing: 'linear', duration: 2000, loops: -1 },
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 0.7 }, { time: 1, value: 1 }], easing: 'easeInOutSine', duration: 800, loops: -1 },
            ],
        },
    },
    defaultState: 'active',
    bounds: { min: { x: -25, y: -25 }, max: { x: 25, y: 25 } },
    anchors: { center: { x: 0, y: 0 }, top: { x: 0, y: -22 }, right: { x: 22, y: 0 }, bottom: { x: 0, y: 22 }, left: { x: -22, y: 0 } },
    animationPresets: {
        ping: [
            { property: 'scale.x', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.3 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 400 },
            { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.3 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 400 },
        ],
    },
    appearanceOverrides: ['fill', 'stroke', 'strokeWidth'],
    metadata: { author: 'AmpoMind', description: 'Graph node for networks, blockchains, neural networks.', tags: ['graph', 'node', 'network', 'blockchain'] },
};
