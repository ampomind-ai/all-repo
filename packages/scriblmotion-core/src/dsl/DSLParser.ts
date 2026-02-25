// ─────────────────────────────────────────────────────────────────────────────
// DSLParser — Safe JSON parsing and mapping to ScriblScriptPayload
// Never executes arbitrary code. No eval. No Function constructors.
// ─────────────────────────────────────────────────────────────────────────────

import type { ScriblScriptPayload } from '../types/index';

/** Maximum payload size in bytes (10 MB). */
const MAX_PAYLOAD_SIZE = 10 * 1024 * 1024;

export class DSLParser {
    /**
     * Parse a raw JSON input into a ScriblScriptPayload.
     * Accepts a string, an object, or any unknown value.
     * Throws on malformed input.
     */
    parse(input: unknown): ScriblScriptPayload {
        let data: unknown;

        if (typeof input === 'string') {
            // Guard against extremely large payloads
            if (input.length > MAX_PAYLOAD_SIZE) {
                throw new Error(`Payload exceeds maximum size of ${MAX_PAYLOAD_SIZE} bytes.`);
            }
            try {
                data = JSON.parse(input);
            } catch {
                throw new Error('Failed to parse ScriblScript JSON. Input is not valid JSON.');
            }
        } else {
            data = input;
        }

        if (typeof data !== 'object' || data === null || Array.isArray(data)) {
            throw new Error('ScriblScript payload must be a JSON object.');
        }

        const obj = data as Record<string, unknown>;

        // Structural presence checks (detailed validation is in DSLValidator)
        if (!('version' in obj)) {
            throw new Error('Missing required field "version" in ScriblScript payload.');
        }
        if (!('scene' in obj)) {
            throw new Error('Missing required field "scene" in ScriblScript payload.');
        }
        if (!('layers' in obj)) {
            throw new Error('Missing required field "layers" in ScriblScript payload.');
        }

        // At this point we trust the shape enough for DSLValidator to do deep checks.
        return obj as unknown as ScriblScriptPayload;
    }

    /**
     * Parse from a streaming chunk (incremental loading).
     * Accumulates chunks and parses when complete.
     */
    static createStreamAccumulator(): StreamAccumulator {
        return new StreamAccumulator();
    }
}

/**
 * Streaming support: accumulate JSON chunks and parse once complete.
 */
export class StreamAccumulator {
    private _buffer: string = '';
    private _complete: boolean = false;

    /** Append a raw string chunk. */
    append(chunk: string): void {
        if (this._complete) {
            throw new Error('Stream already completed.');
        }
        this._buffer += chunk;
    }

    /**
     * Attempt to parse the accumulated buffer.
     * Returns the payload if parsing succeeds, or `null` if more data is needed.
     */
    tryParse(): ScriblScriptPayload | null {
        try {
            const parser = new DSLParser();
            const result = parser.parse(this._buffer);
            this._complete = true;
            return result;
        } catch {
            return null;
        }
    }

    /** Reset the accumulator. */
    reset(): void {
        this._buffer = '';
        this._complete = false;
    }

    get isComplete(): boolean {
        return this._complete;
    }
}
