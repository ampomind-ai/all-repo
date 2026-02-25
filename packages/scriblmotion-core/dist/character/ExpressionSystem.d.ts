import type { ExpressionDef } from '../types/index';
/** Current resolved state of facial components. */
export interface FacialState {
    components: Record<string, string>;
    blendFactor: number;
}
export declare class ExpressionSystem {
    private readonly _expressions;
    private _currentExpression;
    private _activeBlend;
    /** Register an expression definition. */
    registerExpression(expression: ExpressionDef): void;
    /** Register multiple expression definitions. */
    registerExpressions(expressions: ExpressionDef[]): void;
    /** Current expression name. */
    get currentExpressionName(): string | null;
    /** Whether a blend transition is in progress. */
    get isBlending(): boolean;
    /**
     * Transition to a named expression.
     * Returns false if the expression is unknown.
     */
    transitionTo(expressionName: string): boolean;
    /** Force-set an expression without blending. */
    forceSet(expressionName: string): boolean;
    /**
     * Update the expression blend. Called per frame.
     * Returns the current resolved facial state.
     */
    update(deltaTime: number): FacialState;
    /** Clear all registered expressions and reset state. */
    clear(): void;
}
//# sourceMappingURL=ExpressionSystem.d.ts.map