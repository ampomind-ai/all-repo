// ─────────────────────────────────────────────────────────────────────────────
// useScriblMotion — React hook for mounting and controlling the engine
//
// SVGRenderer is NOT imported here to avoid cross-package resolution issues in
// Next.js/Turbopack. Instead, the caller (or the default factory below) is
// responsible for providing a Renderer implementation.
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useEffect, useCallback, useState } from 'react';
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
    /** Optional class applied directly to the rendering surface (e.g. svg tag) */
    svgClassName?: string;
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

export function useScriblMotion(
    options: UseScriblMotionOptions = {},
): UseScriblMotionReturn {
    const { autoPlay = true, rendererFactory, svgClassName } = options;
    const containerRef = useRef<HTMLDivElement | null>(null);
    const engineRef = useRef<Engine | null>(null);
    const [state, setState] = useState<'idle' | 'playing' | 'paused' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            engineRef.current?.destroy();
            engineRef.current = null;
        };
    }, []);

    const loadIdRef = useRef(0);

    const loadScene = useCallback(
        async (payload: ScriblScriptPayload) => {
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
                let renderer: Renderer;
                if (rendererFactory) {
                    renderer = rendererFactory();
                } else {
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
                    className: svgClassName,
                });

                engine.loadScene(payload);
                engineRef.current = engine;
                setError(null);

                if (autoPlay) {
                    engine.play();
                    setState('playing');
                } else {
                    setState('paused');
                }
            } catch (err) {
                if (currentLoadId !== loadIdRef.current) return;
                const msg = err instanceof Error ? err.message : String(err);
                setError(msg);
                setState('error');
                console.error('[ScriblMotion]', msg);
            }
        },
        [autoPlay, rendererFactory],
    );

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

    const seek = useCallback((time: number) => {
        engineRef.current?.seek(time);
    }, []);

    return { containerRef, loadScene, play, pause, stop, seek, state, error, engine: engineRef.current };
}
