import type { EngineEntity, RendererConfig } from '../types/index';
export declare abstract class Renderer {
    protected _container: HTMLElement | null;
    protected _width: number;
    protected _height: number;
    protected _eventBus?: unknown;
    /** The DOM container this renderer is mounted to. */
    get container(): HTMLElement;
    /**
     * Initialize the renderer within the given container.
     * Creates the root rendering surface (SVG element, Canvas element, etc.).
     */
    init(config: RendererConfig): void;
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
    resize(width: number, height: number): void;
    /**
     * Tear down all rendering resources and DOM nodes.
     */
    destroy(): void;
    protected abstract onInit(config: RendererConfig): void;
    protected abstract onResize(width: number, height: number): void;
    protected abstract onDestroy(): void;
}
//# sourceMappingURL=Renderer.d.ts.map