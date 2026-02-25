import type { ScriblScriptPayload } from '@scriblmotion/core';

export const blockchainLessonPayload: ScriblScriptPayload = {
    version: '1.0',
    scene: {
        id: 'blockchain-basics',
        width: 800,
        height: 500,
        duration: 60000,
        background: 'transparent',
        coordinateSystem: 'screen',
        frameRate: 60,
    },
    layers: [
        // ── Background & Grid ───────────────────────────────────────────────
        {
            id: 'bg-layer',
            type: 'svg',
            zIndex: 0,
            entities: [
                // Subtle dot grid simulation
                {
                    id: 'grid-pattern',
                    type: 'path',
                    position: { x: 400, y: 250 },
                    styles: {
                        pathData: 'M-400 -250 L400 -250 M-400 -150 L400 -150 M-400 -50 L400 -50 M-400 50 L400 50 M-400 150 L400 150 M-400 250 L400 250',
                        stroke: '#18181b', // zinc-900 (ultra faint)
                        strokeWidth: 1,
                        fill: 'none',
                    },
                },
            ],
        },

        // ── Typography / Header ─────────────────────────────────────────────
        {
            id: 'header-layer',
            type: 'svg',
            zIndex: 1,
            entities: [
                {
                    id: 'header-title',
                    type: 'text',
                    position: { x: 400, y: 60 },
                    styles: {
                        content: 'ANATOMY OF A BLOCKCHAIN',
                        fontSize: 14,
                        fill: '#e4e4e7', // zinc-200
                        className: 'font-mono font-bold',
                        textAnchor: 'middle',
                    },
                },
                {
                    id: 'header-subtitle',
                    type: 'text',
                    position: { x: 400, y: 80 },
                    styles: {
                        content: 'Each block cryptographically links to the previous, forming an immutable chain.',
                        fontSize: 12,
                        fill: '#a1a1aa', // zinc-400
                        className: 'font-sans font-normal',
                        textAnchor: 'middle',
                    },
                },
            ],
        },

        // ── Connectors (Lines) ──────────────────────────────────────────────
        {
            id: 'connectors-layer',
            type: 'svg',
            zIndex: 2,
            entities: [
                // 1 -> 2
                {
                    id: 'link-1-2',
                    type: 'path',
                    position: { x: 275, y: 250 },
                    styles: {
                        pathData: 'M -35 0 L 35 0',
                        stroke: '#38bdf8', // sky-400
                        strokeWidth: 2,
                        strokeDasharray: '4 4',
                        fill: 'none',
                    },
                    animations: [
                        {
                            property: 'opacity',
                            keyframes: [{ time: 0, value: 0 }, { time: 800, value: 1 }],
                            easing: 'easeOutCubic',
                        },
                    ],
                },
                // 2 -> 3
                {
                    id: 'link-2-3',
                    type: 'path',
                    position: { x: 525, y: 250 },
                    styles: {
                        pathData: 'M -35 0 L 35 0',
                        stroke: '#10b981', // emerald-500
                        strokeWidth: 2,
                        strokeDasharray: '4 4',
                        fill: 'none',
                    },
                    opacity: 0, // Hidden initially
                },
            ],
        },

        // ── Blocks ───────────────────────────────────────────────────────────
        {
            id: 'blocks-layer',
            type: 'svg',
            zIndex: 3,
            entities: [
                // ── BLOCK 1 ────────────────────────────────────────────────────
                {
                    id: 'b1-group',
                    type: 'group',
                    position: { x: 150, y: 250 },
                    animations: [
                        { property: 'position.y', keyframes: [{ time: 0, value: 230 }, { time: 500, value: 250 }], easing: 'easeOutCubic' },
                        { property: 'opacity', keyframes: [{ time: 0, value: 0 }, { time: 500, value: 1 }], easing: 'easeOutCubic' },
                    ],
                    children: [
                        { id: 'b1-bg', type: 'shape', position: { x: 0, y: 0 }, styles: { shape: 'rect', width: 180, height: 140, rx: 12, fill: '#18181b', stroke: '#27272a', strokeWidth: 1 } },
                        { id: 'b1-title', type: 'text', position: { x: 0, y: -45 }, styles: { content: 'GENESIS BLOCK', fontSize: 10, fill: '#38bdf8', className: 'font-mono font-bold', textAnchor: 'middle' } },
                        { id: 'b1-div', type: 'shape', position: { x: 0, y: -30 }, styles: { shape: 'rect', width: 150, height: 1, fill: '#27272a' } },
                        { id: 'b1-l1', type: 'text', position: { x: -70, y: -10 }, styles: { content: 'DATA', fontSize: 9, fill: '#71717a', className: 'font-mono', textAnchor: 'start' } },
                        { id: 'b1-v1', type: 'text', position: { x: 70, y: -10 }, styles: { content: 'reward=50', fontSize: 10, fill: '#e4e4e7', className: 'font-sans', textAnchor: 'end' } },
                        { id: 'b1-l2', type: 'text', position: { x: -70, y: 15 }, styles: { content: 'PREV', fontSize: 9, fill: '#71717a', className: 'font-mono', textAnchor: 'start' } },
                        { id: 'b1-v2', type: 'text', position: { x: 70, y: 15 }, styles: { content: '00000000', fontSize: 10, fill: '#52525b', className: 'font-mono', textAnchor: 'end' } },
                        { id: 'b1-l3', type: 'text', position: { x: -70, y: 40 }, styles: { content: 'HASH', fontSize: 9, fill: '#71717a', className: 'font-mono', textAnchor: 'start' } },
                        { id: 'b1-v3', type: 'text', position: { x: 70, y: 40 }, styles: { content: '0xA1B2C3D4', fontSize: 10, fill: '#38bdf8', className: 'font-mono font-bold', textAnchor: 'end' } },
                    ]
                },

                // ── BLOCK 2 ────────────────────────────────────────────────────
                {
                    id: 'b2-group',
                    type: 'group',
                    position: { x: 400, y: 250 },
                    animations: [
                        { property: 'position.y', keyframes: [{ time: 0, value: 230 }, { time: 500, value: 250 }], easing: 'easeOutCubic', delay: 200 },
                        { property: 'opacity', keyframes: [{ time: 0, value: 0 }, { time: 500, value: 1 }], easing: 'easeOutCubic', delay: 200 },
                    ],
                    children: [
                        { id: 'b2-bg', type: 'shape', position: { x: 0, y: 0 }, styles: { shape: 'rect', width: 180, height: 140, rx: 12, fill: '#18181b', stroke: '#27272a', strokeWidth: 1 } },
                        { id: 'b2-title', type: 'text', position: { x: 0, y: -45 }, styles: { content: 'BLOCK #2', fontSize: 10, fill: '#38bdf8', className: 'font-mono font-bold', textAnchor: 'middle' } },
                        { id: 'b2-div', type: 'shape', position: { x: 0, y: -30 }, styles: { shape: 'rect', width: 150, height: 1, fill: '#27272a' } },
                        { id: 'b2-l1', type: 'text', position: { x: -70, y: -10 }, styles: { content: 'DATA', fontSize: 9, fill: '#71717a', className: 'font-mono', textAnchor: 'start' } },
                        { id: 'b2-v1', type: 'text', position: { x: 70, y: -10 }, styles: { content: 'alice>bob: 5', fontSize: 10, fill: '#e4e4e7', className: 'font-sans', textAnchor: 'end' } },
                        { id: 'b2-l2', type: 'text', position: { x: -70, y: 15 }, styles: { content: 'PREV', fontSize: 9, fill: '#71717a', className: 'font-mono', textAnchor: 'start' } },
                        { id: 'b2-v2', type: 'text', position: { x: 70, y: 15 }, styles: { content: '0xA1B2C3D4', fontSize: 10, fill: '#52525b', className: 'font-mono', textAnchor: 'end' } },
                        { id: 'b2-l3', type: 'text', position: { x: -70, y: 40 }, styles: { content: 'HASH', fontSize: 9, fill: '#71717a', className: 'font-mono', textAnchor: 'start' } },
                        { id: 'b2-v3', type: 'text', position: { x: 70, y: 40 }, styles: { content: '0x99F8E7D6', fontSize: 10, fill: '#38bdf8', className: 'font-mono font-bold', textAnchor: 'end' } },
                    ]
                },

                // ── BLOCK 3 (Pending) ──────────────────────────────────────────
                {
                    id: 'b3-group',
                    type: 'group',
                    position: { x: 650, y: 250 },
                    animations: [
                        { property: 'position.y', keyframes: [{ time: 0, value: 230 }, { time: 500, value: 250 }], easing: 'easeOutCubic', delay: 400 },
                        { property: 'opacity', keyframes: [{ time: 0, value: 0 }, { time: 500, value: 0.6 }], easing: 'easeOutCubic', delay: 400 },
                    ],
                    children: [
                        { id: 'b3-bg', type: 'shape', position: { x: 0, y: 0 }, styles: { shape: 'rect', width: 180, height: 140, rx: 12, fill: '#18181b', stroke: '#52525b', strokeWidth: 1, className: 'stroke-dashed' } },
                        { id: 'b3-title', type: 'text', position: { x: 0, y: -45 }, styles: { content: 'PENDING BLOCK #3', fontSize: 10, fill: '#71717a', className: 'font-mono font-bold', textAnchor: 'middle' } },
                        { id: 'b3-div', type: 'shape', position: { x: 0, y: -30 }, styles: { shape: 'rect', width: 150, height: 1, fill: '#27272a' } },
                        { id: 'b3-l1', type: 'text', position: { x: -70, y: -10 }, styles: { content: 'DATA', fontSize: 9, fill: '#71717a', className: 'font-mono', textAnchor: 'start' } },
                        { id: 'b3-v1', type: 'text', position: { x: 70, y: -10 }, styles: { content: 'bob>charlie: 2', fontSize: 10, fill: '#a1a1aa', className: 'font-sans', textAnchor: 'end' } },
                        { id: 'b3-l2', type: 'text', position: { x: -70, y: 15 }, styles: { content: 'PREV', fontSize: 9, fill: '#71717a', className: 'font-mono', textAnchor: 'start' } },
                        { id: 'b3-v2', type: 'text', position: { x: 70, y: 15 }, styles: { content: '??????????', fontSize: 10, fill: '#52525b', className: 'font-mono', textAnchor: 'end' } },
                        { id: 'b3-l3', type: 'text', position: { x: -70, y: 40 }, styles: { content: 'HASH', fontSize: 9, fill: '#71717a', className: 'font-mono', textAnchor: 'start' } },
                        { id: 'b3-v3', type: 'text', position: { x: 70, y: 40 }, styles: { content: '??????????', fontSize: 10, fill: '#52525b', className: 'font-mono font-bold', textAnchor: 'end' } },
                    ]
                },
            ],
        },

        // ── Controls Layer ───────────────────────────────────────────────────
        {
            id: 'ui-layer',
            type: 'svg',
            zIndex: 4,
            entities: [
                // Info text at bottom
                {
                    id: 'info-text',
                    type: 'text',
                    position: { x: 400, y: 400 },
                    styles: {
                        content: 'Pending block waiting to be mined. A valid hash must be calculated to join the chain.',
                        fontSize: 12,
                        fill: '#a1a1aa',
                        fontFamily: 'Inter, sans-serif',
                        textAnchor: 'middle',
                    },
                },

                // Interactive Mine Button
                {
                    id: 'mine-btn',
                    type: 'button',
                    position: { x: 650, y: 360 }, // Centered right under Block 3
                    styles: {
                        width: 120,
                        height: 36,
                        rx: 18,
                        fill: '#09090b',
                        stroke: '#10b981', // emerald
                        strokeWidth: 1.5,
                        color: '#10b981',
                        label: 'Mine Block',
                        fontSize: 12,
                        fontFamily: 'Inter, sans-serif',
                    },
                    interactions: [
                        {
                            on: 'click',
                            actions: [
                                // Update Block 3 visuals to 'mined' state
                                { type: 'set_property', payload: { target: 'b3-group', property: 'opacity', value: 1 } },
                                { type: 'set_property', payload: { target: 'b3-bg', property: 'styles.fill', value: '#18181b' } },
                                { type: 'set_property', payload: { target: 'b3-bg', property: 'styles.stroke', value: '#10b981' } }, // glow green
                                { type: 'set_property', payload: { target: 'b3-bg', property: 'styles.strokeDasharray', value: 'none' } },
                                { type: 'set_property', payload: { target: 'b3-title', property: 'styles.content', value: 'BLOCK #3' } },
                                { type: 'set_property', payload: { target: 'b3-title', property: 'styles.fill', value: '#10b981' } },

                                // Reveal data and hash
                                { type: 'set_property', payload: { target: 'b3-l1', property: 'styles.fill', value: '#71717a' } },
                                { type: 'set_property', payload: { target: 'b3-v1', property: 'styles.fill', value: '#e4e4e7' } },
                                { type: 'set_property', payload: { target: 'b3-l2', property: 'styles.fill', value: '#71717a' } },
                                { type: 'set_property', payload: { target: 'b3-v2', property: 'styles.fill', value: '#a1a1aa' } },
                                { type: 'set_property', payload: { target: 'b3-l3', property: 'styles.fill', value: '#71717a' } },
                                { type: 'set_property', payload: { target: 'b3-v3', property: 'styles.content', value: '0xI9J0K1L2' } },
                                { type: 'set_property', payload: { target: 'b3-v3', property: 'styles.fill', value: '#10b981' } },

                                // Show connector line
                                { type: 'set_property', payload: { target: 'link-2-3', property: 'opacity', value: 1 } },

                                // Update info text
                                { type: 'set_property', payload: { target: 'info-text', property: 'styles.content', value: '✓ Block #3 successfully mined and cryptographically linked!' } },
                                { type: 'set_property', payload: { target: 'info-text', property: 'styles.fill', value: '#10b981' } },

                                // Disable button visual
                                { type: 'set_property', payload: { target: 'mine-btn', property: 'styles.stroke', value: '#27272a' } },
                                { type: 'set_property', payload: { target: 'mine-btn', property: 'styles.color', value: '#52525b' } },
                                { type: 'set_property', payload: { target: 'mine-btn', property: 'styles.label', value: 'Mined' } },
                            ],
                        },
                    ],
                },
            ],
        },
    ],
};
