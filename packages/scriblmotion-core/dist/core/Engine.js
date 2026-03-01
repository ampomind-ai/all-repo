// ─────────────────────────────────────────────────────────────────────────────
// Engine — v2.0 Top-level orchestrator for the Scriblmotion runtime
//
// Owns the frame loop, initializes all subsystems, and exposes the public API.
// v2.0: Adds PhysicsSystem, ArchetypeRegistry, and wires pointer events.
// Framework-agnostic. Pure TypeScript. No DOM outside renderer delegation.
// ─────────────────────────────────────────────────────────────────────────────
import { EventBus } from './EventBus';
import { Timeline } from './Timeline';
import { EntityManager } from './EntityManager';
import { AnimationSystem } from './AnimationSystem';
import { InteractionSystem } from './InteractionSystem';
import { SceneManager } from './SceneManager';
import { PhysicsSystem } from './PhysicsSystem';
import { ArchetypeRegistry } from './ArchetypeRegistry';
import { DSLParser } from '../dsl/DSLParser';
import { DSLValidator } from '../dsl/DSLValidator';
import { CharacterSystem } from '../character/CharacterSystem';
import { AudioSystem } from './AudioSystem'; // Changed import path
export class Engine {
    constructor(config) {
        // ── Frame Loop State ─────────────────────────────────────────────────
        this._rafId = null;
        this._lastFrameTime = 0;
        this._isDestroyed = false;
        // ── Active Payload Cache ─────────────────────────────────────────────
        this._activePayload = null;
        // Initialize subsystems
        this.eventBus = new EventBus();
        this.timeline = new Timeline();
        this.entityManager = new EntityManager();
        this.animationSystem = new AnimationSystem();
        this.archetypeRegistry = new ArchetypeRegistry();
        this.interactionSystem = new InteractionSystem(this.eventBus, this.entityManager);
        this.physicsSystem = new PhysicsSystem(this.entityManager, this.eventBus);
        this.audioSystem = new AudioSystem(this.eventBus);
        this.sceneManager = new SceneManager({
            entityManager: this.entityManager,
            animationSystem: this.animationSystem,
            interactionSystem: this.interactionSystem,
            timeline: this.timeline,
            eventBus: this.eventBus,
        });
        this.characterSystem = new CharacterSystem(this.archetypeRegistry, this.eventBus);
        this._validator = new DSLValidator();
        this._parser = new DSLParser();
        this._renderer = config.renderer;
        this._container = config.container;
        this._targetFrameRate = config.frameRate ?? 60;
        this._className = config.className;
        // ── Wire cross-system callbacks ──────────────────────────────────
        // Drag → Physics
        this.interactionSystem.setDragStateCallback((entityId, isDragged) => {
            this.physicsSystem.setDragged(entityId, isDragged);
        });
        // set_property action → entity mutation
        this.interactionSystem.setPropertyCallback((entityId, property, value) => {
            this.setEntityProperty(entityId, property, value);
        });
        // State transitions from interactions → CharacterSystem
        this.eventBus.on('archetype:state_changed', ({ entityId, to }) => {
            if (to) {
                this.characterSystem.transitionState(entityId, to);
            }
        });
        // Animation callback for state machine transitions
        this.characterSystem.setAnimationCallback((entityId, anims) => {
            for (const animDef of anims) {
                const track = this.animationSystem.createTrack(entityId, animDef);
                this.timeline.addTrack(track);
            }
        });
        // Branching scene logic
        this.eventBus.on('scene:switch_requested', ({ sceneId }) => {
            if (this.activePayload) {
                // In a multi-scene payload, this would swap scenes
                this.sceneManager.switchScene(sceneId, this.activePayload);
                this.timeline.play();
            }
        });
        // Audio playback logic
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.eventBus.on('audio:play_requested', ({ audioId }) => {
            this.audioSystem.play(audioId);
        });
        // Subtitle sync
        this.eventBus.on('audio:word_boundary', ({ word }) => {
            for (const entity of this.entityManager.entities.values()) {
                if (entity.archetype === 'subtitle_v1') {
                    if (!entity.config)
                        entity.config = {};
                    entity.config['activeWord'] = word;
                }
            }
        });
        // Handle generic interactions (play, pause, seek) triggered by UI
        this.eventBus.on('interaction:triggered', ({ action }) => {
            switch (action.type) {
                case 'play':
                    this.play();
                    break;
                case 'pause':
                    this.pause();
                    break;
                case 'seek': {
                    const time = action.payload?.['time'];
                    if (time !== undefined) {
                        this.seek(time);
                    }
                    break;
                }
            }
        });
        // Handle native slider changes mapped to timeline seek
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        this.eventBus.on('ui:slider_change', ({ entityId, value }) => {
            const entity = this.entityManager.get(entityId);
            if (!entity)
                return;
            // Update the entity config so the state reflects the slider handle
            if (!entity.config)
                entity.config = {};
            entity.config['value'] = value;
            // If the slider is configured to link to the timeline
            if (entity.config['linkedTimeline']) {
                // Map the value [min, max] to timeline duration [0, duration]
                const min = entity.config['min'] ?? 0;
                const max = entity.config['max'] ?? 100;
                if (max > min && this.activePayload) {
                    const pct = (value - min) / (max - min);
                    const targetTime = pct * this.activePayload.scene.duration;
                    this.seek(targetTime);
                }
            }
        });
        // ── Wire pointer interactions from GUI renderer ──────────────────
        this._renderer.setPointerCallbacks({
            onPointerDown: (x, y) => this.interactionSystem.handlePointerDown(x, y),
            onPointerMove: (x, y) => this.interactionSystem.handlePointerMove(x, y),
            onPointerUp: (x, y) => this.interactionSystem.handlePointerUp(x, y),
        });
    }
    // ── Public API ────────────────────────────────────────────────────────
    /** Current target frame rate. */
    get targetFrameRate() {
        return this._targetFrameRate;
    }
    /** The currently loaded ScriblScript payload, or null. */
    get activePayload() {
        return this._activePayload;
    }
    /**
     * Load and activate a ScriblScript scene from a JSON payload.
     */
    loadScene(json) {
        this.assertNotDestroyed();
        // 1. Parse
        const payload = this._parser.parse(json);
        // 2. Validate
        const result = this._validator.validate(payload);
        if (!result.valid) {
            const errorMessages = result.errors.map((e) => `[${e.path}] ${e.message}`).join('\n');
            throw new Error(`ScriblScript validation failed:\n${errorMessages}`);
        }
        // 3. Build/Register Archetypes & Preload Assets
        this.archetypeRegistry.clear();
        for (const def of payload.archetypes ?? []) {
            this.archetypeRegistry.register(def);
        }
        // Initialize audio buffers
        this.audioSystem.clear();
        if (payload.scene.audio && payload.scene.audio.length > 0) {
            this.audioSystem.loadAudio(payload.scene.audio);
        }
        // 4. Register and activate scene
        this.sceneManager.addScene(payload);
        this.sceneManager.switchScene(payload.scene.id, payload);
        // 5. Initialize renderer
        const scene = this.sceneManager.activeScene;
        this._renderer.init({
            container: this._container,
            width: scene.width,
            height: scene.height,
            background: scene.background,
            className: this._className,
            eventBus: this.eventBus,
        });
        // 6. Set up physics
        if (scene.physics) {
            this.physicsSystem.gravity = scene.gravity;
            this.physicsSystem.bounds = { width: scene.width, height: scene.height };
            // Register physics bodies for entities that have them
            for (const entity of this.entityManager.entities.values()) {
                if (entity.physicsBody) {
                    this.physicsSystem.registerBody(entity);
                }
            }
        }
        // 7. Instantiate archetypes for character entities
        for (const entity of this.entityManager.entities.values()) {
            if (entity.archetype && this.archetypeRegistry.has(entity.archetype)) {
                this.characterSystem.instantiate(entity.id, entity.archetype, entity.archetypeState);
            }
        }
        // 8. Finalize
        this._targetFrameRate = scene.frameRate;
        this._activePayload = payload;
        this.eventBus.emit('scene:loaded', { sceneId: scene.id });
        // Push initial frame to renderer so it doesn't stay blank when autoPlay=false
        this.evaluateFrame();
    }
    /**
     * Register an archetype definition for use in scenes.
     */
    registerArchetype(def) {
        this.archetypeRegistry.register(def);
    }
    /**
     * Register multiple archetype definitions.
     */
    registerArchetypes(defs) {
        this.archetypeRegistry.registerMany(defs);
    }
    /** Begin playback. */
    play() {
        this.assertNotDestroyed();
        // Start playback engines
        this.timeline.play();
        this.audioSystem.resume();
        this.audioSystem.playScheduled();
        this.eventBus.emit('timeline:play', undefined);
        if (this._rafId === null) {
            this.startFrameLoop();
        }
    }
    /** Pause playback. */
    pause() {
        this.assertNotDestroyed();
        this.timeline.pause();
        this.audioSystem.pause();
        this.eventBus.emit('timeline:pause', undefined);
    }
    /** Stop playback and reset to time 0. */
    stop() {
        this.assertNotDestroyed();
        this.timeline.stop();
        this.stopFrameLoop();
    }
    /** Seek to a specific time in milliseconds. */
    seek(time) {
        this.assertNotDestroyed();
        this.timeline.seek(time);
        this.eventBus.emit('timeline:seek', { time });
        this.evaluateFrame();
    }
    /** Apply a force to an entity. */
    applyForce(entityId, force) {
        this.physicsSystem.applyForce(entityId, force);
    }
    /** Apply an impulse to an entity. */
    applyImpulse(entityId, impulse) {
        this.physicsSystem.applyImpulse(entityId, impulse);
    }
    /** Transition an entity's archetype state. */
    transitionState(entityId, state) {
        return this.characterSystem.transitionState(entityId, state);
    }
    /** Tear down all resources. */
    destroy() {
        if (this._isDestroyed)
            return;
        this.stopFrameLoop();
        this.audioSystem.clear();
        this._renderer.destroy();
        const activeId = this.sceneManager.activeScene?.id;
        if (activeId) {
            this.sceneManager.unloadScene(activeId);
        }
        this.physicsSystem.clear();
        this.characterSystem.clearInstances();
        this.eventBus.clear();
        this._isDestroyed = true;
    }
    /** Handle container resize. */
    resize(width, height) {
        this._renderer.resize(width, height);
        this.physicsSystem.bounds = { width, height };
    }
    // ── Pointer Event Forwarding ─────────────────────────────────────────
    // These should be called by the renderer when pointer events occur.
    handlePointerDown(x, y) {
        this.interactionSystem.handlePointerDown(x, y);
    }
    handlePointerMove(x, y) {
        this.interactionSystem.handlePointerMove(x, y);
    }
    handlePointerUp(x, y) {
        this.interactionSystem.handlePointerUp(x, y);
    }
    // ── Entity Property Mutation ─────────────────────────────────────────
    /**
     * Set a property on an entity via dot-notation path.
     * E.g. "position.x", "styles.fill", "opacity"
     */
    setEntityProperty(entityId, property, value) {
        const entity = this.entityManager.get(entityId);
        if (!entity)
            return;
        const parts = property.split('.');
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let target = entity;
        for (let i = 0; i < parts.length - 1; i++) {
            target = target[parts[i]];
            if (target === undefined || target === null)
                return;
        }
        const lastKey = parts[parts.length - 1];
        target[lastKey] = value;
    }
    // ── Frame Loop ───────────────────────────────────────────────────────
    startFrameLoop() {
        if (this._rafId !== null)
            return;
        this._lastFrameTime = performance.now();
        const loop = (now) => {
            if (this._isDestroyed)
                return;
            const deltaTime = now - this._lastFrameTime;
            this._lastFrameTime = now;
            this.tick(deltaTime);
            this._rafId = requestAnimationFrame(loop);
        };
        this._rafId = requestAnimationFrame(loop);
    }
    stopFrameLoop() {
        if (this._rafId !== null) {
            cancelAnimationFrame(this._rafId);
            this._rafId = null;
        }
        this.audioSystem.stopAll(); // Added this line
    }
    /**
     * Core tick: advance timeline → animations → physics → characters → render.
     */
    tick(deltaTime) {
        // 1. Advance timeline
        const dtMs = deltaTime; // Renamed for clarity with the diff
        this.timeline.update(dtMs);
        // 2. Evaluate animation mutations
        const mutations = this.animationSystem.evaluate(Array.from(this.timeline.tracks.keys()), // Changed to get all track IDs
        this.timeline.tracks, this.timeline.currentTime);
        // 3. Apply mutations to entities
        this.animationSystem.applyMutations(mutations, this.entityManager.entities);
        // 4. Step physics (convert ms → seconds)
        const scene = this.sceneManager.activeScene;
        if (scene?.physics) {
            const dt = dtMs / 1000; // convert ms to seconds
            this.physicsSystem.step(dt);
        }
        // 5. Update character systems
        this.characterSystem.update(this.entityManager.entities, this.timeline.currentTime);
        // 6. Update audio
        this.audioSystem.update(this.timeline.currentTime); // Changed signature
        // 7. Render
        this._renderer.render(this.entityManager.entities);
        // 8. Check for timeline end
        if (this.timeline.state === 'paused' && this.timeline.currentTime >= this.timeline.duration) {
            this.eventBus.emit('timeline:end', undefined);
        }
    }
    /** Single-frame evaluation (used on seek). */
    evaluateFrame() {
        const allTrackIds = [];
        for (const id of this.timeline.tracks.keys()) {
            allTrackIds.push(id);
        }
        const mutations = this.animationSystem.evaluate(allTrackIds, this.timeline.tracks, this.timeline.currentTime);
        this.animationSystem.applyMutations(mutations, this.entityManager.entities);
        this.characterSystem.update(this.entityManager.entities, this.timeline.currentTime);
        this._renderer.render(this.entityManager.entities);
    }
    assertNotDestroyed() {
        if (this._isDestroyed) {
            throw new Error('Engine has been destroyed. Create a new instance.');
        }
    }
}
//# sourceMappingURL=Engine.js.map