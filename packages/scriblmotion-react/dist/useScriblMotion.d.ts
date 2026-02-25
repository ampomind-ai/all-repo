import { Engine } from '@scriblmotion/core';
import type { ScriblScriptPayload, Renderer } from '@scriblmotion/core';
export interface UseScriblMotionOptions {
    /** Auto-play animation on load. Default: true */
    autoPlay?: boolean;
    /**
     * Factory that creates a Renderer instance. Called once per scene load.
     * Defaults to creating a new SVGRenderer — the caller can override this
     * to provide a CanvasRenderer or hybrid renderer instead.
     *
     * @example
     * import { SVGRenderer } from '@scriblmotion/svg';
     * useScriblMotion({ rendererFactory: () => new SVGRenderer() });
     */
    rendererFactory?: () => Renderer;
}
export interface UseScriblMotionReturn {
    /** Ref to attach to the container div */
    containerRef: React.RefObject<HTMLDivElement | null>;
    /** Load a ScriblScript payload into the engine */
    loadScene: (payload: ScriblScriptPayload) => void;
    /** Play the animation */
    play: () => void;
    /** Pause the animation */
    pause: () => void;
    /** Stop and reset to time 0 */
    stop: () => void;
    /** Seek to a specific time in ms */
    seek: (time: number) => void;
    /** Current engine state */
    state: 'idle' | 'playing' | 'paused' | 'error';
    /** Error message if state is 'error' */
    error: string | null;
    /** The running engine instance */
    engine: Engine | null;
}
export declare function useScriblMotion(options?: UseScriblMotionOptions): UseScriblMotionReturn;
//# sourceMappingURL=useScriblMotion.d.ts.map