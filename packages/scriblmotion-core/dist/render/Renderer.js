// ─────────────────────────────────────────────────────────────────────────────
// Renderer — Abstract base class
// All concrete renderers (SVG, Canvas, Hybrid) extend this contract.
// ─────────────────────────────────────────────────────────────────────────────
export class Renderer {
    constructor() {
        this._container = null;
        this._width = 0;
        this._height = 0;
    }
    /** The DOM container this renderer is mounted to. */
    get container() {
        if (!this._container)
            throw new Error('Renderer not initialized.');
        return this._container;
    }
    /**
     * Initialize the renderer within the given container.
     * Creates the root rendering surface (SVG element, Canvas element, etc.).
     */
    init(config) {
        this._container = config.container;
        this._width = config.width;
        this._height = config.height;
        this._eventBus = config.eventBus;
        this.onInit(config);
    }
    /**
     * Resize the rendering surface.
     */
    resize(width, height) {
        this._width = width;
        this._height = height;
        this.onResize(width, height);
    }
    /**
     * Tear down all rendering resources and DOM nodes.
     */
    destroy() {
        this.onDestroy();
        this._container = null;
    }
}
//# sourceMappingURL=Renderer.js.map