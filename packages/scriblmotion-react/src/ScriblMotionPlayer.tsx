import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useScriblMotion } from './useScriblMotion';
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
    /** Additional CSS classes for the inner rendering element (e.g., SVG) */
    svgClassName?: string;
    /** 
     * Callback whenever a recognizable feedback/interaction event occurs 
     * (e.g. user clicked a specific button)
     */
    onFeedback?: (event: { type: string; payload: any }) => void;
}

/**
 * A ready-to-use React component that embeds a ScriblMotion engine.
 */
export const ScriblMotionPlayer = forwardRef<
    UseScriblMotionReturn,
    ScriblMotionPlayerProps
>(({ payload, autoPlay = true, rendererFactory, className = '', svgClassName = '', onFeedback }, ref) => {

    const engineControls = useScriblMotion({ autoPlay, rendererFactory, svgClassName });
    const { containerRef, loadScene, engine, state, error } = engineControls;

    // Expose engine controls to parent via ref if needed
    useImperativeHandle(ref, () => engineControls, [engineControls]);

    // Load scene whenever the payload changes
    useEffect(() => {
        loadScene(payload);
    }, [loadScene, payload]);

    // Listen to engine events for feedback
    useEffect(() => {
        if (!engine || !onFeedback) return;

        // For example, listen to all interaction actions that might bubble up
        // Currently the engine dispatches some global events we can hook into.

        // Subscribe to engine's event bus if it's accessible or any global events
        // engine.eventBus?.on('action:executed', handleInteraction);

        return () => {
            // Cleanup listeners
            // engine.eventBus?.off('action:executed', handleInteraction);
        };
    }, [engine, onFeedback]);

    return (
        <div
            className={`scriblmotion-player ${className}`}
            style={{ position: 'relative', width: '100%', height: '100%' }}
        >
            <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            {state === 'error' && (
                <div style={{ position: 'absolute', top: 0, left: 0, color: 'red', background: 'rgba(255,0,0,0.1)', padding: '1rem' }}>
                    Error: {error}
                </div>
            )}
        </div>
    );
});

ScriblMotionPlayer.displayName = 'ScriblMotionPlayer';
