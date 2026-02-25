/** Clamp `v` between `min` and `max`. */
export declare function clamp(v: number, min: number, max: number): number;
/** Linear interpolation between `a` and `b` by factor `t ∈ [0,1]`. */
export declare function lerp(a: number, b: number, t: number): number;
/** Inverse lerp: returns the `t` that produces `v` in `[a, b]`. */
export declare function inverseLerp(a: number, b: number, v: number): number;
/** Remap a value from one range to another. */
export declare function remap(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number;
/** Convert degrees to radians. */
export declare function degToRad(deg: number): number;
/** Convert radians to degrees. */
export declare function radToDeg(rad: number): number;
/** Shortest angle difference between two angles (radians). */
export declare function angleDelta(from: number, to: number): number;
/** Distance between two 2D points. */
export declare function distance(ax: number, ay: number, bx: number, by: number): number;
//# sourceMappingURL=MathUtils.d.ts.map