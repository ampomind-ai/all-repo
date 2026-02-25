import type { UseScriblMotionReturn } from './useScriblMotion';
import type { ScriblScriptPayload, Renderer } from '@scriblmotion/core';
export interface ScriblMotionPlayerProps {
    /** The ScriblScript payload to run */
    payload: ScriblScriptPayload;
    /** If true, the animation plays automatically */
    autoPlay?: boolean;
    /**
     * Optional custom renderer factory.
     * Defaults to creating an SVGRenderer internally.
     */
    rendererFactory?: () => Renderer;
    /** Additional CSS classes for the container */
    className?: string;
    /**
     * Callback whenever a recognizable feedback/interaction event occurs
     * (e.g. user clicked a specific button)
     */
    onFeedback?: (event: {
        type: string;
        payload: any;
    }) => void;
}
/**
 * A ready-to-use React component that embeds a ScriblMotion engine.
 */
export declare const ScriblMotionPlayer: import("react").ForwardRefExoticComponent<ScriblMotionPlayerProps & import("react").RefAttributes<UseScriblMotionReturn>>;
//# sourceMappingURL=ScriblMotionPlayer.d.ts.map