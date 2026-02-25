// ─────────────────────────────────────────────────────────────────────────────
// SVGRenderer — v2.0 DOM-based SVG rendering implementation
//
// Extends the abstract Renderer from @scriblmotion/core.
// Maps EngineEntity objects to SVG DOM elements.
// v2.0: Supports UI entities (button, slider, tooltip, speech_bubble),
// pointer event forwarding, and cursor handling for draggable entities.
// ─────────────────────────────────────────────────────────────────────────────

import { Renderer } from '@scriblmotion/core';
import type { EngineEntity, RendererConfig } from '@scriblmotion/core';
import katex from 'katex';
import * as math from 'mathjs';

const SVG_NS = 'http://www.w3.org/2000/svg';

export class SVGRenderer extends Renderer {
    private _svg: SVGSVGElement | null = null;
    /** Map of entity ID → SVG element for efficient per-frame updates. */
    private readonly _elementMap = new Map<string, SVGElement>();

    /** Pointer event callbacks (set by Engine). */
    private _onPointerDown: ((x: number, y: number) => void) | null = null;
    private _onPointerMove: ((x: number, y: number) => void) | null = null;
    private _onPointerUp: ((x: number, y: number) => void) | null = null;

    // ── Pointer Event Binding ─────────────────────────────────────────────

    /** Set pointer event callbacks for the Engine's InteractionSystem. */
    setPointerCallbacks(callbacks: {
        onPointerDown: (x: number, y: number) => void;
        onPointerMove: (x: number, y: number) => void;
        onPointerUp: (x: number, y: number) => void;
    }): void {
        this._onPointerDown = callbacks.onPointerDown;
        this._onPointerMove = callbacks.onPointerMove;
        this._onPointerUp = callbacks.onPointerUp;
    }

    // ── Lifecycle ─────────────────────────────────────────────────────────

    protected onInit(config: RendererConfig): void {
        this._svg = document.createElementNS(SVG_NS, 'svg');
        this._svg.setAttribute('xmlns', SVG_NS);
        this._svg.setAttribute('width', '100%');
        this._svg.setAttribute('height', '100%');
        this._svg.setAttribute('viewBox', `0 0 ${config.width} ${config.height}`);
        this._svg.style.background = config.background;
        this._svg.style.display = 'block';
        this._svg.style.userSelect = 'none';

        if (config.className) {
            this._svg.setAttribute('class', config.className);
        }
        config.container.appendChild(this._svg);

        // Wire pointer events from SVG root
        this._svg.addEventListener('pointerdown', (e) => {
            const pt = this.svgCoords(e);
            this._onPointerDown?.(pt.x, pt.y);
        });
        this._svg.addEventListener('pointermove', (e) => {
            const pt = this.svgCoords(e);
            this._onPointerMove?.(pt.x, pt.y);
        });
        this._svg.addEventListener('pointerup', (e) => {
            const pt = this.svgCoords(e);
            this._onPointerUp?.(pt.x, pt.y);
        });
        // Capture pointer up even outside the SVG
        this._svg.addEventListener('pointerleave', (e) => {
            const pt = this.svgCoords(e);
            this._onPointerUp?.(pt.x, pt.y);
        });
    }

    protected onResize(width: number, height: number): void {
        if (!this._svg) return;
        this._svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    }

    protected onDestroy(): void {
        this._svg?.remove();
        this._svg = null;
        this._elementMap.clear();
    }

    // ── Coordinate Conversion ─────────────────────────────────────────────

    private svgCoords(e: PointerEvent): { x: number; y: number } {
        if (!this._svg) return { x: 0, y: 0 };
        const rect = this._svg.getBoundingClientRect();
        const viewBox = this._svg.viewBox.baseVal;
        const scaleX = viewBox.width / rect.width;
        const scaleY = viewBox.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY,
        };
    }

    // ── Render ─────────────────────────────────────────────────────────────

    render(entities: Map<string, EngineEntity>): void {
        if (!this._svg) return;

        const seen = new Set<string>();

        for (const [id, entity] of entities) {
            seen.add(id);

            let el = this._elementMap.get(id);
            if (!el) {
                const created = this.createElement(entity);
                if (created) {
                    this._elementMap.set(id, created);
                    el = created;
                }
            }

            if (el) {
                // Ensure proper DOM parenting
                const targetParent = entity.parentId ? this._elementMap.get(entity.parentId) : this._svg;

                if (targetParent && el.parentNode !== targetParent) {
                    targetParent.appendChild(el);
                }

                this.updateElement(el, entity);
            }
        }

        // Remove elements for entities that no longer exist
        for (const [id, el] of this._elementMap) {
            if (!seen.has(id)) {
                el.remove();
                this._elementMap.delete(id);
            }
        }
    }

    // ── Element Factory ───────────────────────────────────────────────────

    private createElement(entity: EngineEntity): SVGElement | null {
        let el: SVGElement;

        switch (entity.type) {
            case 'shape': {
                const shape = entity.styles['shape'] as string | undefined;
                if (shape === 'circle') {
                    el = document.createElementNS(SVG_NS, 'circle');
                } else if (shape === 'ellipse') {
                    el = document.createElementNS(SVG_NS, 'ellipse');
                } else if (shape === 'path') {
                    el = document.createElementNS(SVG_NS, 'path');
                } else {
                    el = document.createElementNS(SVG_NS, 'rect');
                }
                break;
            }
            case 'text': {
                el = document.createElementNS(SVG_NS, 'text');
                break;
            }
            case 'path': {
                el = document.createElementNS(SVG_NS, 'path');
                break;
            }
            case 'image': {
                el = document.createElementNS(SVG_NS, 'image');
                break;
            }
            // v2.0 — interactive UI entities
            case 'button': {
                el = this.createButtonElement(entity);
                break;
            }
            case 'slider': {
                el = this.createSliderElement(entity);
                break;
            }
            case 'tooltip': {
                el = this.createTooltipElement(entity);
                break;
            }
            case 'speech_bubble': {
                el = this.createSpeechBubbleElement(entity);
                break;
            }
            case 'math_expr': {
                el = this.createMathExprElement(entity);
                break;
            }
            case 'coordinate_plane': {
                el = this.createCoordinatePlaneElement(entity);
                break;
            }
            case 'input_field': {
                el = this.createInputFieldElement(entity);
                break;
            }
            case 'subtitle': {
                el = this.createSubtitleElement(entity);
                break;
            }
            case 'group':
            case 'character':
            case 'graph':
            case 'coordinate_plane':
            case 'ui':
            default: {
                el = document.createElementNS(SVG_NS, 'g');
                break;
            }
        }

        el.setAttribute('data-entity-id', entity.id);
        return el;
    }

    // ── UI Element Factories ──────────────────────────────────────────────

    private createSubtitleElement(_entity: EngineEntity): SVGElement {
        const g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('class', 'scribl-subtitle');

        const fo = document.createElementNS(SVG_NS, 'foreignObject');
        fo.setAttribute('class', 'subtitle-container');
        g.appendChild(fo);

        const div = document.createElement('div');
        div.className = 'scribl-subtitle-text';
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.display = 'flex';
        div.style.alignItems = 'center';
        div.style.justifyContent = 'center';
        div.style.textAlign = 'center';
        div.style.fontFamily = 'Inter, sans-serif';
        div.style.fontSize = '24px';
        div.style.fontWeight = '600';
        div.style.color = 'var(--subtitle-default, #a1a1aa)';
        div.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';

        fo.appendChild(div);
        return g;
    }

    private createButtonElement(_entity: EngineEntity): SVGElement {
        const g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('class', 'scribl-button');

        const bg = document.createElementNS(SVG_NS, 'rect');
        bg.setAttribute('class', 'btn-bg');
        g.appendChild(bg);

        const label = document.createElementNS(SVG_NS, 'text');
        label.setAttribute('class', 'btn-label');
        g.appendChild(label);

        return g;
    }

    private createSliderElement(_entity: EngineEntity): SVGElement {
        const g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('class', 'scribl-slider');

        const track = document.createElementNS(SVG_NS, 'rect');
        track.setAttribute('class', 'slider-track');
        g.appendChild(track);

        const fill = document.createElementNS(SVG_NS, 'rect');
        fill.setAttribute('class', 'slider-fill');
        g.appendChild(fill);

        const handle = document.createElementNS(SVG_NS, 'circle');
        handle.setAttribute('class', 'slider-handle');
        g.appendChild(handle);

        return g;
    }

    private createTooltipElement(_entity: EngineEntity): SVGElement {
        const g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('class', 'scribl-tooltip');

        const bg = document.createElementNS(SVG_NS, 'rect');
        bg.setAttribute('class', 'tooltip-bg');
        g.appendChild(bg);

        const text = document.createElementNS(SVG_NS, 'text');
        text.setAttribute('class', 'tooltip-text');
        g.appendChild(text);

        return g;
    }

    private createSpeechBubbleElement(_entity: EngineEntity): SVGElement {
        const g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('class', 'scribl-speech-bubble');

        const bubble = document.createElementNS(SVG_NS, 'path');
        bubble.setAttribute('class', 'bubble-shape');
        g.appendChild(bubble);

        const text = document.createElementNS(SVG_NS, 'text');
        text.setAttribute('class', 'bubble-text');
        g.appendChild(text);

        return g;
    }

    private createMathExprElement(_entity: EngineEntity): SVGElement {
        const g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('class', 'scribl-math-expr');

        const fo = document.createElementNS(SVG_NS, 'foreignObject');
        fo.setAttribute('class', 'math-container');
        g.appendChild(fo);

        return g;
    }

    private createCoordinatePlaneElement(_entity: EngineEntity): SVGElement {
        const g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('class', 'scribl-coordinate-plane');

        const gridGroup = document.createElementNS(SVG_NS, 'g');
        gridGroup.setAttribute('class', 'grid-group');
        g.appendChild(gridGroup);

        const axisGroup = document.createElementNS(SVG_NS, 'g');
        axisGroup.setAttribute('class', 'axis-group');
        g.appendChild(axisGroup);

        const seriesGroup = document.createElementNS(SVG_NS, 'g');
        seriesGroup.setAttribute('class', 'series-group');
        g.appendChild(seriesGroup);

        return g;
    }

    private createInputFieldElement(entity: EngineEntity): SVGElement {
        const g = document.createElementNS(SVG_NS, 'g');
        g.setAttribute('class', 'scribl-input-field');

        const fo = document.createElementNS(SVG_NS, 'foreignObject');
        fo.setAttribute('class', 'input-container');
        g.appendChild(fo);

        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'scribl-native-input';

        // Styling matches Ampomind @krikia/ui component design (dark mode)
        input.style.width = '100%';
        input.style.height = '100%';
        input.style.boxSizing = 'border-box';
        input.style.backgroundColor = 'rgba(24, 24, 27, 0.3)'; // bg-input/30
        input.style.border = '1px solid rgba(63, 63, 70, 0.5)'; // border-input
        input.style.borderRadius = '8px'; // rounded-lg
        input.style.color = '#e4e4e7';
        input.style.padding = '4px 10px';
        input.style.fontSize = '14px';
        input.style.fontFamily = 'Inter, sans-serif';
        input.style.outline = 'none';
        input.style.transition = 'all 0.2s ease';

        input.addEventListener('focus', () => {
            input.style.boxShadow = '0 0 0 2px rgba(99, 102, 241, 0.5)'; // ring-ring/50
            input.style.borderColor = 'rgba(99, 102, 241, 1)';
        });

        input.addEventListener('blur', () => {
            input.style.boxShadow = 'none';
            input.style.borderColor = 'rgba(63, 63, 70, 0.5)';
        });

        input.addEventListener('keydown', (e) => {
            // Stop propagation so engine timeline doesn't intercept arrow keys / space
            e.stopPropagation();
            if (e.key === 'Enter') {
                if (this._eventBus) {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (this._eventBus as any).emit('ui:input_submit', {
                        entityId: entity.id,
                        value: input.value
                    });
                }
            }
        });

        fo.appendChild(input);

        // Prevent dragging the scene when clicking inside the input
        fo.addEventListener('pointerdown', e => e.stopPropagation());

        return g;
    }

    // ── Element Update ────────────────────────────────────────────────────

    private updateElement(el: SVGElement, entity: EngineEntity): void {
        // Apply transform
        const tx = entity.position.x;
        const ty = entity.position.y;
        const sx = entity.scale.x;
        const sy = entity.scale.y;
        const rot = entity.rotation;
        el.setAttribute(
            'transform',
            `translate(${tx}, ${ty}) rotate(${rot}) scale(${sx}, ${sy})`,
        );

        // Opacity
        el.setAttribute('opacity', String(entity.opacity));

        // Cursor for draggable/interactive entities
        if (entity.draggable) {
            el.style.cursor = 'grab';
        } else if (entity.type === 'button') {
            el.style.cursor = 'pointer';
        }

        // Apply tailwind/custom classes
        if (entity.styles['className']) {
            const baseClass = el.getAttribute('data-base-class') ?? el.getAttribute('class') ?? '';
            if (!el.hasAttribute('data-base-class') && baseClass) {
                el.setAttribute('data-base-class', baseClass);
            }
            const newClass = baseClass ? `${baseClass} ${entity.styles['className']}` : String(entity.styles['className']);
            if (el.getAttribute('class') !== newClass) el.setAttribute('class', newClass);
        }

        // Type-specific updates
        switch (entity.type) {
            case 'shape':
                this.updateShape(el, entity);
                break;
            case 'text':
                this.updateText(el, entity);
                break;
            case 'path':
                this.updatePath(el, entity);
                break;
            case 'image':
                this.updateImage(el, entity);
                break;
            case 'button':
                this.updateButton(el, entity);
                break;
            case 'slider':
                this.updateSlider(el, entity);
                break;
            case 'tooltip':
                this.updateTooltip(el, entity);
                break;
            case 'speech_bubble':
                this.updateSpeechBubble(el, entity);
                break;
            case 'math_expr':
                this.updateMathExpr(el, entity);
                break;
            case 'coordinate_plane':
                this.updateCoordinatePlane(el, entity);
                break;
            case 'input_field':
                this.updateInputField(el, entity);
                break;
            case 'subtitle':
                this.updateSubtitle(el, entity);
                break;
        }

        // Apply stroke if defined (for shape/path types)
        if (entity.styles['stroke'] && entity.type !== 'path') {
            el.setAttribute('stroke', entity.styles['stroke'] as string);
            el.setAttribute('stroke-width', String(entity.styles['strokeWidth'] ?? 1));
        }
    }

    // ── Type-specific Updaters ────────────────────────────────────────────

    private updateShape(el: SVGElement, entity: EngineEntity): void {
        const shape = entity.styles['shape'] as string | undefined;

        if (shape === 'circle' && el.tagName === 'circle') {
            el.setAttribute('r', String(entity.styles['radius'] ?? 50));
            el.setAttribute('fill', (entity.styles['fill'] as string) ?? '#ffffff');
        } else if (shape === 'ellipse' && el.tagName === 'ellipse') {
            el.setAttribute('rx', String(entity.styles['rx'] ?? 50));
            el.setAttribute('ry', String(entity.styles['ry'] ?? 30));
            el.setAttribute('fill', (entity.styles['fill'] as string) ?? '#ffffff');
        } else if (shape === 'path' && el.tagName === 'path') {
            el.setAttribute('d', (entity.styles['d'] as string) ?? '');
            el.setAttribute('fill', (entity.styles['fill'] as string) ?? 'none');
        } else if (el.tagName === 'rect') {
            el.setAttribute('width', String(entity.styles['width'] ?? 100));
            el.setAttribute('height', String(entity.styles['height'] ?? 100));
            el.setAttribute('fill', (entity.styles['fill'] as string) ?? '#ffffff');
            if (entity.styles['rx']) el.setAttribute('rx', String(entity.styles['rx']));
        }
    }

    private updateText(el: SVGElement, entity: EngineEntity): void {
        el.textContent = (entity.styles['content'] as string) ?? '';
        el.setAttribute('font-size', String(entity.styles['fontSize'] ?? 16));
        el.setAttribute('fill', (entity.styles['fill'] as string) ?? '#ffffff');
        if (entity.styles['fontFamily']) {
            el.setAttribute('font-family', entity.styles['fontFamily'] as string);
        }
        if (entity.styles['textAnchor']) {
            el.setAttribute('text-anchor', entity.styles['textAnchor'] as string);
        }
        if (entity.styles['fontWeight']) {
            el.setAttribute('font-weight', String(entity.styles['fontWeight']));
        }
    }

    private updatePath(el: SVGElement, entity: EngineEntity): void {
        el.setAttribute('d', (entity.styles['pathData'] as string) ?? '');
        el.setAttribute('stroke', (entity.styles['stroke'] as string) ?? '#ffffff');
        el.setAttribute('stroke-width', String(entity.styles['strokeWidth'] ?? 2));
        el.setAttribute('fill', (entity.styles['fill'] as string) ?? 'none');
        if (entity.styles['strokeLinecap']) {
            el.setAttribute('stroke-linecap', entity.styles['strokeLinecap'] as string);
        }
    }

    private updateImage(el: SVGElement, entity: EngineEntity): void {
        el.setAttribute('href', (entity.styles['src'] as string) ?? '');
        el.setAttribute('width', String(entity.styles['width'] ?? 100));
        el.setAttribute('height', String(entity.styles['height'] ?? 100));
    }

    // ── UI Entity Updaters ────────────────────────────────────────────────

    private updateButton(el: SVGElement, entity: EngineEntity): void {
        const bg = el.querySelector('.btn-bg') as SVGRectElement | null;
        const label = el.querySelector('.btn-label') as SVGTextElement | null;
        if (!bg || !label) return;

        const w = (entity.styles['width'] as number) ?? 120;
        const h = (entity.styles['height'] as number) ?? 40;
        const rx = (entity.styles['rx'] as number) ?? 6;

        bg.setAttribute('x', String(-w / 2));
        bg.setAttribute('y', String(-h / 2));
        bg.setAttribute('width', String(w));
        bg.setAttribute('height', String(h));
        bg.setAttribute('rx', String(rx));
        bg.setAttribute('fill', (entity.styles['fill'] as string) ?? '#6366f1');
        if (entity.styles['stroke']) {
            bg.setAttribute('stroke', entity.styles['stroke'] as string);
            bg.setAttribute('stroke-width', String(entity.styles['strokeWidth'] ?? 1));
        }

        label.textContent = (entity.styles['label'] as string) ?? '';
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('dominant-baseline', 'central');
        label.setAttribute('fill', (entity.styles['color'] as string) ?? '#ffffff');
        label.setAttribute('font-size', String(entity.styles['fontSize'] ?? 14));
        label.setAttribute('font-family', (entity.styles['fontFamily'] as string) ?? 'Inter, sans-serif');
        label.setAttribute('font-weight', '600');
    }

    private updateSlider(el: SVGElement, entity: EngineEntity): void {
        const track = el.querySelector('.slider-track') as SVGRectElement | null;
        const fill = el.querySelector('.slider-fill') as SVGRectElement | null;
        const handle = el.querySelector('.slider-handle') as SVGCircleElement | null;
        if (!track || !fill || !handle) return;

        const w = (entity.styles['width'] as number) ?? 200;
        const h = (entity.styles['trackHeight'] as number) ?? 6;
        const value = (entity.config?.['value'] as number) ?? 0;
        const min = (entity.config?.['min'] as number) ?? 0;
        const max = (entity.config?.['max'] as number) ?? 100;
        const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));

        // Track
        track.setAttribute('x', String(-w / 2));
        track.setAttribute('y', String(-h / 2));
        track.setAttribute('width', String(w));
        track.setAttribute('height', String(h));
        track.setAttribute('rx', String(h / 2));
        track.setAttribute('fill', (entity.styles['trackColor'] as string) ?? '#3f3f46');

        // Fill
        fill.setAttribute('x', String(-w / 2));
        fill.setAttribute('y', String(-h / 2));
        fill.setAttribute('width', String(w * pct));
        fill.setAttribute('height', String(h));
        fill.setAttribute('rx', String(h / 2));
        fill.setAttribute('fill', (entity.styles['fillColor'] as string) ?? '#6366f1');

        // Handle
        const handleX = -w / 2 + w * pct;
        handle.setAttribute('cx', String(handleX));
        handle.setAttribute('cy', '0');
        handle.setAttribute('r', String((entity.styles['handleRadius'] as number) ?? 10));
        handle.setAttribute('fill', (entity.styles['handleColor'] as string) ?? '#ffffff');
        handle.style.cursor = 'grab';
    }

    private updateTooltip(el: SVGElement, entity: EngineEntity): void {
        const bg = el.querySelector('.tooltip-bg') as SVGRectElement | null;
        const text = el.querySelector('.tooltip-text') as SVGTextElement | null;
        if (!bg || !text) return;

        const content = (entity.styles['content'] as string) ?? '';
        const padding = 10;
        const fontSize = (entity.styles['fontSize'] as number) ?? 12;
        const estimatedWidth = content.length * fontSize * 0.6 + padding * 2;
        const h = fontSize + padding * 2;

        bg.setAttribute('x', String(-estimatedWidth / 2));
        bg.setAttribute('y', String(-h / 2));
        bg.setAttribute('width', String(estimatedWidth));
        bg.setAttribute('height', String(h));
        bg.setAttribute('rx', '4');
        bg.setAttribute('fill', (entity.styles['fill'] as string) ?? '#18181b');
        bg.setAttribute('stroke', (entity.styles['stroke'] as string) ?? '#3f3f46');
        bg.setAttribute('stroke-width', '1');

        text.textContent = content;
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', (entity.styles['color'] as string) ?? '#e4e4e7');
        text.setAttribute('font-size', String(fontSize));
        text.setAttribute('font-family', (entity.styles['fontFamily'] as string) ?? 'Inter, sans-serif');
    }

    private updateSpeechBubble(el: SVGElement, entity: EngineEntity): void {
        const bubble = el.querySelector('.bubble-shape') as SVGPathElement | null;
        const text = el.querySelector('.bubble-text') as SVGTextElement | null;
        if (!bubble || !text) return;

        const w = (entity.styles['width'] as number) ?? 180;
        const h = (entity.styles['height'] as number) ?? 60;
        const tailSize = (entity.styles['tailSize'] as number) ?? 12;
        const rx = (entity.styles['rx'] as number) ?? 10;

        // Speech bubble path with tail pointing down-left
        const halfW = w / 2;
        const halfH = h / 2;
        const d = [
            `M ${-halfW + rx} ${-halfH}`,
            `L ${halfW - rx} ${-halfH}`,
            `Q ${halfW} ${-halfH} ${halfW} ${-halfH + rx}`,
            `L ${halfW} ${halfH - rx}`,
            `Q ${halfW} ${halfH} ${halfW - rx} ${halfH}`,
            `L ${-halfW / 3 + tailSize} ${halfH}`,
            `L ${-halfW / 3} ${halfH + tailSize}`,
            `L ${-halfW / 3 - tailSize / 2} ${halfH}`,
            `L ${-halfW + rx} ${halfH}`,
            `Q ${-halfW} ${halfH} ${-halfW} ${halfH - rx}`,
            `L ${-halfW} ${-halfH + rx}`,
            `Q ${-halfW} ${-halfH} ${-halfW + rx} ${-halfH}`,
            'Z',
        ].join(' ');

        bubble.setAttribute('d', d);
        bubble.setAttribute('fill', (entity.styles['fill'] as string) ?? '#1e1e2e');
        bubble.setAttribute('stroke', (entity.styles['stroke'] as string) ?? '#3f3f46');
        bubble.setAttribute('stroke-width', String(entity.styles['strokeWidth'] ?? 1.5));

        const content = (entity.styles['content'] as string) ?? '';
        text.textContent = content;
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('dominant-baseline', 'central');
        text.setAttribute('fill', (entity.styles['color'] as string) ?? '#e4e4e7');
        text.setAttribute('font-size', String(entity.styles['fontSize'] ?? 14));
        text.setAttribute('font-family', (entity.styles['fontFamily'] as string) ?? 'Inter, sans-serif');
    }

    private updateMathExpr(el: SVGElement, entity: EngineEntity): void {
        const fo = el.querySelector('.math-container') as SVGForeignObjectElement | null;
        if (!fo) return;

        const latex = (entity.styles['latex'] as string) ?? '';
        const fontSize = (entity.styles['fontSize'] as number) ?? 24;
        const color = (entity.styles['color'] as string) ?? '#ffffff';
        // Give KaTeX enough space to render; you could also size it dynamically based on the expression itself
        const w = (entity.styles['width'] as number) ?? 600;
        const h = (entity.styles['height'] as number) ?? 150;

        fo.setAttribute('x', String(-w / 2));
        fo.setAttribute('y', String(-h / 2));
        fo.setAttribute('width', String(w));
        fo.setAttribute('height', String(h));

        const displayMode = (entity.styles['display'] as string) !== 'inline';
        try {
            const html = katex.renderToString(latex, {
                displayMode,
                throwOnError: false,
            });
            fo.innerHTML = `<div xmlns="http://www.w3.org/1999/xhtml" style="font-size: ${fontSize}px; color: ${color}; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">${html}</div>`;
        } catch (e) {
            console.error('KaTeX rendering error:', e);
        }
    }

    private updateCoordinatePlane(el: SVGElement, entity: EngineEntity): void {
        const gridGroup = el.querySelector('.grid-group') as SVGGElement | null;
        const axisGroup = el.querySelector('.axis-group') as SVGGElement | null;
        const seriesGroup = el.querySelector('.series-group') as SVGGElement | null;
        if (!gridGroup || !axisGroup || !seriesGroup) return;

        const w = (entity.styles['width'] as number) ?? 400;
        const h = (entity.styles['height'] as number) ?? 400;

        const domain = (entity.styles['domain'] as [number, number]) ?? [-10, 10];
        const range = (entity.styles['range'] as [number, number]) ?? [-10, 10];

        const gridColor = (entity.styles['gridColor'] as string) ?? '#27272a'; // zinc-800
        const axisColor = (entity.styles['axisColor'] as string) ?? '#52525b'; // zinc-600

        // Helper to map math coordinates to SVG coordinates
        const mapX = (x: number) => (x - domain[0]) / (domain[1] - domain[0]) * w - w / 2;
        const mapY = (y: number) => h / 2 - (y - range[0]) / (range[1] - range[0]) * h;

        // Draw grid
        gridGroup.innerHTML = '';
        const xMin = Math.ceil(domain[0]);
        const xMax = Math.floor(domain[1]);
        for (let x = xMin; x <= xMax; x++) {
            const line = document.createElementNS(SVG_NS, 'line');
            const px = mapX(x);
            line.setAttribute('x1', String(px));
            line.setAttribute('y1', String(-h / 2));
            line.setAttribute('x2', String(px));
            line.setAttribute('y2', String(h / 2));
            line.setAttribute('stroke', gridColor);
            line.setAttribute('stroke-width', '1');
            gridGroup.appendChild(line);
        }

        const yMin = Math.ceil(range[0]);
        const yMax = Math.floor(range[1]);
        for (let y = yMin; y <= yMax; y++) {
            const line = document.createElementNS(SVG_NS, 'line');
            const py = mapY(y);
            line.setAttribute('x1', String(-w / 2));
            line.setAttribute('y1', String(py));
            line.setAttribute('x2', String(w / 2));
            line.setAttribute('y2', String(py));
            line.setAttribute('stroke', gridColor);
            line.setAttribute('stroke-width', '1');
            gridGroup.appendChild(line);
        }

        // Draw axes
        axisGroup.innerHTML = '';
        if (domain[0] <= 0 && domain[1] >= 0) {
            const yAxis = document.createElementNS(SVG_NS, 'line');
            const px = mapX(0);
            yAxis.setAttribute('x1', String(px));
            yAxis.setAttribute('y1', String(-h / 2));
            yAxis.setAttribute('x2', String(px));
            yAxis.setAttribute('y2', String(h / 2));
            yAxis.setAttribute('stroke', axisColor);
            yAxis.setAttribute('stroke-width', '2');
            axisGroup.appendChild(yAxis);
        }
        if (range[0] <= 0 && range[1] >= 0) {
            const xAxis = document.createElementNS(SVG_NS, 'line');
            const py = mapY(0);
            xAxis.setAttribute('x1', String(-w / 2));
            xAxis.setAttribute('y1', String(py));
            xAxis.setAttribute('x2', String(w / 2));
            xAxis.setAttribute('y2', String(py));
            xAxis.setAttribute('stroke', axisColor);
            xAxis.setAttribute('stroke-width', '2');
            axisGroup.appendChild(xAxis);
        }

        // Draw series
        seriesGroup.innerHTML = '';
        const series = (entity.styles['series'] as Array<{ expr: string; color?: string }>) ?? [];

        // Scope to evaluate expressions. In real usage, InteractionSystem injects state here.
        const scope = (entity.config?.['variables'] as Record<string, number>) ?? {};

        for (const s of series) {
            if (!s.expr) continue;
            try {
                const node = math.parse(s.expr);
                const code = node.compile();

                // Generate path
                const steps = 150;
                let d = '';
                for (let i = 0; i <= steps; i++) {
                    const x = domain[0] + (domain[1] - domain[0]) * (i / steps);
                    try {
                        const y = code.evaluate({ ...scope, x });
                        const px = mapX(x);
                        const py = mapY(y);

                        if (isNaN(py) || !isFinite(py)) continue;

                        // Avoid drawing lines that jump massively outside bounding box
                        if (py < -h / 2 * 5 || py > h / 2 * 5) continue;

                        if (d === '') {
                            d += `M ${px} ${py} `;
                        } else {
                            d += `L ${px} ${py} `;
                        }
                    } catch (e) { /* ignore single point */ }
                }

                if (d) {
                    const path = document.createElementNS(SVG_NS, 'path');
                    path.setAttribute('d', d);
                    path.setAttribute('fill', 'none');
                    path.setAttribute('stroke', s.color ?? '#22d3ee');
                    path.setAttribute('stroke-width', '2');
                    path.setAttribute('stroke-linejoin', 'round');
                    seriesGroup.appendChild(path);
                }
            }
            catch (e) {
                console.error('MathJS parsing error for expr:', s.expr, e);
            }
        }
    }

    private updateInputField(el: SVGElement, entity: EngineEntity): void {
        const fo = el.querySelector('.input-container') as SVGForeignObjectElement | null;
        const input = el.querySelector('.scribl-native-input') as HTMLInputElement | null;
        if (!fo || !input) return;

        const w = (entity.styles['width'] as number) ?? 120;
        const h = (entity.styles['height'] as number) ?? 32;

        fo.setAttribute('x', String(-w / 2));
        fo.setAttribute('y', String(-h / 2));
        fo.setAttribute('width', String(w));
        fo.setAttribute('height', String(h));

        if (entity.styles['placeholder'] !== undefined) {
            input.placeholder = String(entity.styles['placeholder']);
        }
        if (entity.styles['type'] !== undefined) {
            input.type = String(entity.styles['type']);
        }

        // If engine dictates value explicitly via property mutator config
        if (entity.config && entity.config['value'] !== undefined) {
            const configValue = String(entity.config['value']);
            if (input.value !== configValue && document.activeElement !== input) {
                input.value = configValue;
            }
        }
        // Focus management (prevent stealing focus constantly)
        if (entity.config?.['focus'] && document.activeElement !== input) {
            input.focus();
        }

        input.disabled = entity.archetypeState === 'disabled';
    }

    private updateSubtitle(el: SVGElement, entity: EngineEntity): void {
        const fo = el.querySelector('.subtitle-container') as SVGForeignObjectElement | null;
        const div = el.querySelector('.scribl-subtitle-text') as HTMLDivElement | null;
        if (!fo || !div) return;

        const w = (entity.styles['width'] as number) ?? 600;
        const h = (entity.styles['height'] as number) ?? 100;

        fo.setAttribute('x', String(-w / 2));
        fo.setAttribute('y', String(-h / 2));
        fo.setAttribute('width', String(w));
        fo.setAttribute('height', String(h));

        // Read styling props if provided
        if (entity.styles['defaultColor']) {
            div.style.setProperty('--subtitle-default', entity.styles['defaultColor'] as string);
        }
        if (entity.styles['activeColor']) {
            div.style.setProperty('--subtitle-active', entity.styles['activeColor'] as string);
        }

        const fullText = (entity.styles['content'] as string) ?? '';
        const activeWord = (entity.config?.['activeWord'] as string)?.toLowerCase();

        // Avoid re-rendering DOM unnecessarily if text hasn't changed
        // We can build the innerHTML and compare.
        const words = fullText.split(/\s+/);
        let htmlBuffer = '';

        for (const w of words) {
            // Very simple exact match or stripped match
            const stripped = w.replace(/[.,!?]/g, '').toLowerCase();
            const isActive = activeWord && (stripped === activeWord || activeWord.includes(stripped));

            if (isActive) {
                htmlBuffer += `<span style="color: var(--subtitle-active, #6366f1); transform: scale(1.05); display: inline-block; transition: all 0.1s ease;">${w}</span> `;
            } else {
                htmlBuffer += `<span>${w}</span> `;
            }
        }

        if (div.innerHTML !== htmlBuffer) {
            div.innerHTML = htmlBuffer.trim();
        }
    }
}
