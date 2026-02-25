import type { EngineEventMap, ScriblScriptPayload, ArchetypeDef, Vec2 } from '../types/index';
import { EventBus } from './EventBus';
import { Timeline } from './Timeline';
import { EntityManager } from './EntityManager';
import { AnimationSystem } from './AnimationSystem';
import { InteractionSystem } from './InteractionSystem';
import { SceneManager } from './SceneManager';
import { PhysicsSystem } from './PhysicsSystem';
import { ArchetypeRegistry } from './ArchetypeRegistry';
import { CharacterSystem } from '../character/CharacterSystem';
import { Renderer } from '../render/Renderer';
import { AudioSystem } from './AudioSystem';
export interface EngineConfig {
    /** DOM container for the renderer. */
    container: HTMLElement;
    /** Renderer implementation (SVG, Canvas, or Hybrid). */
    renderer: Renderer;
    /** Optional: override default frame rate. */
    frameRate?: number;
    /** Optional: CSS class for the root rendering surface */
    className?: string;
}
export declare class Engine {
    readonly eventBus: EventBus<EngineEventMap>;
    readonly timeline: Timeline;
    readonly entityManager: EntityManager;
    readonly animationSystem: AnimationSystem;
    readonly interactionSystem: InteractionSystem;
    readonly sceneManager: SceneManager;
    readonly characterSystem: CharacterSystem;
    readonly physicsSystem: PhysicsSystem;
    readonly archetypeRegistry: ArchetypeRegistry;
    readonly audioSystem: AudioSystem;
    private readonly _renderer;
    private readonly _validator;
    private readonly _parser;
    private readonly _container;
    private readonly _className?;
    private _rafId;
    private _lastFrameTime;
    private _targetFrameRate;
    private _isDestroyed;
    private _activePayload;
    constructor(config: EngineConfig);
    /** Current target frame rate. */
    get targetFrameRate(): number;
    /** The currently loaded ScriblScript payload, or null. */
    get activePayload(): ScriblScriptPayload | null;
    /**
     * Load and activate a ScriblScript scene from a JSON payload.
     */
    loadScene(json: unknown): void;
    /**
     * Register an archetype definition for use in scenes.
     */
    registerArchetype(def: ArchetypeDef): void;
    /**
     * Register multiple archetype definitions.
     */
    registerArchetypes(defs: ArchetypeDef[]): void;
    /** Begin playback. */
    play(): void;
    /** Pause playback. */
    pause(): void;
    /** Stop playback and reset to time 0. */
    stop(): void;
    /** Seek to a specific time in milliseconds. */
    seek(time: number): void;
    /** Apply a force to an entity. */
    applyForce(entityId: string, force: Vec2): void;
    /** Apply an impulse to an entity. */
    applyImpulse(entityId: string, impulse: Vec2): void;
    /** Transition an entity's archetype state. */
    transitionState(entityId: string, state: string): boolean;
    /** Tear down all resources. */
    destroy(): void;
    /** Handle container resize. */
    resize(width: number, height: number): void;
    handlePointerDown(x: number, y: number): void;
    handlePointerMove(x: number, y: number): void;
    handlePointerUp(x: number, y: number): void;
    /**
     * Set a property on an entity via dot-notation path.
     * E.g. "position.x", "styles.fill", "opacity"
     */
    private setEntityProperty;
    private startFrameLoop;
    private stopFrameLoop;
    /**
     * Core tick: advance timeline → animations → physics → characters → render.
     */
    private tick;
    /** Single-frame evaluation (used on seek). */
    private evaluateFrame;
    private assertNotDestroyed;
}
//# sourceMappingURL=Engine.d.ts.map