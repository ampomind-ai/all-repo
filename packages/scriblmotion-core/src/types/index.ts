// ─────────────────────────────────────────────────────────────────────────────
// ScriblScript DSL Type Definitions — v2.0
// Shared contract between the DSL layer, core engine, and renderers.
// ─────────────────────────────────────────────────────────────────────────────

// ── Primitives ───────────────────────────────────────────────────────────────

export interface Vec2 {
    x: number;
    y: number;
}

export interface AABB {
    min: Vec2;
    max: Vec2;
}

export interface Color {
    hex: string;
}

// ── Coordinate System ────────────────────────────────────────────────────────

export type CoordinateSystem = 'cartesian' | 'screen';

// ── Layer Types ──────────────────────────────────────────────────────────────

export type LayerType = 'svg' | 'canvas' | 'hybrid';

// ── Entity Types ─────────────────────────────────────────────────────────────

export type EntityType =
    | 'shape'
    | 'character'
    | 'text'
    | 'image'
    | 'path'
    | 'group'
    | 'graph'
    | 'ui'
    // v2.0 — interactive UI entities
    | 'button'
    | 'slider'
    | 'tooltip'
    | 'speech_bubble'
    // v2.1 — math and graph entities
    | 'math_expr'
    | 'coordinate_plane'
    // v2.1 — UI and effects
    | 'input_field'
    | 'particle_emitter'
    | 'subtitle';

// ── Easing ───────────────────────────────────────────────────────────────────

export type EasingName =
    | 'linear'
    | 'easeInQuad'
    | 'easeOutQuad'
    | 'easeInOutQuad'
    | 'easeInCubic'
    | 'easeOutCubic'
    | 'easeInOutCubic'
    | 'easeInSine'
    | 'easeOutSine'
    | 'easeInOutSine'
    | 'bounce'
    | 'spring';

// ── Interaction Events ───────────────────────────────────────────────────────

export type InteractionEventType =
    | 'click'
    | 'hover'
    | 'drag'
    | 'timeline_scrub'
    | 'input'
    | 'state_update'
    // v2.0 — granular drag lifecycle + pointer tracking
    | 'drag_start'
    | 'drag_move'
    | 'drag_end'
    | 'pointer_enter'
    | 'pointer_leave';

export type ActionType =
    | 'play'
    | 'pause'
    | 'seek'
    | 'switch_scene'
    | 'state_update'
    // v2.0 — direct entity mutation + physics
    | 'set_property'
    | 'transition_state'
    | 'emit_event'
    | 'add_entity'
    | 'remove_entity'
    | 'apply_force'
    // v2.1 — branching, audio, hints
    | 'jump_to_scene'
    | 'play_sound'
    | 'show_hint';

// ── DSL Structures (input from JSON) ─────────────────────────────────────────

export interface ScriblKeyframe {
    time: number;
    value: unknown;
}

export interface ScriblAnimationDef {
    id?: string;
    property: string;
    keyframes: ScriblKeyframe[];
    easing: EasingName;
    duration?: number;
    delay?: number;
    loops?: number;
    transitions?: 'override' | 'add';
    triggers?: string[];
    chainedTo?: string;
}

export interface ScriblActionDef {
    type: ActionType;
    payload?: Record<string, unknown>;
}

export interface ScriblInteractionDef {
    on: InteractionEventType;
    target?: string;
    actions: ScriblActionDef[];
    conditions?: Record<string, unknown>;
}

// ── Physics Bodies (v2.0) ────────────────────────────────────────────────────

export type PhysicsBodyType = 'static' | 'dynamic' | 'kinematic';

export interface ConstraintDef {
    type: 'pin' | 'distance' | 'spring';
    /** ID of the entity to constrain to. Omit for world-anchor. */
    targetId?: string;
    /** Anchor point relative to the entity. */
    anchor?: Vec2;
    stiffness?: number;
    damping?: number;
    /** For distance constraints: rest length. */
    length?: number;
}

export interface PhysicsBodyDef {
    type: PhysicsBodyType;
    mass?: number;
    friction?: number;
    restitution?: number;
    /** Multiplier on gravity (0 = no gravity, 1 = normal, -1 = anti-gravity). */
    gravityScale?: number;
    constraints?: ConstraintDef[];
    /** If true, entity cannot rotate under forces. */
    fixedRotation?: boolean;
}

// ── Entity Definition ────────────────────────────────────────────────────────

export interface ScriblEntityDef {
    id: string;
    type: EntityType;
    position?: Vec2;
    scale?: Vec2;
    rotation?: number;
    opacity?: number;
    anchor?: Vec2;
    children?: ScriblEntityDef[];
    styles?: Record<string, unknown>;
    behaviors?: Record<string, unknown>;
    animations?: ScriblAnimationDef[];
    interactions?: ScriblInteractionDef[];
    // Character / archetype binding
    archetype?: string;
    initialState?: {
        pose?: string;
        expression?: string;
        /** v2.0 — initial archetype state for the state machine */
        state?: string;
    };
    // Physics body (v2.0)
    physics?: PhysicsBodyDef;
    /** Whether this entity is draggable. */
    draggable?: boolean;
    // UI / graph config
    config?: Record<string, unknown>;
    // v2.1 — scaffolding / hints
    hintSequence?: string[];
}

export interface ScriblCameraDef {
    x: number;
    y: number;
    zoom: number;
    rotation?: number;
}

export interface ScriblLayerDef {
    id: string;
    type: LayerType;
    zIndex: number;
    clipping?: boolean;
    camera?: ScriblCameraDef;
    entities: ScriblEntityDef[];
}

export interface ScriblAudioDef {
    id: string;
    src: string;
    startAt: number;
    /** v2.1 — TTS word-level timestamps (e.g. from ElevenLabs) */
    timestamps?: { word: string; time: number }[];
}

export interface ScriblSceneDef {
    id: string;
    width: number;
    height: number;
    duration: number;
    background: string;
    coordinateSystem: CoordinateSystem;
    frameRate: number;
    physics?: boolean;
    /** v2.0 — scene-level physics config */
    gravity?: Vec2;
    audio?: ScriblAudioDef[];
}

export interface ScriblScriptPayload {
    version: string;
    scene: ScriblSceneDef;
    layers: ScriblLayerDef[];
    /** v2.0 — archetypes bundled with the payload for self-contained scenes */
    archetypes?: ArchetypeDef[];
}

// ── Internal Engine Structures ───────────────────────────────────────────────

export interface EngineEntity {
    id: string;
    type: EntityType;
    position: Vec2;
    scale: Vec2;
    rotation: number;
    opacity: number;
    anchor: Vec2;
    parentId: string | null;
    childIds: string[];
    zIndex: number;
    layerId: string;
    styles: Record<string, unknown>;
    behaviors: Record<string, unknown>;
    // Character-specific
    archetype?: string;
    characterState?: {
        pose: string;
        expression: string;
    };
    /** v2.0 — current archetype state machine state */
    archetypeState?: string;
    config?: Record<string, unknown>;
    // Physics runtime state (v2.0)
    physicsBody?: PhysicsBodyDef;
    velocity?: Vec2;
    acceleration?: Vec2;
    draggable?: boolean;
    // v2.1 — Scaffolding
    hintSequence?: string[];
    /** Renderer-managed opaque handle (DOM node, draw-list entry, etc.) */
    renderHandle: unknown;
}

export interface EngineLayer {
    id: string;
    type: LayerType;
    zIndex: number;
    clipping: boolean;
    camera: ScriblCameraDef;
    entityIds: string[];
}

export interface EngineScene {
    id: string;
    width: number;
    height: number;
    duration: number;
    background: string;
    coordinateSystem: CoordinateSystem;
    frameRate: number;
    physics: boolean;
    gravity: Vec2;
    layers: EngineLayer[];
    audio: ScriblAudioDef[];
}

// ── Animation Track (internal) ───────────────────────────────────────────────

export interface AnimationTrack {
    id: string;
    entityId: string;
    property: string;
    keyframes: ScriblKeyframe[];
    easing: EasingName;
    delay: number;
    loops: number;
    currentLoop: number;
    totalDuration: number;
    isActive: boolean;
    chainedTo: string | null;
}

// ── State Machine ────────────────────────────────────────────────────────────

export interface StateTransition<S extends string> {
    from: S;
    to: S;
    guard?: () => boolean;
    priority?: number;
}

// ── Archetype System (v2.0) ──────────────────────────────────────────────────

export type ArchetypeCategory =
    | 'human'
    | 'abstract'
    | 'visualization'
    | 'science'
    | 'tech'
    | 'math'
    | 'ui'
    | 'feedback'
    | 'meta';

/** Defines the animations for entering, looping, and exiting a state. */
export interface ArchetypeStateDef {
    id: string;
    /** Animations triggered on entering this state. */
    enter?: ScriblAnimationDef[];
    /** Looping animations while in this state. */
    loop?: ScriblAnimationDef[];
    /** Animations triggered on exiting this state. */
    exit?: ScriblAnimationDef[];
}

/** SVG path data for a visual component within a rig node. */
export interface RigVisualDef {
    /** SVG path data or shape type. */
    shape: 'path' | 'circle' | 'rect' | 'ellipse' | 'foreignObject';
    /** SVG path `d` attribute (for shape === 'path'). */
    d?: string;
    /** For circle/ellipse: radius. */
    radius?: number;
    /** For rect: width/height. */
    width?: number;
    height?: number;
    /** Fill color (can be overridden by appearance). */
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
    /** Embedded configuration for specific shapes. */
    props?: Record<string, unknown>;
}

export interface RigNodeDef {
    id: string;
    parentId: string | null;
    localPosition: Vec2;
    localRotation: number;
    rotationMin: number;
    rotationMax: number;
    children: string[];
    /** v2.0 — visual appearance of this bone/node */
    visual?: RigVisualDef;
}

/** v2.0 — Expanded archetype definition. */
export interface ArchetypeDef {
    /** Unique identifier, e.g. "guide_neutral_v1" */
    id: string;
    /** Semantic version string */
    version: string;
    /** Category for filtering/marketplace */
    category: ArchetypeCategory;
    /** Bone tree for rigging */
    rig: Record<string, RigNodeDef>;
    /** Declared states with enter/loop/exit animations */
    states: Record<string, ArchetypeStateDef>;
    /** The state to enter on instantiation */
    defaultState: string;
    /** Bounding box for hit-testing */
    bounds: AABB;
    /** Named anchor points (e.g. "mouth", "hand_right") */
    anchors: Record<string, Vec2>;
    /** Named animation presets (e.g. "wave", "nod") */
    animationPresets: Record<string, ScriblAnimationDef[]>;
    /** Pre-defined facial expressions (v2.1) */
    expressions?: ExpressionDef[];
    /** Style keys that consumers can override */
    appearanceOverrides: string[];
    /** Optional metadata (author, description, tags, icon, etc.) */
    metadata?: Record<string, unknown>;
}

export interface PoseDef {
    name: string;
    /** Bone ID → target local rotation */
    boneRotations: Record<string, number>;
    blendDuration: number;
}

export interface ExpressionDef {
    name: string;
    components: Record<string, string>; // e.g. { eyes: "closed", mouth: "smile" }
    blendDuration: number;
}

// ── Engine Events ────────────────────────────────────────────────────────────

export interface EngineEventMap {
    'scene:loaded': { sceneId: string };
    'scene:switched': { from: string; to: string };
    'timeline:play': undefined;
    'timeline:pause': undefined;
    'timeline:seek': { time: number };
    'timeline:end': undefined;
    'entity:click': { entityId: string; x: number; y: number };
    'entity:hover': { entityId: string; x: number; y: number };
    'entity:drag': { entityId: string; dx: number; dy: number };
    'state:update': { key: string; value: unknown };
    'interaction:triggered': { entityId: string; action: ScriblActionDef };
    // v2.0 — new events
    'entity:drag_start': { entityId: string; x: number; y: number };
    'entity:drag_move': { entityId: string; x: number; y: number; dx: number; dy: number };
    'entity:drag_end': { entityId: string; x: number; y: number };
    'entity:pointer_enter': { entityId: string };
    'entity:pointer_leave': { entityId: string };
    'archetype:state_changed': { entityId: string; from: string; to: string };
    'physics:collision': { entityA: string; entityB: string };
    'ui:button_click': { entityId: string; value?: unknown };
    'ui:slider_change': { entityId: string; value: number };
    'ui:input_submit': { entityId: string; value: string };
    'scene:switch_requested': { sceneId: string };
    'camera:zoom': { factor: number; cx: number; cy: number };
    'audio:word_boundary': { audioId: string; word: string; time: number };
    'ui:show_hint': { entityId: string; text: string };
}

// ── Renderer Contract ────────────────────────────────────────────────────────

export interface RendererConfig {
    container: HTMLElement;
    width: number;
    height: number;
    background: string;
    className?: string; // Optional class for the root rendering surface
    eventBus?: unknown; // Engine EventBus instance for firing UI events
}

// ── Validation ───────────────────────────────────────────────────────────────

export interface ValidationError {
    path: string;
    message: string;
    severity: 'error' | 'warning';
}

export interface ValidationResult {
    valid: boolean;
    errors: ValidationError[];
}
