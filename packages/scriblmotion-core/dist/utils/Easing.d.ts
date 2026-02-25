import type { EasingName } from '../types/index';
export type EasingFn = (t: number) => number;
/**
 * Resolve an EasingName to a pure easing function.
 * Falls back to `linear` for unknown names (engine safety).
 */
export declare function getEasingFn(name: EasingName): EasingFn;
/** Check if a string is a valid easing name. */
export declare function isValidEasingName(name: string): name is EasingName;
//# sourceMappingURL=Easing.d.ts.map