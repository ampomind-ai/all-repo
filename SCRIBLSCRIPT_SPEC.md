# DOCUMENT 1: SCRIBLSCRIPT DSL SPECIFICATION

## 1. Design Philosophy

**Why JSON**
ScriblScript uses JSON as its foundational syntax because it is universally parsable, tooling-agnostic, and natively serializable. It guarantees strict data structuring without the parsing ambiguities of custom syntax paradigms, enabling immediate ingestion by frontend frameworks, backend validation pipelines, and structural validation via JSON Schema.

**Why Declarative Over Imperative**
Imperative systems describe *how* to achieve a state, leading to unpredictable edge cases when states diverge. ScriblScript is purely declarative, describing *what* the final visual state and timeline should be mapped to any given timestamp. This eliminates race conditions, simplifies the mental model, and allows the rendering engine to optimize execution paths (e.g., batching draw calls) without altering developer intent.

**Why Deterministic Execution**
Determinism guarantees that a ScriblScript payload will render identical frames on any hardware, at any time, given the same temporal input ($t$). This is critical for synchronization, unit testing, seeking/scrubbing within the timeline, and ensuring consistent user experiences across devices.

**How this supports LLM-generated animation**
LLMs excel at structural generation but struggle with asynchronous, side-effect-heavy imperative code. By providing a strict JSON schema, LLMs can output complete, valid scenes reliably. The declarative nature ensures that an LLM only needs to compute the spatial-temporal parameters (e.g., coordinates, timing) without reasoning about the rendering loop or hardware limitations.

**How this supports frontend real-time rendering**
ScriblScript maps cleanly to the DOM, Canvas API, or WebGL contexts. The separation of Layers ensures that static backgrounds can be rasterized or cached (SVG/DOM), while highly dynamic entities are updated per-frame (Canvas/WebGL). The schema inherently supports partial application or "diffing" against a virtual engine state.

**Why no embedded JS**
Arbitrary code execution introduces severe security vulnerabilities (XSS), breaks determinism, and prevents accurate ahead-of-time (AOT) performance analysis. By replacing embedded scripts with a robust, data-driven Interaction and State model, ScriblScript maintains a sandboxed, safe execution environment while remaining interactive.

## 2. Core Architecture Model

**Pipeline Overview**  
`Scene → Layers → Entities → Components → Animations → Interactions → Timeline`

**Model Breakdown:**
*   **Scenes:** The root container defining universal constraints (dimensions, coordinate mapping, framerate, duration).
*   **Layers:** Z-index planes dictating the rendering strategy (`svg` vs `canvas`) and handling independent camera transforms.
*   **Entities:** The atomic visual units residing within Layers (shapes, text, graphs, characters). They exist in local or world space depending on layer configuration.
*   **Components:** Modular data attached to Entities (e.g., styling parameters, behaviors).
*   **Animations:** Time-bound state mutations interpolating Entity properties.
*   **Interactions:** Event listeners mapped to UI triggers that alter timeline playback or scene state.
*   **Timeline:** The continuous 1D array representing the flow of time. All rendering is a function $f(t) \rightarrow \text{Frame}$. State transitions occur strictly by mutating values at $t$.

**Conceptual Diagram:**
```text
+-----------------------------------------------------------------+
| SCENE (Global Clock: 0.0s -> 60.0s, Fps: 60)                    |
+-----------------------------------------------------------------+
|   |                                                             |
|   +-- LAYER ID: "bg-svg" [type: svg, zIndex: 0]                 |
|   |    |                                                        |
|   |    +-- ENTITY ID: "grid" [type: path]                       |
|   |                                                             |
|   +-- LAYER ID: "main-canvas" [type: canvas, zIndex: 1]         |
|        |                                                        |
|        +-- CAMERA (x: 0, y: 0, zoom: 1.5)                       |
|        |                                                        |
|        +-- ENTITY ID: "hero_char" [type: character]             |
|        |    |                                                   |
|        |    +-- ANIMATION [prop: position.x, t: 2s->5s, ease]   |
|        |    +-- INTERACTION [on: click, action: scrubTo(10s)]   |
|        |                                                        |
|        +-- ENTITY ID: "force_vector" [type: graph]              |
+-----------------------------------------------------------------+
```

## 3. Full DSL Schema Definition

### Scene Object
The top-level structure containing the entire configuration.
*   `id` (string): Unique identifier for the scene.
*   `width` (number): Base viewport width.
*   `height` (number): Base viewport height.
*   `duration` (number): Total scene duration in milliseconds.
*   `background` (string): Hex code or gradient definition.
*   `coordinateSystem` (string): `"cartesian"` (center origin) or `"screen"` (top-left origin).
*   `frameRate` (number): Target FPS (e.g., 30, 60).
*   `physics` (boolean, optional): Enables the rigid-body physics engine.

### Layers
Layers group entities by rendering strategy.
*   `id` (string): Unique layer ID.
*   `type` (enum): `"svg" | "canvas" | "hybrid"`.
*   `zIndex` (number): Rendering stack order.
*   `clipping` (boolean): Whether to clip children outside layer bounds.
*   `camera` (object): Configures layer view. `{ x, y, zoom, rotation }`.

### Entities
Visual nodes within a layer. Supported types: `shape`, `character`, `text`, `image`, `path`, `group`, `graph`, `ui`.
**Base Properties (All Entities):**
*   `id` (string): Unique node identifier.
*   `type` (string): The entity type.
*   `position` (object): `{ x: number, y: number }`.
*   `scale` (object): `{ x: number, y: number }`.
*   `rotation` (number): Degrees or radians (enforced globally).
*   `opacity` (number): 0.0 to 1.0.
*   `anchor` (object): `{ x: 0.5, y: 0.5 }` (normalized origin point).
*   `children` (array): Nested entities (relative positioning).
*   `styles` (object): Fill, stroke, font size, drop shadows.
*   `behaviors` (object): Physics constraints, hover hints.

### Animation System
Animations mutate entity properties over time. Time is strictly milliseconds ($ms$).
*   `keyframes` (array): Array of `{ time: number, value: any }` denoting exact states.
*   `easing` (string): Mathematical curve (e.g., `"linear"`, `"easeInOutCubic"`, `"spring"`, `"bounce"`).
*   `duration` (number): Animation length in ms (if not inferred from keyframes).
*   `delay` (number): Delay before start in ms.
*   `loops` (number): Iteration count (`-1` for infinite).
*   `transitions` (string): How conflicting animations blend (`"override"`, `"add"`).
*   `triggers` (array): Event hooks to start/stop the animation (`scene_start`, `interaction_id`).
*   `chainedTo` (string): ID of another animation to execute sequentially.

**Timeline Model:** Non-destructive mapping of purely declarative timestamps. Interpolation is calculated dynamically. Between $t_1$ and $t_2$, visual state relies on Easing Functions calculation.

### Interaction System
Maps user input to timeline mutations or global events.
*   `on` (enum): `"click" | "hover" | "drag" | "timeline_scrub" | "input"`.
*   `target` (string): Entity ID to listen on.
*   `actions` (array): What happens when triggered.
    *   `type`: `"play" | "pause" | "seek" | "switch_scene" | "state_update"`.
    *   `payload`: Specific arguments (e.g., `{ time: 5000 }` for seek, `{ key: "score", val: 1 }` for state).
*   `conditions` (object): Branching logic based on global state (e.g., `if state.score > 5`).

### Graph / Visualization Module
First-class support for mathematical and data visualization components without building from primitive shapes.
*   `charts`: Bar, line, pie, radar (accepts JSON data array).
*   `nodes_edges`: Directed/undirected graph rendering, built-in layout engines (force-directed, tree).
*   `math_formulas`: LaTeX string ingestion mapped to rendered SVG (`v = u + at`).
*   `coordinate_grids`: Dynamic axes parsing ranges, step sizes, and viewport domain.
*   `data_binding`: Links a `styles` or `scale` property to a dynamic dataset array.

### Audio Support
Handles spatial and temporal sound synchronicity.
*   `narration`: Tied to a text entity for subtitle sync.
*   `sync_to_timeline`: `{ src: "url", startAt: 0 }`.
*   `sound_effects`: Triggered by interaction IDs or animation hooks.
*   `waveform_triggers`: Emits events based on audio decibel thresholding mappings.

## 4. Example Complete DSL File
*Theme: Explain Newton's Second Law*

```json
{
  "version": "1.0",
  "scene": {
    "id": "newtons_second_law",
    "width": 1920,
    "height": 1080,
    "duration": 15000,
    "background": "#0f172a",
    "coordinateSystem": "cartesian",
    "frameRate": 60,
    "audio": [
      {
        "id": "narration_1",
        "src": "https://cdn.scriblmotion.com/audio/f_ma_narr.mp3",
        "startAt": 1000
      }
    ]
  },
  "layers": [
    {
      "id": "background-grid",
      "type": "svg",
      "zIndex": 0,
      "entities": [
        {
          "id": "cartesian_grid",
          "type": "graph",
          "config": {
            "type": "coordinate_grid",
            "domainX": [-10, 10],
            "domainY": [-5, 5],
            "stroke": "#334155",
            "opacity": 0.5
          }
        }
      ]
    },
    {
      "id": "main-action",
      "type": "canvas",
      "zIndex": 1,
      "camera": { "x": 0, "y": 0, "zoom": 1.0 },
      "entities": [
        {
          "id": "formula_text",
          "type": "text",
          "position": { "x": 0, "y": 300 },
          "styles": { "content": "F = m · a", "fontSize": 80, "fill": "#38bdf8", "fontFamily": "Inter" },
          "opacity": 0,
          "animations": [
            {
              "property": "opacity",
              "keyframes": [ { "time": 1000, "value": 0 }, { "time": 2000, "value": 1 } ],
              "easing": "easeOutQuad"
            }
          ]
        },
        {
          "id": "box_mass",
          "type": "shape",
          "styles": { "shape": "rect", "width": 200, "height": 200, "fill": "#ef4444" },
          "position": { "x": -400, "y": 0 },
          "animations": [
            {
              "property": "position.x",
              "keyframes": [ { "time": 4000, "value": -400 }, { "time": 8000, "value": 400 } ],
              "easing": "easeInQuad"
            }
          ]
        },
        {
          "id": "force_arrow",
          "type": "path",
          "styles": { "pathData": "M -500 0 L -420 0 L -440 -20 M -420 0 L -440 20", "stroke": "#fbbf24", "strokeWidth": 10 },
          "opacity": 0,
          "animations": [
            {
              "property": "opacity",
              "keyframes": [ { "time": 3000, "value": 0 }, { "time": 3500, "value": 1 }, { "time": 8000, "value": 0 } ],
              "easing": "linear"
            }
          ]
        },
        {
          "id": "interactive_slider",
          "type": "ui",
          "position": { "x": 0, "y": -400 },
          "config": {
            "type": "slider",
            "label": "Change Mass",
            "min": 1,
            "max": 10,
            "defaultValue": 5
          },
          "interactions": [
            {
              "on": "input",
              "actions": [
                {
                  "type": "state_update",
                  "payload": { "key": "mass_value", "value": "$event.value" }
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

## 5. Validation Rules
*   **Required Fields:** Every valid ScriblScript file *must* contain a `version`, `scene` configuration, and at least one `layer`. Every entity *must* have an `id` and `type`.
*   **Default Values:** `position` defaults to `{0,0}`, `scale` to `{1,1}`, `opacity` to `1.0`, `rotation` to `0`. `anchor` defaults to `{0.5, 0.5}`.
*   **Type Constraints:** IDs must match `^[a-zA-Z0-9_-]+$`. Timestamps must be non-negative integers. Hex codes must be valid 6 or 8 character strings.
*   **Runtime Safety:** No parsing of arbitrary string evaluations via `eval()` style injection. State keys must exist in a pre-defined store context.
*   **Max Nesting Depth:** Entity trees via `children` property are strictly capped at depth 5 to prevent recursion parsing bottlenecks.
*   **Max Animation Count:** Maximum of 500 active property interpolations per scene; 5 concurrent animations per individual entity.

## 6. Performance Guidelines
*   **Entity Limits:** Maintain under 2,000 active entities. If higher node counts are required, they must be batched inside a `graph` node using WebGL shaders.
*   **Layer Optimization:** Never mutate properties in an `svg` layer on every frame at $60fps$. Static background arrays go to SVG. Highly dynamic kinematics go to `canvas`.
*   **Canvas vs SVG:** Use SVG for crisp, scalable typography and static mathematical notations. Use Canvas for particle systems, frame-by-frame transforms, and 50+ item iterative motion sequences.
*   **Memory Constraints:** Limit unique texture loads (`image` type) to $< 50MB$ per scene.
*   **Streaming Mode:** Array-based entities and interactions can be streamed chunk-by-chunk over WebSockets; the timeline will pause/buffer if a chronological boundary exceeds loaded chunks.

## 7. Versioning Strategy
*   **Version Field:** Always required at the root (currently `"1.0"`).
*   **Backwards Compatibility:** The engine will strictly enforce semantic versioning. Additive schema properties are minor bumps. Schema structural drops are major bumps. Legacy fallback engines will ignore unknown properties without failing.
*   **Extension Support:** Custom properties can only be passed inside an `__ext__` object block to avoid colliding with future core engine configurations.
