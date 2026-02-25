import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, forwardRef, useImperativeHandle } from 'react';
import { useScriblMotion } from './useScriblMotion';
/**
 * A ready-to-use React component that embeds a ScriblMotion engine.
 */
export const ScriblMotionPlayer = forwardRef(({ payload, autoPlay = true, rendererFactory, className = '', onFeedback }, ref) => {
    const engineControls = useScriblMotion({ autoPlay, rendererFactory });
    const { containerRef, loadScene, engine, state, error } = engineControls;
    // Expose engine controls to parent via ref if needed
    useImperativeHandle(ref, () => engineControls, [engineControls]);
    // Load scene whenever the payload changes
    useEffect(() => {
        loadScene(payload);
    }, [loadScene, payload]);
    // Listen to engine events for feedback
    useEffect(() => {
        if (!engine || !onFeedback)
            return;
        // For example, listen to all interaction actions that might bubble up
        // Currently the engine dispatches some global events we can hook into.
        // Subscribe to engine's event bus if it's accessible or any global events
        // engine.eventBus?.on('action:executed', handleInteraction);
        return () => {
            // Cleanup listeners
            // engine.eventBus?.off('action:executed', handleInteraction);
        };
    }, [engine, onFeedback]);
    return (_jsxs("div", { className: `scriblmotion-player ${className}`, style: { position: 'relative', width: '100%', height: '100%' }, children: [_jsx("div", { ref: containerRef, style: { width: '100%', height: '100%' } }), state === 'error' && (_jsxs("div", { style: { position: 'absolute', top: 0, left: 0, color: 'red', background: 'rgba(255,0,0,0.1)', padding: '1rem' }, children: ["Error: ", error] }))] }));
});
ScriblMotionPlayer.displayName = 'ScriblMotionPlayer';
//# sourceMappingURL=ScriblMotionPlayer.js.map