// ─────────────────────────────────────────────────────────────────────────────
// useScriblMotion — React hook for mounting and controlling the engine
//
// SVGRenderer is NOT imported here to avoid cross-package resolution issues in
// Next.js/Turbopack. Instead, the caller (or the default factory below) is
// responsible for providing a Renderer implementation.
// ─────────────────────────────────────────────────────────────────────────────
import { useRef, useEffect, useCallback, useState } from 'react';
import { Engine } from '@scriblmotion/core';
export function useScriblMotion(options = {}) {
    const { autoPlay = true, rendererFactory } = options;
    const containerRef = useRef(null);
    const engineRef = useRef(null);
    const [state, setState] = useState('idle');
    const [error, setError] = useState(null);
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            engineRef.current?.destroy();
            engineRef.current = null;
        };
    }, []);
    const loadIdRef = useRef(0);
    const loadScene = useCallback(async (payload) => {
        const container = containerRef.current;
        if (!container) {
            setError('Container ref not attached');
            setState('error');
            return;
        }
        const currentLoadId = ++loadIdRef.current;
        try {
            // Destroy previous engine if exists
            engineRef.current?.destroy();
            // Use provided factory, or lazy-load SVGRenderer as default.
            let renderer;
            if (rendererFactory) {
                renderer = rendererFactory();
            }
            else {
                // Dynamic import avoids the static resolution issue in Turbopack.
                const { SVGRenderer } = await import('@scriblmotion/svg');
                renderer = new SVGRenderer();
            }
            // If another load started while we were awaiting the import, abort this one.
            if (currentLoadId !== loadIdRef.current) {
                return;
            }
            // Ensure the container is perfectly clean right before we mount
            container.innerHTML = '';
            const engine = new Engine({
                container,
                renderer,
            });
            engine.loadScene(payload);
            engineRef.current = engine;
            setError(null);
            if (autoPlay) {
                engine.play();
                setState('playing');
            }
            else {
                setState('paused');
            }
        }
        catch (err) {
            if (currentLoadId !== loadIdRef.current)
                return;
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            setState('error');
            console.error('[ScriblMotion]', msg);
        }
    }, [autoPlay, rendererFactory]);
    const play = useCallback(() => {
        engineRef.current?.play();
        setState('playing');
    }, []);
    const pause = useCallback(() => {
        engineRef.current?.pause();
        setState('paused');
    }, []);
    const stop = useCallback(() => {
        engineRef.current?.stop();
        setState('idle');
    }, []);
    const seek = useCallback((time) => {
        engineRef.current?.seek(time);
    }, []);
    return { containerRef, loadScene, play, pause, stop, seek, state, error, engine: engineRef.current };
}
//# sourceMappingURL=useScriblMotion.js.map