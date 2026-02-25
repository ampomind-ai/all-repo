import { Renderer } from '@scriblmotion/core';
import type { EngineEntity, RendererConfig } from '@scriblmotion/core';
export declare class SVGRenderer extends Renderer {
    private _svg;
    /** Map of entity ID → SVG element for efficient per-frame updates. */
    private readonly _elementMap;
    /** Pointer event callbacks (set by Engine). */
    private _onPointerDown;
    private _onPointerMove;
    private _onPointerUp;
    /** Set pointer event callbacks for the Engine's InteractionSystem. */
    setPointerCallbacks(callbacks: {
        onPointerDown: (x: number, y: number) => void;
        onPointerMove: (x: number, y: number) => void;
        onPointerUp: (x: number, y: number) => void;
    }): void;
    protected onInit(config: RendererConfig): void;
    protected onResize(width: number, height: number): void;
    protected onDestroy(): void;
    private svgCoords;
    render(entities: Map<string, EngineEntity>): void;
    private createElement;
    private createSubtitleElement;
    private createButtonElement;
    private createSliderElement;
    private createTooltipElement;
    private createSpeechBubbleElement;
    private createMathExprElement;
    private createCoordinatePlaneElement;
    private createInputFieldElement;
    private updateElement;
    private updateShape;
    private updateText;
    private updatePath;
    private updateImage;
    private updateButton;
    private updateSlider;
    private updateTooltip;
    private updateSpeechBubble;
    private updateMathExpr;
    private updateCoordinatePlane;
    private updateInputField;
    private updateSubtitle;
}
//# sourceMappingURL=SVGRenderer.d.ts.map