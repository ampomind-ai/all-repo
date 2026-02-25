// ─────────────────────────────────────────────────────────────────────────────
// ExpressionSystem — Facial expression state management
// Manages expression presets and blending for the character face components.
// ─────────────────────────────────────────────────────────────────────────────
import { clamp } from '../utils/MathUtils';
export class ExpressionSystem {
    constructor() {
        this._expressions = new Map();
        this._currentExpression = null;
        this._activeBlend = null;
    }
    /** Register an expression definition. */
    registerExpression(expression) {
        this._expressions.set(expression.name, expression);
    }
    /** Register multiple expression definitions. */
    registerExpressions(expressions) {
        for (const expr of expressions) {
            this.registerExpression(expr);
        }
    }
    /** Current expression name. */
    get currentExpressionName() {
        return this._currentExpression?.name ?? null;
    }
    /** Whether a blend transition is in progress. */
    get isBlending() {
        return this._activeBlend !== null;
    }
    /**
     * Transition to a named expression.
     * Returns false if the expression is unknown.
     */
    transitionTo(expressionName) {
        const target = this._expressions.get(expressionName);
        if (!target)
            return false;
        if (this._currentExpression?.name === expressionName)
            return true;
        const from = this._currentExpression ?? target;
        this._activeBlend = {
            from,
            to: target,
            elapsed: 0,
            duration: target.blendDuration,
        };
        return true;
    }
    /** Force-set an expression without blending. */
    forceSet(expressionName) {
        const expr = this._expressions.get(expressionName);
        if (!expr)
            return false;
        this._currentExpression = expr;
        this._activeBlend = null;
        return true;
    }
    /**
     * Update the expression blend. Called per frame.
     * Returns the current resolved facial state.
     */
    update(deltaTime) {
        if (this._activeBlend) {
            this._activeBlend.elapsed += deltaTime;
            const t = clamp(this._activeBlend.elapsed / this._activeBlend.duration, 0, 1);
            if (t >= 1) {
                this._currentExpression = this._activeBlend.to;
                this._activeBlend = null;
            }
            return {
                components: t >= 0.5
                    ? (this._activeBlend?.to ?? this._currentExpression)?.components ?? {}
                    : (this._activeBlend?.from ?? this._currentExpression)?.components ?? {},
                blendFactor: t,
            };
        }
        return {
            components: this._currentExpression?.components ?? {},
            blendFactor: 1,
        };
    }
    /** Clear all registered expressions and reset state. */
    clear() {
        this._expressions.clear();
        this._currentExpression = null;
        this._activeBlend = null;
    }
}
//# sourceMappingURL=ExpressionSystem.js.map