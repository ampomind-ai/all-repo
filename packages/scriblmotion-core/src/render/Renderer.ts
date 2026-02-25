// ─────────────────────────────────────────────────────────────────────────────
// Renderer — Abstract base class
// All concrete renderers (SVG, Canvas, Hybrid) extend this contract.
// ─────────────────────────────────────────────────────────────────────────────

import type { EngineEntity, RendererConfig } from '../types/index';

export abstract class Renderer {
    protected _container: HTMLElement | null = null;
    protected _width: number = 0;
    protected _height: number = 0;
    protected _eventBus?: unknown;

    /** The DOM container this renderer is mounted to. */
    get container(): HTMLElement {
        if (!this._container) throw new Error('Renderer not initialized.');
        return this._container;
    }

    /**
     * Initialize the renderer within the given container.
     * Creates the root rendering surface (SVG element, Canvas element, etc.).
     */
    init(config: RendererConfig): void {
        this._container = config.container;
        this._width = config.width;
        this._height = config.height;
        this._eventBus = config.eventBus;
        this.onInit(config);
    }

    /**
     * Render a frame. Called once per tick by the Engine.
     * Receives the full entity map for the active scene.
     */
    abstract render(entities: Map<string, EngineEntity>): void;

    /**
     * Set pointer event callbacks for the Engine's InteractionSystem.
     * Concrete renderers must implement this and attach native listeners.
     */
    abstract setPointerCallbacks(callbacks: {
        onPointerDown: (x: number, y: number) => void;
        onPointerMove: (x: number, y: number) => void;
        onPointerUp: (x: number, y: number) => void;
    }): void;

    /**
     * Resize the rendering surface.
     */
    resize(width: number, height: number): void {
        this._width = width;
        this._height = height;
        this.onResize(width, height);
    }

    /**
     * Tear down all rendering resources and DOM nodes.
     */
    destroy(): void {
        this.onDestroy();
        this._container = null;
    }

    // ── Lifecycle hooks for subclasses ─────────────────────────────────────
    protected abstract onInit(config: RendererConfig): void;
    protected abstract onResize(width: number, height: number): void;
    protected abstract onDestroy(): void;
}
