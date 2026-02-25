// ─────────────────────────────────────────────────────────────────────────────
// @scriblmotion/core — v2.0 Public API barrel export
// ─────────────────────────────────────────────────────────────────────────────
// Core engine
export { Engine } from './core/Engine';
export { EventBus } from './core/EventBus';
export { Timeline } from './core/Timeline';
export { AnimationSystem } from './core/AnimationSystem';
export { EntityManager } from './core/EntityManager';
export { InteractionSystem } from './core/InteractionSystem';
export { SceneManager } from './core/SceneManager';
// v2.0 — new core systems
export { ArchetypeRegistry } from './core/ArchetypeRegistry';
export { AudioSystem } from './core/AudioSystem';
export { StateMachine } from './core/StateMachine';
export { PhysicsSystem } from './core/PhysicsSystem';
// DSL
export { DSLParser, StreamAccumulator } from './dsl/DSLParser';
export { DSLValidator } from './dsl/DSLValidator';
// Character
export { CharacterSystem } from './character/CharacterSystem';
export { Rig } from './character/Rig';
export { PoseSystem } from './character/PoseSystem';
export { ExpressionSystem } from './character/ExpressionSystem';
// Render (abstract)
export { Renderer } from './render/Renderer';
// Utils
export { getEasingFn, isValidEasingName } from './utils/Easing';
export { findKeyframePair, interpolateNumber, interpolateVec2, interpolateColor, interpolateValue } from './utils/Interpolation';
export { clamp, lerp, inverseLerp, remap, degToRad, radToDeg, angleDelta, distance } from './utils/MathUtils';
export { isValidId, isValidHex, measureEntityDepth, countEntities, countAnimations, isPayloadWithinLimits, MAX_NESTING_DEPTH, MAX_ANIMATIONS_PER_SCENE, MAX_ANIMATIONS_PER_ENTITY, MAX_SCENE_DURATION_MS, MAX_ENTITIES, MAX_CHARACTERS, COORDINATE_CLAMP, } from './utils/Guards';
// Archetypes (v2.0)
export { guide_neutral_v1, student_curious_v1, concept_blob_v1, node_v1, block_unit_v1, vector_arrow_v1, variable_unit_v1, chart_bar_v1, speech_bubble_v1, slider_ui_v1, success_icon_v1, highlight_frame_v1, MVP_ARCHETYPES, } from './archetypes/index';
//# sourceMappingURL=index.js.map