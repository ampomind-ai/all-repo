// ─────────────────────────────────────────────────────────────────────────────
// SceneManager — Scene lifecycle, layer management, and entity registry
// Coordinates the creation and teardown of scenes from parsed DSL data.
// ─────────────────────────────────────────────────────────────────────────────
export class SceneManager {
    constructor(deps) {
        this._activeScene = null;
        this._scenes = new Map();
        this._entityManager = deps.entityManager;
        this._animationSystem = deps.animationSystem;
        this._interactionSystem = deps.interactionSystem;
        this._timeline = deps.timeline;
        this._eventBus = deps.eventBus;
    }
    /** The currently active scene, or null. */
    get activeScene() {
        return this._activeScene;
    }
    /**
     * Build and register a scene from a validated DSL payload.
     * Does NOT activate it — call `switchScene()` for that.
     */
    addScene(payload) {
        const sceneDef = payload.scene;
        const defaultCamera = { x: 0, y: 0, zoom: 1, rotation: 0 };
        const layers = payload.layers.map((layerDef) => ({
            id: layerDef.id,
            type: layerDef.type,
            zIndex: layerDef.zIndex,
            clipping: layerDef.clipping ?? false,
            camera: layerDef.camera ?? { ...defaultCamera },
            entityIds: [],
        }));
        const scene = {
            id: sceneDef.id,
            width: sceneDef.width,
            height: sceneDef.height,
            duration: sceneDef.duration,
            background: sceneDef.background,
            coordinateSystem: sceneDef.coordinateSystem,
            frameRate: sceneDef.frameRate,
            physics: sceneDef.physics ?? false,
            gravity: sceneDef.gravity ?? { x: 0, y: 980 },
            layers,
            audio: sceneDef.audio ?? [],
        };
        this._scenes.set(scene.id, scene);
        return scene;
    }
    /**
     * Activate a scene: populate entities, register animations, set timeline.
     */
    switchScene(sceneId, payload) {
        const scene = this._scenes.get(sceneId);
        if (!scene)
            return false;
        const previousId = this._activeScene?.id ?? '';
        // Teardown current scene
        if (this._activeScene) {
            this.unloadScene(this._activeScene.id);
        }
        this._activeScene = scene;
        this._timeline.setDuration(scene.duration);
        this._timeline.stop();
        // Build entities and register animations/interactions per layer
        for (const layerDef of payload.layers) {
            const engineLayer = scene.layers.find((l) => l.id === layerDef.id);
            if (!engineLayer)
                continue;
            for (let i = 0; i < layerDef.entities.length; i++) {
                const entityDef = layerDef.entities[i];
                const entity = this._entityManager.createFromDef(entityDef, layerDef.id, layerDef.zIndex * 1000 + i);
                engineLayer.entityIds.push(entity.id);
                // Register animations as timeline tracks
                if (entityDef.animations) {
                    for (const animDef of entityDef.animations) {
                        const track = this._animationSystem.createTrack(entity.id, animDef);
                        this._timeline.addTrack(track);
                    }
                }
                // Register interactions
                if (entityDef.interactions) {
                    this._interactionSystem.registerEntity(entity.id, entityDef.interactions);
                }
            }
        }
        this._eventBus.emit('scene:switched', { from: previousId, to: sceneId });
        return true;
    }
    /** Teardown a scene and free all associated resources. */
    unloadScene(sceneId) {
        const scene = this._scenes.get(sceneId);
        if (!scene)
            return;
        // Remove all entities belonging to this scene
        for (const layer of scene.layers) {
            for (const entityId of layer.entityIds) {
                this._entityManager.remove(entityId);
            }
            layer.entityIds = [];
        }
        this._timeline.reset();
        this._interactionSystem.clear();
        if (this._activeScene?.id === sceneId) {
            this._activeScene = null;
        }
    }
}
