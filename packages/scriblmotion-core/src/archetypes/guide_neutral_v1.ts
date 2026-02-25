// ─────────────────────────────────────────────────────────────────────────────
// guide_neutral_v1 — Mentor Neutral Archetype
//
// Primary explainer character. Gender-neutral styling.
// Used for: core explanations, onboarding, step-by-step walkthroughs.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeDef } from '../types/index';

export const guide_neutral_v1: ArchetypeDef = {
    id: 'guide_neutral_v1',
    version: '1.0.0',
    category: 'human',
    rig: {
        root: {
            id: 'root',
            parentId: null,
            localPosition: { x: 0, y: 0 },
            localRotation: 0,
            rotationMin: -5,
            rotationMax: 5,
            children: ['body'],
        },
        body: {
            id: 'body',
            parentId: 'root',
            localPosition: { x: 0, y: -20 },
            localRotation: 0,
            rotationMin: -10,
            rotationMax: 10,
            children: ['head', 'arm_left', 'arm_right'],
            visual: {
                shape: 'rect',
                width: 50,
                height: 70,
                fill: '#6366f1',
            },
        },
        head: {
            id: 'head',
            parentId: 'body',
            localPosition: { x: 0, y: -50 },
            localRotation: 0,
            rotationMin: -15,
            rotationMax: 15,
            children: ['mouth', 'eyes'],
            visual: {
                shape: 'circle',
                radius: 22,
                fill: '#fbbf24',
            },
        },
        mouth: {
            id: 'mouth',
            parentId: 'head',
            localPosition: { x: 0, y: 8 },
            localRotation: 0,
            rotationMin: 0,
            rotationMax: 0,
            children: [],
            visual: {
                shape: 'path',
                d: 'M -6 0 Q 0 4 6 0',
                stroke: '#1e1e2e',
                strokeWidth: 1.5,
            },
        },
        eyes: {
            id: 'eyes',
            parentId: 'head',
            localPosition: { x: 0, y: -4 },
            localRotation: 0,
            rotationMin: 0,
            rotationMax: 0,
            children: [],
            visual: {
                shape: 'path',
                d: 'M -8 0 a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0 M 3 0 a 2.5 2.5 0 1 0 5 0 a 2.5 2.5 0 1 0 -5 0',
                fill: '#1e1e2e',
            },
        },
        arm_left: {
            id: 'arm_left',
            parentId: 'body',
            localPosition: { x: -30, y: -10 },
            localRotation: 0,
            rotationMin: -90,
            rotationMax: 90,
            children: [],
            visual: {
                shape: 'rect',
                width: 12,
                height: 40,
                fill: '#818cf8',
            },
        },
        arm_right: {
            id: 'arm_right',
            parentId: 'body',
            localPosition: { x: 30, y: -10 },
            localRotation: 0,
            rotationMin: -90,
            rotationMax: 90,
            children: [],
            visual: {
                shape: 'rect',
                width: 12,
                height: 40,
                fill: '#818cf8',
            },
        },
    },
    states: {
        idle: {
            id: 'idle',
            loop: [
                { property: 'rotation', keyframes: [{ time: 0, value: -1 }, { time: 0.5, value: 1 }, { time: 1, value: -1 }], easing: 'easeInOutSine', duration: 3000, loops: -1 },
            ],
        },
        explain: {
            id: 'explain',
            enter: [
                { property: 'arm_right.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: -45 }], easing: 'easeOutCubic', duration: 400 },
            ],
            loop: [
                { property: 'arm_right.rotation', keyframes: [{ time: 0, value: -45 }, { time: 0.5, value: -30 }, { time: 1, value: -45 }], easing: 'easeInOutSine', duration: 1500, loops: -1 },
            ],
        },
        point_left: {
            id: 'point_left',
            enter: [
                { property: 'arm_left.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: -70 }], easing: 'easeOutCubic', duration: 300 },
            ],
        },
        point_right: {
            id: 'point_right',
            enter: [
                { property: 'arm_right.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 70 }], easing: 'easeOutCubic', duration: 300 },
            ],
        },
        thinking: {
            id: 'thinking',
            enter: [
                { property: 'head.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 10 }], easing: 'easeOutCubic', duration: 500 },
                { property: 'arm_right.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: -80 }], easing: 'easeOutCubic', duration: 400 },
            ],
        },
        celebrate: {
            id: 'celebrate',
            enter: [
                { property: 'scale.y', keyframes: [{ time: 0, value: 1 }, { time: 0.3, value: 1.1 }, { time: 0.6, value: 0.95 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 600 },
                { property: 'arm_left.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: -120 }], easing: 'easeOutCubic', duration: 300 },
                { property: 'arm_right.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 120 }], easing: 'easeOutCubic', duration: 300 },
            ],
        },
        confused: {
            id: 'confused',
            enter: [
                { property: 'head.rotation', keyframes: [{ time: 0, value: 0 }, { time: 1, value: -15 }], easing: 'easeOutCubic', duration: 400 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -50, y: -100 }, max: { x: 50, y: 60 } },
    anchors: {
        mouth: { x: 0, y: -42 },
        hand_left: { x: -36, y: 10 },
        hand_right: { x: 36, y: 10 },
        top: { x: 0, y: -72 },
    },
    animationPresets: {
        wave: [
            { property: 'arm_right.rotation', keyframes: [{ time: 0, value: 0 }, { time: 0.25, value: 60 }, { time: 0.5, value: 40 }, { time: 0.75, value: 60 }, { time: 1, value: 0 }], easing: 'easeInOutSine', duration: 1000 },
        ],
        nod: [
            { property: 'head.rotation', keyframes: [{ time: 0, value: 0 }, { time: 0.3, value: 10 }, { time: 0.6, value: -5 }, { time: 1, value: 0 }], easing: 'easeOutCubic', duration: 600 },
        ],
    },
    expressions: [
        { name: 'speaking_neutral', blendDuration: 50, components: { mouth: 'M -6 0 Q 0 4 6 0' } },
        { name: 'speaking_a', blendDuration: 50, components: { mouth: 'M -5 1 Q 0 10 5 1 Q 0 1 -5 1' } },
        { name: 'speaking_o', blendDuration: 50, components: { mouth: 'M -3 1 Q 0 7 3 1 Q 0 -5 -3 1' } },
        { name: 'speaking_closed', blendDuration: 50, components: { mouth: 'M -6 0 L 6 0' } },
        { name: 'speaking_open', blendDuration: 50, components: { mouth: 'M -6 0 Q 0 6 6 0 Q 0 0 -6 0' } },
    ],
    appearanceOverrides: ['fill', 'stroke', 'headFill', 'bodyFill', 'armFill'],
    metadata: {
        author: 'AmpoMind',
        description: 'Primary explainer character. Gender-neutral, versatile mentor figure.',
        tags: ['education', 'guide', 'explainer', 'mentor'],
    },
};
