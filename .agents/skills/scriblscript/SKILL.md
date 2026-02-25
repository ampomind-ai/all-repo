---
name: ScriblScript Generator
description: Instructing the LLM Assistant on generating flawless ScriblScript DSL v2.0 payloads.
---

# ScriblScript Generation SKILL

## 1. LLM Behavioral Contract
When asked to output ScriblScript to explain a concept, you are bound by this contract:
*   **V2 JSON ONLY:** You must ONLY output valid ScriblScript JSON. 
*   **NO EXPLANATIONS:** Do not write introductory or concluding conversational text. 
*   **NO MARKDOWN:** Do not wrap the output in standard markdown unless rendering a standard codeblock.
*   **NO COMMENTS:** JSON does not support comments. Never output `//` or `/* */`.
*   **NO CODE:** Never output JavaScript, HTML, Python, or CSS classes. Everything happens inside the JSON DSL.

## 2. Instruction Philosophy
Your goal is to act as a master educator and interactive visualizer.
*   **Teach Visually:** Use shapes, motion, and color to show relationships. Avoid walls of text.
*   **Prefer Interaction Over Narration:** Put sliders, buttons, draggable objects, and visual clicks where you would usually put a paragraph of text. Let the user discover the answer.
*   **Minimal Text:** If an idea can be shown via a graph or an expanding node, use that instead of text nodes.
*   **Build Progressively:** Start the timeline empty. Introduce elements chronologically (e.g., $t=1000$ add object A, $t=3000$ drop in object B).

## 3. Teaching Model
*   **Break Concepts into Scenes:** If the topic is complex (e.g., Blockchain), do not compress it into one 5-second canvas. Use sequential interactions or chained timeline events spreading over 20-30 seconds.
*   **Introduce One Idea at a Time:** Animate elements onto the screen sequentially. Do not have 10 text blocks appear simultaneously at $t=0$.
*   **Use Visual Metaphors:** For "encryption", use a `shape` morphed as a lock. For "blocks", use stacked `rect` entities connected by a `path`.
*   **Use Characters:** Where applicable, use a `character` entity to direct attention (e.g., moving across the screen looking at elements).

## 4. Interaction Strategy (v2.0)
The v2.0 engine supports deep interactivity, drag-and-drop, and physics.
*   **Checkpoints:** Pause the timeline at key learning moments using an interaction until the user clicks "Continue".
*   **Interactive UI:** Use new UI entity types: `button`, `slider`, `tooltip`, `speech_bubble`.
*   **Drag & Drop:** You can make entities interactive by setting `draggable: true` on an entity definition. 
*   **Granular Events:** Bind interactions to `click`, `hover`, `drag_start`, `drag_move`, `drag_end`, `pointer_enter`, and `pointer_leave`.
*   **Actions:** Embody cause-and-effect with actions like `set_property`, `transition_state`, `emit_event`, `add_entity`, `remove_entity`, and `apply_force`.

## 5. Physics Engine Rules (v2.0)
*   **Enable Physics:** At the scene level, you can enable physics via `scene.physics = true` and optionally set `scene.gravity = { x: 0, y: 9.8 }`.
*   **Entity Physics:** Any entity (except `character` or complex UI elements) can participate in physics. Add the `physics` block:
    *   `type`: `'static'`, `'dynamic'`, or `'kinematic'`.
    *   `restitution`: bounciness (0.0 - 1.0).
    *   `friction`: surface friction.
    *   `constraints`: array of constraints (`'pin'`, `'distance'`, `'spring'`) connecting to other entities via `targetId`.

## 6. DSL Generation Rules
You must strictly adhere to the ScriblScript Schema rules:
*   **Unique IDs:** Every `scene`, `layer`, `entity`, and `animation` referencing a target must use a globally unique string ID.
*   **Required Fields:** Never omit `width`, `height`, `duration`, `frameRate`, `id`, `type`.
*   **Easing Validation:** Every animation must specify a valid easing function (`"linear"`, `"easeInQuad"`, `"easeOutQuad"`, `"easeInOutSine"`, `"bounce"`, `"spring"`).
*   **Time Bounds:** Max scene duration is `120000` (120 seconds).
*   **Animation Counting:** Max 5 simultaneous animations applied to a single entity.
*   **Timeline Offsets:** Keyframe times must be in milliseconds and must strictly monotonically increase.

## 7. Character Generation Rules
When instantiating characters, you must follow the Engine constraints:
*   **Archetypes Only:** You must instantiate characters via `type: "character"` and reference a valid `archetype` string ID (e.g., `"guide_neutral_v1"` or `"student_curious_v1"`).
*   **State Machine Driven:** Never interpolate raw scale or rotational parameters on a character entity to achieve motion. Instead, trigger state transitions referencing bounded archetype states (e.g., action `transition_state` with payload `{ target: "char1", state: "explain_point" }`).
*   **Expression Overrides:** Facial changes can happen via `initialState: { expression: "surprised" }`.

## 8. Optimization Rules
*   **Avoid Unnecessary Entities:** Do not use 10 separate lines to draw a box. Use a `rect` shape.
*   **Character Limits:** Limit active characters to an absolute maximum of 10 per scene.
*   **Merge Layers:** Use only 1 `svg` layer for static backgrounds/text and 1 `canvas` layer for motion/particles unless depth separation explicitly demands more.

## 9. Error Prevention Rules
*   **No Infinite Loops:** Interactions must not trigger state changes that trigger themselves.
*   **No Circular References:** `chainedTo` must not point back to a previous animation. 
*   **No Unbounded Animations:** Every animation must have an ending keyframe or timeline bound.
*   **Clean Z-Indexes:** Layers must have explicitly set numeric `zIndex`.
*   **Valid Hex Codes:** Colors must be standard hex format (e.g., `#ffffff`).

## 10. Example Good Output (v2.0)
```json
{
  "version": "2.0",
  "scene": {
    "id": "physics_demo",
    "width": 1280,
    "height": 720,
    "duration": 10000,
    "background": "#1e293b",
    "coordinateSystem": "cartesian",
    "frameRate": 60,
    "physics": true,
    "gravity": { "x": 0, "y": 9.8 }
  },
  "layers": [
    {
      "id": "main_layer",
      "type": "canvas",
      "zIndex": 1,
      "camera": { "x": 0, "y": 0, "zoom": 1.0 },
      "entities": [
        {
          "id": "button_drop",
          "type": "button",
          "position": { "x": -200, "y": -200 },
          "styles": { "label": "Drop Box", "fill": "#3b82f6" },
          "interactions": [
            {
              "on": "click",
              "actions": [ { "type": "add_entity", "payload": { "layerId": "main_layer", "entity": { "id": "box_1", "type": "shape", "position": { "x": 0, "y": -300 }, "physics": { "type": "dynamic", "restitution": 0.8 } } } } ]
            }
          ]
        },
        {
          "id": "floor",
          "type": "shape",
          "position": { "x": 0, "y": 300 },
          "styles": { "shape": "rect", "width": 800, "height": 20, "fill": "#475569" },
          "physics": { "type": "static" }
        }
      ]
    }
  ]
}
```
