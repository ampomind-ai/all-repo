import type { ScriblScriptPayload, EntityType, EasingName, ScriblEntityDef } from '@scriblmotion/core';

// ─── Layout Constants ────────────────────────────────────────────────────────
const W = 800;
const H = 500;
const MAX_N = 10;
const DURATION = MAX_N * 1000;    // 10 s, 1 s per N step

// Bar chart geometry
const BAR_W = 40;
const GAP = 10;
const CHART_BOTTOM = 420;
const CHART_MAX_H = 160;
const CHART_TOTAL_W = BAR_W * MAX_N + GAP * (MAX_N - 1);
const BAR_START_X = W / 2 - CHART_TOTAL_W / 2 + BAR_W / 2;

// Color ramp: sky → emerald → lime → yellow → orange → red → fuchsia → violet → indigo
const COLORS = [
    '#38bdf8', '#34d399', '#4ade80', '#a3e635', '#facc15',
    '#fb923c', '#f87171', '#e879f9', '#a78bfa', '#818cf8',
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function opacityKf(N: number) {
    if (N === 1)
        return [{ time: 0, value: 1 }, { time: 1000, value: 1 }, { time: 1001, value: 0 }];
    return [
        { time: (N - 1) * 1000 - 1, value: 0 },
        { time: (N - 1) * 1000, value: 1 },
        { time: N * 1000, value: 1 },
        { time: N * 1000 + 1, value: 0 },
    ];
}

function stayVisibleKf(N: number) {
    // For bars: become visible at N's moment and stay until the end of the timeline
    if (N === 1)
        return [];  // already opacity=1
    return [{ property: 'opacity', keyframes: [{ time: (N - 1) * 1000 - 1, value: 0 }, { time: (N - 1) * 1000, value: 1 }], easing: 'easeOutCubic' as EasingName }];
}

// ─── Payload ─────────────────────────────────────────────────────────────────
export const summationLessonPayload: ScriblScriptPayload = {
    version: '1.0',
    scene: {
        id: 'summation-brilliant',
        width: W,
        height: H,
        duration: DURATION,
        background: '#09090b',
        coordinateSystem: 'screen',
        frameRate: 60,
    },
    layers: [

        // ── Subtle Horizontal Grid Lines ──────────────────────────────────────
        {
            id: 'bg-layer', type: 'svg', zIndex: 0,
            entities: [
                { id: 'g1', type: 'path' as EntityType, position: { x: W / 2, y: 145 }, styles: { pathData: `M${-W / 2} 0 L${W / 2} 0`, stroke: '#1a1a1f', strokeWidth: 1, fill: 'none' } },
                { id: 'g2', type: 'path' as EntityType, position: { x: W / 2, y: 245 }, styles: { pathData: `M${-W / 2} 0 L${W / 2} 0`, stroke: '#1a1a1f', strokeWidth: 1, fill: 'none' } },
                { id: 'g3', type: 'path' as EntityType, position: { x: W / 2, y: CHART_BOTTOM }, styles: { pathData: `M${-W / 2} 0 L${W / 2} 0`, stroke: '#27272a', strokeWidth: 1.5, fill: 'none' } },
            ]
        },

        // ── Header (top-left) ─────────────────────────────────────────────────
        {
            id: 'header-layer', type: 'svg', zIndex: 1,
            entities: [
                { id: 'badge-bg', type: 'shape' as EntityType, position: { x: 92, y: 28 }, styles: { shape: 'rect', width: 118, height: 18, rx: 9, fill: '#082f49' } },
                { id: 'badge-txt', type: 'text' as EntityType, position: { x: 92, y: 28 }, styles: { content: '∑  SUMMATION', fontSize: 9, fill: '#38bdf8', textAnchor: 'middle', className: 'font-mono font-bold' } },
                { id: 'title', type: 'text' as EntityType, position: { x: 92, y: 53 }, styles: { content: 'Gauss Summation', fontSize: 20, fill: '#f4f4f5', textAnchor: 'middle', className: 'font-bold' } },
                { id: 'subtitle', type: 'text' as EntityType, position: { x: 92, y: 73 }, styles: { content: 'ΣN = N(N+1)/2', fontSize: 11, fill: '#71717a', textAnchor: 'middle', className: 'font-mono' } },
            ]
        },

        // ── General Formula Card (top-right) — SINGLE KaTeX ───────────────────
        {
            id: 'formula-card-layer', type: 'svg', zIndex: 2,
            entities: [
                // Card background
                {
                    id: 'fc-bg', type: 'shape' as EntityType, position: { x: 615, y: 64 },
                    styles: { shape: 'rect', width: 290, height: 104, rx: 14, fill: '#0d0d0f', stroke: '#27272a', strokeWidth: 1 }
                },
                // Section label
                {
                    id: 'fc-lbl', type: 'text' as EntityType, position: { x: 615, y: 14 },
                    styles: { content: 'GAUSS FORMULA', fontSize: 9, fill: '#52525b', textAnchor: 'middle', className: 'font-mono' }
                },
                // Formula line 1: Sum notation
                {
                    id: 'fc-formula-1', type: 'text' as EntityType, position: { x: 615, y: 50 },
                    styles: { content: 'Σᵢ₌₁ᴺ  i', fontSize: 22, fill: '#38bdf8', textAnchor: 'middle', className: 'font-mono font-bold' }
                },
                // Formula divider tick
                {
                    id: 'fc-divider', type: 'path' as EntityType, position: { x: 615, y: 72 },
                    styles: { pathData: 'M-80 0 L80 0', stroke: '#27272a', strokeWidth: 1, fill: 'none' }
                },
                // Formula line 2: Result
                {
                    id: 'fc-formula-2', type: 'text' as EntityType, position: { x: 615, y: 96 },
                    styles: { content: '= N(N+1) / 2', fontSize: 20, fill: '#38bdf8', textAnchor: 'middle', className: 'font-mono font-bold' }
                },
                // N result pill
                { id: 'fc-result-bg', type: 'shape' as EntityType, position: { x: 615, y: 124 }, styles: { shape: 'rect', width: 138, height: 20, rx: 10, fill: '#18181b', stroke: '#27272a', strokeWidth: 1 } },
                // Animated N= result (one text entity per N)
                ...Array.from({ length: MAX_N }, (_, i): ScriblEntityDef => {
                    const N = i + 1;
                    const total = (N * (N + 1)) / 2;
                    return {
                        id: `fc-n-${N}`, type: 'text' as EntityType,
                        position: { x: 615, y: 124 },
                        opacity: N === 1 ? 1 : 0,
                        styles: { content: `N=${N}  →  ∑=${total}`, fontSize: 10, fill: COLORS[i], textAnchor: 'middle', className: 'font-mono font-bold' },
                        animations: [{ property: 'opacity', keyframes: opacityKf(N), easing: 'linear' as EasingName }]
                    };
                }),
            ]
        },

        // ── Live Expansion Row (plain SVG text — no foreignObject stacking) ─────
        {
            id: 'equation-layer', type: 'svg', zIndex: 3,
            entities: [
                // Section label
                { id: 'eq-lbl', type: 'text' as EntityType, position: { x: W / 2, y: 150 }, styles: { content: 'CURRENT EXPANSION', fontSize: 9, fill: '#52525b', textAnchor: 'middle', className: 'font-mono' } },
                // Card
                { id: 'eq-card', type: 'shape' as EntityType, position: { x: W / 2, y: 195 }, styles: { shape: 'rect', width: 700, height: 52, rx: 12, fill: '#0d0d0f', stroke: '#27272a', strokeWidth: 1 } },

                // One styled text per N step (no KaTeX, no foreignObject)
                ...Array.from({ length: MAX_N }, (_, i): ScriblEntityDef => {
                    const N = i + 1;
                    const total = (N * (N + 1)) / 2;
                    // "1 + 2 + … + N  =  ΣTotal"
                    const terms = Array.from({ length: N }, (_, x) => x + 1).join(' + ');
                    const content = `${terms}  =  ${total}`;
                    return {
                        id: `eq-text-${N}`, type: 'text' as EntityType,
                        position: { x: W / 2, y: 195 },
                        opacity: N === 1 ? 1 : 0,
                        styles: {
                            content,
                            fontSize: 18,
                            fill: COLORS[i],
                            textAnchor: 'middle',
                            className: 'font-mono font-bold',
                        },
                        animations: [{ property: 'opacity', keyframes: opacityKf(N), easing: 'linear' as EasingName }]
                    };
                }),
            ]
        },

        // ── Bar Chart ─────────────────────────────────────────────────────────
        {
            id: 'chart-layer', type: 'svg', zIndex: 4,
            entities: (() => {
                const arr: ScriblEntityDef[] = [];

                // X-axis
                arr.push({
                    id: 'x-axis', type: 'path' as EntityType,
                    position: { x: W / 2, y: CHART_BOTTOM },
                    styles: { pathData: `M${-(CHART_TOTAL_W / 2 + 20)} 0 L${CHART_TOTAL_W / 2 + 20} 0`, stroke: '#3f3f46', strokeWidth: 1.5, fill: 'none' }
                });

                for (let i = 0; i < MAX_N; i++) {
                    const N = i + 1;
                    const x = BAR_START_X + i * (BAR_W + GAP);
                    const barH = Math.round((N / MAX_N) * CHART_MAX_H);
                    const color = COLORS[i] as string;
                    const isFirst = N === 1;

                    // Ghost (dark always-visible)
                    arr.push({ id: `bar-${N}-ghost`, type: 'shape' as EntityType, position: { x, y: CHART_BOTTOM - barH / 2 }, styles: { shape: 'rect', width: BAR_W, height: barH, rx: 5, fill: '#18181b', stroke: '#27272a', strokeWidth: 1 } });

                    // Colored fill — stays lit once activated
                    arr.push({ id: `bar-${N}-fill`, type: 'shape' as EntityType, position: { x, y: CHART_BOTTOM - barH / 2 }, opacity: isFirst ? 1 : 0, styles: { shape: 'rect', width: BAR_W, height: barH, rx: 5, fill: color }, animations: stayVisibleKf(N) });

                    // Value label
                    const labelY = barH > 22 ? CHART_BOTTOM - barH + 14 : CHART_BOTTOM - barH - 8;
                    arr.push({ id: `bar-${N}-val`, type: 'text' as EntityType, position: { x, y: labelY }, opacity: isFirst ? 1 : 0, styles: { content: String(N), fontSize: 12, fill: barH > 22 ? '#030712' : color, textAnchor: 'middle', className: 'font-mono font-bold' }, animations: stayVisibleKf(N) });

                    // X-axis label (always dim)
                    arr.push({ id: `bar-${N}-xlabel`, type: 'text' as EntityType, position: { x, y: CHART_BOTTOM + 16 }, styles: { content: String(N), fontSize: 10, fill: '#52525b', textAnchor: 'middle', className: 'font-mono' } });
                }
                return arr;
            })()
        },

        // ── Slider Row ────────────────────────────────────────────────────────
        {
            id: 'slider-layer', type: 'svg', zIndex: 5,
            entities: [
                // "N =" label
                { id: 'sl-lbl', type: 'text' as EntityType, position: { x: 28, y: CHART_BOTTOM + 48 }, styles: { content: 'N', fontSize: 14, fill: '#a1a1aa', textAnchor: 'start', className: 'font-mono' } },

                // Animated N value (color changes per step)
                ...Array.from({ length: MAX_N }, (_, i): ScriblEntityDef => {
                    const N = i + 1;
                    return {
                        id: `sl-n-${N}`, type: 'text' as EntityType,
                        position: { x: 48, y: CHART_BOTTOM + 48 },
                        opacity: N === 1 ? 1 : 0,
                        styles: { content: `= ${N}`, fontSize: 14, fill: COLORS[i], textAnchor: 'start', className: 'font-mono font-bold' },
                        animations: [{ property: 'opacity', keyframes: opacityKf(N), easing: 'linear' as EasingName }]
                    };
                }),

                // Slider
                {
                    id: 'n-slider', type: 'slider' as EntityType,
                    position: { x: W / 2 + 20, y: CHART_BOTTOM + 48 },
                    draggable: true,
                    config: { value: 1, min: 1, max: MAX_N, step: 1, linkedTimeline: true },
                    styles: {
                        width: 540, trackHeight: 6,
                        trackColor: '#27272a', fillColor: '#38bdf8',
                        handleRadius: 10, handleColor: '#FFFFFF',
                    },
                    interactions: [{ on: 'drag_move', actions: [{ type: 'seek', payload: { source: 'slider', entityId: 'n-slider' } }] }]
                }
            ]
        },

        // ── Gauss Proof Card (bottom-left) ────────────────────────────────────
        {
            id: 'proof-layer', type: 'svg', zIndex: 6,
            entities: [
                { id: 'pf-bg', type: 'shape' as EntityType, position: { x: 92, y: CHART_BOTTOM + 48 }, styles: { shape: 'rect', width: 148, height: 38, rx: 10, fill: '#0a1628', stroke: '#1d4ed8', strokeWidth: 1 } },
                { id: 'pf-lbl', type: 'text' as EntityType, position: { x: 92, y: CHART_BOTTOM + 34 }, styles: { content: 'GAUSS CHECK', fontSize: 9, fill: '#3b82f6', textAnchor: 'middle', className: 'font-mono font-bold' } },
                ...Array.from({ length: MAX_N }, (_, i): ScriblEntityDef => {
                    const N = i + 1;
                    const total = (N * (N + 1)) / 2;
                    return {
                        id: `pf-${N}`, type: 'text' as EntityType,
                        position: { x: 92, y: CHART_BOTTOM + 53 },
                        opacity: N === 1 ? 1 : 0,
                        styles: { content: `${N}×${N + 1}÷2 = ${total} ✓`, fontSize: 11, fill: COLORS[i], textAnchor: 'middle', className: 'font-mono font-bold' },
                        animations: [{ property: 'opacity', keyframes: opacityKf(N), easing: 'linear' as EasingName }]
                    };
                }),
            ]
        },
    ]
};
