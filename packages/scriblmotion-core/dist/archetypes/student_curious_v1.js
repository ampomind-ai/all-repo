// ─────────────────────────────────────────────────────────────────────────────
// student_curious_v1 — Student Curious Archetype
//
// Represents the learner with emotional reactions.
// Used for: asking questions, making mistakes, representing user confusion.
// ─────────────────────────────────────────────────────────────────────────────
export const student_curious_v1 = {
    id: 'student_curious_v1',
    version: '1.0.0',
    category: 'human',
    rig: {
        root: {
            id: 'root', parentId: null,
            localPosition: { x: 0, y: 0 }, localRotation: 0,
            rotationMin: -5, rotationMax: 5, children: ['body'],
        },
        body: {
            id: 'body', parentId: 'root',
            localPosition: { x: 0, y: -15 }, localRotation: 0,
            rotationMin: -8, rotationMax: 8, children: ['head'],
            visual: { shape: 'rect', width: 42, height: 55, fill: '#34d399' },
        },
        head: {
            id: 'head', parentId: 'body',
            localPosition: { x: 0, y: -42 }, localRotation: 0,
            rotationMin: -20, rotationMax: 20, children: ['mouth'],
            visual: { shape: 'circle', radius: 20, fill: '#fbbf24' },
        },
        mouth: {
            id: 'mouth', parentId: 'head',
            localPosition: { x: 0, y: 6 }, localRotation: 0,
            rotationMin: 0, rotationMax: 0, children: [],
            visual: { shape: 'path', d: 'M -4 0 L 4 0', stroke: '#1e1e2e', strokeWidth: 1.5 },
        },
    },
    states: {
        confused: {
            id: 'confused',
            enter: [
                { property: 'head.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: -18 }], easing: 'easeOutCubic', duration: 400 },
            ],
            loop: [
                { property: 'head.rotation', keyframes: [{ time: 0, value: -18 }, { time: 0.5, value: -14 }, { time: 1, value: -18 }], easing: 'easeInOutSine', duration: 2000, loops: -1 },
            ],
        },
        curious: {
            id: 'curious',
            enter: [
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 1.05 }], easing: 'easeOutCubic', duration: 300 },
            ],
        },
        aha: {
            id: 'aha',
            enter: [
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.4, value: 1.15 }, { time: 1, value: 1 }], easing: 'spring', duration: 500 },
            ],
        },
        unsure: {
            id: 'unsure',
            enter: [
                { property: 'body.rotation', keyframes: [{ time: 0, value: 0 }, { time: 0.3, value: -3 }, { time: 0.7, value: 3 }, { time: 1, value: 0 }], easing: 'easeInOutSine', duration: 800 },
            ],
        },
        happy: {
            id: 'happy',
            enter: [
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.5, value: 1.08 }, { time: 1, value: 1 }], easing: 'bounce', duration: 600 },
            ],
        },
    },
    defaultState: 'curious',
    bounds: { min: { x: -30, y: -80 }, max: { x: 30, y: 45 } },
    anchors: { top: { x: 0, y: -62 }, mouth: { x: 0, y: -38 } },
    animationPresets: {
        headTilt: [
            { property: 'head.rotation', keyframes: [{ time: 0, value: 0 }, { time: 0.5, value: 12 }, { time: 1, value: 0 }], easing: 'easeInOutSine', duration: 800 },
        ],
    },
    expressions: [
        { name: 'speaking_neutral', blendDuration: 50, components: { mouth: 'M -4 0 L 4 0' } },
        { name: 'speaking_a', blendDuration: 50, components: { mouth: 'M -4 1 Q 0 8 4 1 Q 0 1 -4 1' } },
        { name: 'speaking_o', blendDuration: 50, components: { mouth: 'M -2 1 Q 0 5 2 1 Q 0 -3 -2 1' } },
        { name: 'speaking_closed', blendDuration: 50, components: { mouth: 'M -4 0 L 4 0' } },
        { name: 'speaking_open', blendDuration: 50, components: { mouth: 'M -4 0 Q 0 4 4 0 Q 0 0 -4 0' } },
    ],
    appearanceOverrides: ['fill', 'headFill', 'bodyFill'],
    metadata: { author: 'AmpoMind', description: 'Learner archetype with emotional reactions.', tags: ['education', 'student', 'learner'] },
};
//# sourceMappingURL=student_curious_v1.js.map