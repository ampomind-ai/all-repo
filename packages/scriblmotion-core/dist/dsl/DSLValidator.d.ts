import type { ScriblScriptPayload, ValidationResult } from '../types/index';
export declare class DSLValidator {
    /**
     * Validate a parsed ScriblScript payload against the complete schema.
     */
    validate(payload: ScriblScriptPayload): ValidationResult;
    private validateEntities;
    private validateAnimation;
}
//# sourceMappingURL=DSLValidator.d.ts.map