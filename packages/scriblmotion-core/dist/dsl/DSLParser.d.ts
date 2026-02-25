import type { ScriblScriptPayload } from '../types/index';
export declare class DSLParser {
    /**
     * Parse a raw JSON input into a ScriblScriptPayload.
     * Accepts a string, an object, or any unknown value.
     * Throws on malformed input.
     */
    parse(input: unknown): ScriblScriptPayload;
    /**
     * Parse from a streaming chunk (incremental loading).
     * Accumulates chunks and parses when complete.
     */
    static createStreamAccumulator(): StreamAccumulator;
}
/**
 * Streaming support: accumulate JSON chunks and parse once complete.
 */
export declare class StreamAccumulator {
    private _buffer;
    private _complete;
    /** Append a raw string chunk. */
    append(chunk: string): void;
    /**
     * Attempt to parse the accumulated buffer.
     * Returns the payload if parsing succeeds, or `null` if more data is needed.
     */
    tryParse(): ScriblScriptPayload | null;
    /** Reset the accumulator. */
    reset(): void;
    get isComplete(): boolean;
}
//# sourceMappingURL=DSLParser.d.ts.map