// ─────────────────────────────────────────────────────────────────────────────
// ExpressionSystem — Facial expression state management
// Manages expression presets and blending for the character face components.
// ─────────────────────────────────────────────────────────────────────────────

import type { ExpressionDef } from '../types/index';
import { clamp } from '../utils/MathUtils';

interface ActiveExpressionBlend {
    from: ExpressionDef;
    to: ExpressionDef;
    elapsed: number;
    duration: number;
}

/** Current resolved state of facial components. */
export interface FacialState {
    components: Record<string, string>;
    blendFactor: number; // 0 = fully "from", 1 = fully "to"
}

export class ExpressionSystem {
    private readonly _expressions: Map<string, ExpressionDef> = new Map();
    private _currentExpression: ExpressionDef | null = null;
    private _activeBlend: ActiveExpressionBlend | null = null;

    /** Register an expression definition. */
    registerExpression(expression: ExpressionDef): void {
        this._expressions.set(expression.name, expression);
    }

    /** Register multiple expression definitions. */
    registerExpressions(expressions: ExpressionDef[]): void {
        for (const expr of expressions) {
            this.registerExpression(expr);
        }
    }

    /** Current expression name. */
    get currentExpressionName(): string | null {
        return this._currentExpression?.name ?? null;
    }

    /** Whether a blend transition is in progress. */
    get isBlending(): boolean {
        return this._activeBlend !== null;
    }

    /**
     * Transition to a named expression.
     * Returns false if the expression is unknown.
     */
    transitionTo(expressionName: string): boolean {
        const target = this._expressions.get(expressionName);
        if (!target) return false;
        if (this._currentExpression?.name === expressionName) return true;

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
    forceSet(expressionName: string): boolean {
        const expr = this._expressions.get(expressionName);
        if (!expr) return false;
        this._currentExpression = expr;
        this._activeBlend = null;
        return true;
    }

    /**
     * Update the expression blend. Called per frame.
     * Returns the current resolved facial state.
     */
    update(deltaTime: number): FacialState {
        if (this._activeBlend) {
            this._activeBlend.elapsed += deltaTime;
            const t = clamp(this._activeBlend.elapsed / this._activeBlend.duration, 0, 1);

            if (t >= 1) {
                this._currentExpression = this._activeBlend.to;
                this._activeBlend = null;
            }

            return {
                components: t >= 0.5
                    ? (this._activeBlend?.to ?? this._currentExpression!)?.components ?? {}
                    : (this._activeBlend?.from ?? this._currentExpression!)?.components ?? {},
                blendFactor: t,
            };
        }

        return {
            components: this._currentExpression?.components ?? {},
            blendFactor: 1,
        };
    }

    /** Clear all registered expressions and reset state. */
    clear(): void {
        this._expressions.clear();
        this._currentExpression = null;
        this._activeBlend = null;
    }
}
