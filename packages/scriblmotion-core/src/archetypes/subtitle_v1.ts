// ─────────────────────────────────────────────────────────────────────────────
// subtitle_v1 — Synchronized Subtitle Archetype
//
// Fixed-position text entity synced to AudioSystem word boundary events.
// Highlights the current word mid-sentence for karaoke-style subtitles.
// ─────────────────────────────────────────────────────────────────────────────

import type { ArchetypeDef } from '../types/index';

export const subtitle_v1: ArchetypeDef = {
    id: 'subtitle_v1',
    version: '1.0.0',
    category: 'ui',
    rig: {
        root: {
            id: 'root',
            parentId: null,
            localPosition: { x: 0, y: 0 },
            localRotation: 0,
            rotationMin: 0,
            rotationMax: 0,
            children: [],
            visual: {
                shape: 'rect',
                width: 600,
                height: 60,
                fill: 'transparent',
            },
        },
    },
    states: {
        idle: { id: 'idle' },
        visible: {
            id: 'visible',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 300 },
            ],
        },
        hidden: {
            id: 'hidden',
            enter: [
                { property: 'opacity', keyframes: [{ time: 0, value: 1 }, { time: 1, value: 0 }], easing: 'easeInCubic', duration: 200 },
            ],
        },
    },
    defaultState: 'idle',
    bounds: { min: { x: -300, y: -30 }, max: { x: 300, y: 30 } },
    anchors: { center: { x: 0, y: 0 } },
    animationPresets: {
        fadeIn: [
            { property: 'opacity', keyframes: [{ time: 0, value: 0 }, { time: 1, value: 1 }], easing: 'easeOutCubic', duration: 300 },
        ],
    },
    appearanceOverrides: ['content', 'defaultColor', 'activeColor', 'fontSize', 'fontFamily', 'width', 'height'],
    metadata: {
        author: 'AmpoMind',
        description: 'Karaoke-style subtitle entity synced to audio word boundary events.',
        tags: ['ui', 'subtitle', 'audio', 'lip-sync'],
    },
};
