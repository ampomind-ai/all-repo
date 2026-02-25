# Scriblmotion Character System Architecture v1.0

## SECTION 1 — SYSTEM PHILOSOPHY

### Why Characters are Archetype-Based
Characters in Scriblmotion are not built from scratch per scene; they are instantiated from predefined Archetypes (e.g., "Professor", "Robot", "Student"). Archetypes guarantee that animations, bone weights, and visual boundaries adhere to known constraints. This allows consistent visual language, predictable memory footprints, and prevents the DSL from needing to define thousands of vertices for every character instantiation.

### Why Rig-Based Design is Necessary
A rig-based (skeletal) 2D design separates the structural hierarchy (bones/joints) from the visual appearance (skins/assets). This allows micro-animations (e.g., walking, pointing) to be computed once as rotational/transform data on the rig, and applied seamlessly to any custom appearance. It drastically reduces file size compared to frame-by-frame raster animations and ensures buttery-smooth 60fps interpolation natively.

### Why LLMs Should Not Generate Raw SVG Characters
LLMs are highly prone to hallucinating paths, miscalculating viewBox coordinates, and failing to maintain consistent node hierarchies over multiple generations. Asking an LLM to generate raw SVG path data for characters yields broken, non-deterministic visuals. By providing the LLM with a high-level API to command an Engine-owned Archetype, we guarantee visual fidelity and structural safety.

### Why State-Driven Animation is Superior to Raw Transform Control
If the DSL manually specified rotational values for a character’s arm at specific milliseconds, blending and interpolation would become brittle, and collision overlapping would occur. A state-driven approach (e.g., `setPose("explain")`) pushes the IK (Inverse Kinematics) and interpolation math down to the engine level. This reduces the DSL payload size, abstracts complex animation curves, and avoids erratic behavior.

### Why Deterministic Animation is Required
Determinism guarantees that if a character starts a "wave" animation at $t=2000ms$, their hand will be at the exact same spatial coordinate at $t=2500ms$ across all client machines, screen sizes, and playback speeds. This is crucial for Timeline scrubbing, regression testing, and creating interactive synchronization points with other scene entities or audio narration.

---

## SECTION 2 — CHARACTER ARCHITECTURE OVERVIEW

The Character System operates through a strict layer hierarchy separating data definition from runtime execution.

**Character Archetype**
The immutable blueprint defining the structural possibilities of a character class. Contains bone names, limits, and asset references.

↓

**Rig Structure**
The mathematical skeleton layer. Handles hierarchical transforms, parent-child inheritance, and IK constraints.

↓

**Skins / Appearance Overrides**
The visual layer mapping SVG or Canvas rendering assets (e.g., specific shirts, hair styles, eye colors) to the underlying Rig Structure.

↓

**State Machine**
The logical safety layer ensuring a character does not perform conflicting actions simultaneously (e.g., preventing a "walk" while locked in a "sit" state).

↓

**Animation Presets**
The library of predefined kinematic sequences (e.g., walk cycles, blinks). They mutate Rig node values over time based on State Machine allowances.

↓

**Runtime Instance (via DSL)**
The actual actor generated in the DOM/Canvas by the engine when instructed by the ScriblScript JSON. It holds transient timeline state and user-overridden variables.

---

## SECTION 3 — CHARACTER ARCHETYPE MODEL

### Archetype Definition
Each Archetype is packaged as a static JSON index alongside its necessary visual vector assets. An Archetype index contains:
*   `id`: Unique identifier (e.g., `"arch_human_v1"`).
*   `version`: Semantic version (e.g., `"1.0.0"`).
*   `rig`: The hierarchical bone structure mapping.
*   `expressions`: Array of supported facial blends (e.g., `["happy", "sad", "surprised"]`).
*   `poses`: Array of supported full-body static states (e.g., `["idle", "explain", "thinking"]`).
*   `animations`: Array of supported kinematic sequences (e.g., `["walk_in", "wave"]`).
*   `customizable_fields`: Exposed variables for the DSL (e.g., `["shirtColor", "skinTone"]`).
*   `bounds`: AABB (Axis-Aligned Bounding Box) definitions for collision and interaction math.
*   `anchors`: Mount points for attaching external entities (e.g., `hand_L`, `head_top`).

### Asset Packaging Strategy
Archetypes are distributed as ZIP or packed JSON bundles containing:
1.  `archetype.json`: The structural definition above.
2.  `sprite_atlas.svg`: A master SVG containing mapped groups (`<g id="head">`) which the engine breaks apart and mounts to the Rig nodes.
3.  `manifest.json`: Asset integrity hashes and caching headers.

---

## SECTION 4 — RIGGING MODEL

### 2D Rig System Definitions
*   **Nodes**: The conceptual points of articulation (Bones).
*   **Parent-child relationships**: Transformations cascade down. Moving the `Shoulder` automatically translates the `Elbow` and `Wrist`.
*   **Transform constraints**: Hard limits on position `(x, y)` to prevent breaking meshes.
*   **Rotation limits**: Angle clamps (e.g., `Elbow` cannot rotate backwards past 0°).
*   **IK (Inverse Kinematics)**: (Optional) Solvers allowing the DSL to define a target point for an end-effector (like a hand), resulting in the engine calculating the necessary angles for the arm joints.
*   **Named bones**: Standardization across Archetypes (e.g., `root`, `spine_lowest`, `neck`, `head`, `arm_upper_L`, `leg_lower_R`).

### Engine Mapping
*   **SVG Mapping:** Rig nodes map to nested `<g>` tags. The engine updates the `transform="matrix(...)"` attribute of these groups per-frame based on the bone's global transform.
*   **Canvas Mapping:** The engine traverses the bone tree recursively, executing `ctx.save()`, `ctx.translate()`, `ctx.rotate()`, drawing the skin slice, and executing `ctx.restore()`.
*   **Interpolation:** Between keyframes, quaternions or Euler angles (with shortest-path logic) are spherically/linearly interpolated based on the active easing function.

### Example Rig Structure Diagram
```text
[root]
  │
  ├─ [spine_lower]
  │    │
  │    ├─ [leg_upper_L] ── [leg_lower_L] ── [foot_L]
  │    │
  │    ├─ [leg_upper_R] ── [leg_lower_R] ── [foot_R]
  │    │
  │    └─ [spine_upper]
  │         │
  │         ├─ [neck] ── [head]
  │         │
  │         ├─ [arm_upper_L] ── [arm_lower_L] ── [hand_L]
  │         │
  │         └─ [arm_upper_R] ── [arm_lower_R] ── [hand_R]
```

---

## SECTION 5 — EXPRESSION SYSTEM

### Facial Component Model
Facial animations bypass the skeletal rig and instead utilize pre-drawn SVG state swapping or opacity morphing. The face is divided into logical components: `Eyes`, `Brows`, and `Mouth`.

### Expressions
*   **Presets:** `neutral`, `happy`, `sad`, `surprised`, `thinking`, `speaking`.
*   **Blendable:** Opacity of SVG components cross-fades over a fixed `blendDuration`.
*   **Duration Constraints:** Expressions are held indefinitely until changed, or temporarily applied via a micro-animation (e.g., a 200ms `blink` overrides `Eyes` and immediately yields back to the base expression).

### DSL Trigger Mapping
The DSL triggers an expression change via the Animation pipeline:
`{ "type": "expression", "value": "surprised", "time": 4000 }`. The Engine maps this strictly to the designated `head` node's facial component children.

---

## SECTION 6 — POSE SYSTEM

### Pose States
Poses denote a full-body static configuration of bone rotations. They define a character's stance when not actively traversing the scene or performing micro-animations.
*   `idle`: Default standing / breathing.
*   `explain`: Open posture, one hand gestural.
*   `point_left` / `point_right`: Orienting user attention to specific screen coordinates.
*   `celebrate`: Arms raised, open expression.
*   `confused`: Head tilted, arm crossing.
*   `thinking`: Hand to chin, narrowed brows.

### Pose Blending
When transitioning from $Pose_A$ to $Pose_B$, the Engine spherically interpolates every bone's rotation from its current state to its target state over $t_{transition}$. Default transition duration is `300ms`. The blending algorithm utilizes an `easeInOutQuad` curve to prevent mechanical snapping.

### Safety Constraints
Poses cannot be activated if the character is currently locked in a High-Priority Movement State (e.g., mid-way through a `walk_in` sequence).

---

## SECTION 7 — PRESET MICRO-ANIMATIONS

Micro-animations are transient, kinematic sequences layered *on top* of the current Pose. 

### Supported Reusable Animations
*   `blink`: 150ms total. Closes eyes, opens eyes. (Independent of Pose).
*   `nod`: 400ms. Rotates `neck` and `head`.
*   `bounce`: 500ms. Translates `root` Y-axis up and down.
*   `walk_in`: Dynamic duration based on distance. Cycles leg/arm rigs while translating X-axis.
*   `slide_out`: 400ms. Translates character off-screen utilizing opacity fade.
*   `wave`: 1200ms. Loops `arm_upper_R` and `arm_lower_R` utilizing FK (Forward Kinematics).
*   `shake_head`: 600ms. Y-axis rotation/translation of `head` node.

### Constraints
*   **Durations:** Pre-calculated to guarantee clean looping or exit states.
*   **Easing:** Baked into the preset asset data; immutable by DSL to preserve animation quality.
*   **Loop Safety:** Certain animations (`walk_in`) are strictly linear one-shots. Others (`idle_breathing`) run on an infinite engine-level loop `-1`.

---

## SECTION 8 — CHARACTER STATE MACHINE

To prevent visual fracturing and logical paradoxes, all character instances operate through a formal Finite State Machine (FSM).

### Primary States
*   `IDLE`: Base state. Active pose is held. Endless breathing loop active.
*   `SPEAKING`: Morphing mouth components synced to audio / text timing.
*   `REACTING`: Temporarily executing a Micro-Animation (e.g., `wave`).
*   `INTERACTING`: Bound to timeline pauses waiting for user input.
*   `TRANSITIONING`: Actively moving across global coordinates via interpolation.

### Transition Rules
| Current State | Requested Action | Allowed | Resulting State | Notes |
| :--- | :--- | :--- | :--- | :--- |
| `IDLE` | Trigger Pose Change | Yes | `IDLE` | Blends to new pose over 300ms. |
| `IDLE` | Trigger `walk_in` | Yes | `TRANSITIONING` | Movement locks other full-body actions. |
| `TRANSITIONING` | Trigger `wave` | No | `TRANSITIONING` | Ignored. Cannot wave while walking. |
| `TRANSITIONING` | Trigger `blink` | Yes | `TRANSITIONING` | Facial actions do not interrupt body movement. |
| `REACTING` | Trigger Pose Change | Queue | `IDLE` (Next) | Pose completes after reaction finishes. |
| `ANY` | Scene Hard Stop/Seek | Yes | `IDLE` | FSM forcefully resets to initial frame state. |

---

## SECTION 9 — DSL INTEGRATION CONTRACT

The `ScriblScript` schema enforces characters as high-level entities with specific behavioral properties.

### Instantiation and Appearance
The DSL declares characters within a Scene layer, specifying their archetype and color overrides.

```json
{
  "id": "tutor_bob",
  "type": "character",
  "archetype": "prof_v1",
  "position": { "x": -200, "y": 0 },
  "scale": { "x": 1.2, "y": 1.2 },
  "styles": {
    "skinTone": "#fcd34d",
    "shirtColor": "#0ea5e9"
  },
  "initialState": {
    "pose": "explain",
    "expression": "happy"
  }
}
```

### Animation Triggers
The DSL schedules state changes via the standard timeline keyframes on specific `character` properties.

```json
"animations": [
  {
    "property": "character.pose",
    "keyframes": [
      { "time": 2000, "value": "thinking" },
      { "time": 5000, "value": "point_right" }
    ]
  },
  {
    "property": "character.expression",
    "keyframes": [
      { "time": 5000, "value": "surprised" }
    ]
  },
  {
    "property": "character.action",
    "keyframes": [
      { "time": 8000, "value": "nod" }
    ]
  }
]
```

---

## SECTION 10 — INTERACTION MODEL

Characters inherently emit and inherit interactions via their defined bounding boxes.

*   **Click Response:** Characters act as buttons. Clicking `target: "tutor_bob"` can trigger a timeline `seek` or a `state_update`.
*   **Hover Response:** The DOM/Canvas detects mouse proximity via the $AABB$ bounds logic, changing pointer states or triggering a `wave` reaction conditionally.
*   **Quiz Feedback Response:** During an interaction pause, selecting a correct answer can invoke a global state bus that forces the character into the `celebrate` pose via engine-level conditional logic mapping.
*   **Timeline Sync:** If an interaction pauses the scene, the character falls back to its active `idle` loop safely until the scene resumes.

---

## SECTION 11 — PERFORMANCE STRATEGY

*   **Max Characters Per Scene:** Hard engine limit of 10 fully rigged characters simultaneously active to preserve 60fps on low-end mobile hardware.
*   **Shared Rig Instances:** The Engine caches Rig models in memory. If 3 "prof_v1" characters are instantiated, the matrix math is isolated per instance, but the archetype node arrays are referenced via pointers.
*   **Texture Reuse:** SVG sprite sheets are instantiated once in the DOM `<defs>` block and referenced via `<use href="#arc1_arm">` to drastically cut RAM usage.
*   **Lazy Loading:** Character static assets are only downloaded if explicitly declared in the DSL payload.
*   **Culling Rules:** If a character's absolute position falls outside the viewport camera frustum $+ 10\%$, all kinematics math and draw calls branch to a `return` immediately.
*   **Batching:** All character modifications applied in the same frame tick $t$ are batched into a single Virtual DOM diffing cycle (SVG) or a single render pass (Canvas) before yielding back to the browser paint thread.

---

## SECTION 12 — VERSIONING STRATEGY

*   **Archetype Versioning:** Handled strictly via the ID (e.g., `human_v1`, `human_v2`).
*   **Rig Compatibility Rules:** An Archetype's defined bones cannot be destroyed or renamed in subsequent point updates. They can only be added leaf-nodes (e.g., `finger_index`).
*   **Backward Compatibility:** If the DSL requests `pose: "dab"` and the loaded v1 Archetype lacks it, the engine gracefully catches the error, outputs a console warning, and falls back to `pose: "idle"`. It will never crash the renderer.
*   **Deprecation Policy:** Archetypes are flagged `deprecated` at the database level but remain eternally hosted on the CDN. Scriblmotion guarantees mathematical determinism for 10+ years; old JSON payloads must always render identically.

---

## SECTION 13 — STYLE CONSISTENCY RULES

Design standards enforced on Archetype creators, overriding DSL intent when necessary:
*   **Color Palette Rules:** Appearance overrides via DSL are automatically clamped or harmonized via HSL space to prevent inaccessible contrast ratios or garish combinations breaking the AmpoMind aesthetic.
*   **Stroke Width Rules:** Stroke scaling must be uniform across all rig nodes. If the character $Scale=2.0$, strokes scale proportionally. If rendering via SVG, `vector-effect="non-scaling-stroke"` is strictly banned.
*   **Proportion Rules:** Aspect ratios of limbs and bounds are locked. The DSL cannot provide non-uniform scale vectors to a character entity (e.g., `{ x: 2, y: 1 }` is coerced or rejected).
*   **Motion Language:** Easing profiles on micro-animations must adhere to "playful but professional" physics. Exits are snappy (`easeInQuad`), entrances overshoot slightly (`spring`), resting states are fluid.

---

## SECTION 14 — SECURITY MODEL

*   **DSL Restrictions:** The DSL CANNOT define custom SVG path data for a character's arm. It CANNOT redefine animation keyframes for rig sub-nodes. It CANNOT execute arbitrary JS attached to interaction hooks.
*   **Engine-Level Ownership:** IK solvers, State Machine transition tables, and Archetype definitions remain firmly inside the engine bundle.
*   **Protection Against Malformed Definitions:** The engine validates the incoming DSL Payload against the Character subset of the JSON Schema. If an LLM hallucinates `action: "fly"`, the FSM ignores it safely.
*   **Runtime Bounds Validation:** Coordinates resulting from physics interpolation are clamped to $\pm 100,000$ to prevent infinite scale/translation NaN explosions in WebGL or Canvas rendering loops.

---

## SECTION 15 — COMPLETE EXAMPLE

```json
{
  "scene": { ... },
  "layers": [
    {
      "id": "main",
      "type": "canvas",
      "zIndex": 10,
      "entities": [
        {
          "id": "guide_character",
          "type": "character",
          "archetype": "ampomind_robot_v1",
          "position": { "x": -300, "y": 0 },
          "scale": { "x": 1.0, "y": 1.0 },
          "styles": {
            "chassisColor": "#e2e8f0",
            "eyeGlow": "#3b82f6"
          },
          "initialState": {
            "pose": "idle",
            "expression": "neutral"
          },
          "interactions": [
            {
              "on": "click",
              "actions": [
                {
                  "type": "play",
                  "payload": { "animation_id": "guide_react_anim" }
                }
              ]
            }
          ],
          "animations": [
            {
              "id": "intro_walk",
              "property": "character.action",
              "keyframes": [
                { "time": 0, "value": "walk_in" }
              ]
            },
            {
              "id": "intro_explain",
              "property": "character.pose",
              "keyframes": [
                { "time": 2000, "value": "point_right" }
              ]
            },
            {
              "id": "intro_face",
              "property": "character.expression",
              "keyframes": [
                { "time": 2000, "value": "happy" }
              ]
            },
            {
              "id": "guide_react_anim",
              "property": "character.action",
              "triggers": [],
              "keyframes": [
                { "time": 0, "value": "wave" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```
