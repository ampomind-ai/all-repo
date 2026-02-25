// ─────────────────────────────────────────────────────────────────────────────
// CanvasRenderer — Retained-mode Canvas 2D rendering implementation
// Extends the abstract Renderer from @scriblmotion/core.
// Maintains a draw list and batch-renders per frame.
// ─────────────────────────────────────────────────────────────────────────────

import { Renderer } from '@scriblmotion/core';
import type { EngineEntity, RendererConfig } from '@scriblmotion/core';

/** Internal draw command for the retained draw list. */
interface DrawCommand {
    entityId: string;
    zIndex: number;
    draw: (ctx: CanvasRenderingContext2D) => void;
}

export class CanvasRenderer extends Renderer {
    private _canvas: HTMLCanvasElement | null = null;
    private _ctx: CanvasRenderingContext2D | null = null;
    private _drawList: DrawCommand[] = [];
    private _background: string = '#000000';

    // ── Lifecycle ──────────────────────────────────────────────────────────

    protected onInit(config: RendererConfig): void {
        this._canvas = document.createElement('canvas');
        this._canvas.width = config.width;
        this._canvas.height = config.height;
        this._canvas.style.display = 'block';
        this._background = config.background;

        const ctx = this._canvas.getContext('2d');
        if (!ctx) throw new Error('Failed to acquire Canvas 2D context.');
        this._ctx = ctx;

        config.container.appendChild(this._canvas);
    }

    protected onResize(width: number, height: number): void {
        if (!this._canvas) return;
        this._canvas.width = width;
        this._canvas.height = height;
    }

    protected onDestroy(): void {
        this._canvas?.remove();
        this._canvas = null;
        this._ctx = null;
        this._drawList = [];
    }

    // ── Render ─────────────────────────────────────────────────────────────

    render(entities: Map<string, EngineEntity>): void {
        if (!this._ctx || !this._canvas) return;

        const ctx = this._ctx;
        const w = this._canvas.width;
        const h = this._canvas.height;

        // 1. Build draw list
        this._drawList.length = 0;
        for (const entity of entities.values()) {
            const cmd = this.buildDrawCommand(entity);
            if (cmd) this._drawList.push(cmd);
        }

        // 2. Sort by z-index for correct paint order
        this._drawList.sort((a, b) => a.zIndex - b.zIndex);

        // 3. Clear
        ctx.fillStyle = this._background;
        ctx.fillRect(0, 0, w, h);

        // 4. Execute draw list
        for (const cmd of this._drawList) {
            cmd.draw(ctx);
        }
    }

    // ── Draw Command Factory ───────────────────────────────────────────────

    private buildDrawCommand(entity: EngineEntity): DrawCommand | null {
        const { position, scale, rotation, opacity, styles, type, id, zIndex } = entity;

        return {
            entityId: id,
            zIndex,
            draw: (ctx: CanvasRenderingContext2D) => {
                ctx.save();

                // Transform
                ctx.translate(position.x, position.y);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.scale(scale.x, scale.y);
                ctx.globalAlpha = opacity;

                switch (type) {
                    case 'shape':
                        this.drawShape(ctx, styles);
                        break;
                    case 'text':
                        this.drawText(ctx, styles);
                        break;
                    case 'path':
                        this.drawPath(ctx, styles);
                        break;
                    case 'image':
                        // Image drawing would require a texture cache.
                        // Placeholder for production implementation.
                        break;
                    default:
                        // Groups, characters, UI, graph — rendered through their children.
                        break;
                }

                ctx.restore();
            },
        };
    }

    // ── Primitive Draw Methods ─────────────────────────────────────────────

    private drawShape(ctx: CanvasRenderingContext2D, styles: Record<string, unknown>): void {
        const shape = styles['shape'] as string | undefined;
        ctx.fillStyle = (styles['fill'] as string) ?? '#ffffff';

        if (shape === 'circle') {
            const radius = (styles['radius'] as number) ?? 50;
            ctx.beginPath();
            ctx.arc(0, 0, radius, 0, Math.PI * 2);
            ctx.fill();
        } else {
            const w = (styles['width'] as number) ?? 100;
            const h = (styles['height'] as number) ?? 100;
            ctx.fillRect(-w / 2, -h / 2, w, h);
        }

        // Optional stroke
        if (styles['stroke']) {
            ctx.strokeStyle = styles['stroke'] as string;
            ctx.lineWidth = (styles['strokeWidth'] as number) ?? 1;
            ctx.stroke();
        }
    }

    private drawText(ctx: CanvasRenderingContext2D, styles: Record<string, unknown>): void {
        const content = (styles['content'] as string) ?? '';
        const fontSize = (styles['fontSize'] as number) ?? 16;
        const fontFamily = (styles['fontFamily'] as string) ?? 'sans-serif';
        ctx.fillStyle = (styles['fill'] as string) ?? '#ffffff';
        ctx.font = `${fontSize}px ${fontFamily}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(content, 0, 0);
    }

    private drawPath(ctx: CanvasRenderingContext2D, styles: Record<string, unknown>): void {
        const pathData = (styles['pathData'] as string) ?? '';
        if (!pathData) return;

        ctx.strokeStyle = (styles['stroke'] as string) ?? '#ffffff';
        ctx.lineWidth = (styles['strokeWidth'] as number) ?? 2;

        // Use Path2D for efficient SVG path rendering on Canvas
        const path = new Path2D(pathData);
        ctx.stroke(path);
    }
}
