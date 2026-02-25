// ─────────────────────────────────────────────────────────────────────────────
// useScriblMotion — React hook for mounting and controlling the engine
// ─────────────────────────────────────────────────────────────────────────────
import { useRef, useEffect, useCallback, useState } from 'react';
import { Engine } from '@scriblmotion/core';
import { SVGRenderer } from '@scriblmotion/svg';
export function useScriblMotion(options = {}) {
    const { autoPlay = true } = options;
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
    const loadScene = useCallback((payload) => {
        const container = containerRef.current;
        if (!container) {
            setError('Container ref not attached');
            setState('error');
            return;
        }
        try {
            // Destroy previous engine if exists
            engineRef.current?.destroy();
            container.innerHTML = '';
            const renderer = new SVGRenderer();
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
            const msg = err instanceof Error ? err.message : String(err);
            setError(msg);
            setState('error');
            console.error('[ScriblMotion]', msg);
        }
    }, [autoPlay]);
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
