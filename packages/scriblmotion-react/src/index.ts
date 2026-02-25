// ─────────────────────────────────────────────────────────────────────────────
// @scriblmotion/react — Public API
// Exports the React hook and re-exports core types for convenience.
// ─────────────────────────────────────────────────────────────────────────────

export { useScriblMotion } from './useScriblMotion';
export type { UseScriblMotionOptions, UseScriblMotionReturn } from './useScriblMotion';

export { ScriblMotionPlayer } from './ScriblMotionPlayer';
export type { ScriblMotionPlayerProps } from './ScriblMotionPlayer';

// Re-export core types that consumers commonly need
export type {
    ScriblScriptPayload,
    EngineEventMap,
    EngineConfig,
} from '@scriblmotion/core';
