// ─────────────────────────────────────────────────────────────────────────────
// EventBus — Type-safe publish/subscribe event system
// Zero dependencies. Generic over an event map for compile-time safety.
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventBus {
    constructor() {
        this.listeners = new Map();
    }
    /** Subscribe to an event. Returns an unsubscribe function. */
    on(event, handler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        const set = this.listeners.get(event);
        set.add(handler);
        return () => { set.delete(handler); };
    }
    /** Unsubscribe a specific handler. */
    off(event, handler) {
        this.listeners.get(event)?.delete(handler);
    }
    /** Emit an event to all subscribed handlers synchronously. */
    emit(event, payload) {
        const set = this.listeners.get(event);
        if (!set)
            return;
        for (const handler of set) {
            handler(payload);
        }
    }
    /** Remove all listeners for a specific event or all events. */
    clear(event) {
        if (event) {
            this.listeners.delete(event);
        }
        else {
            this.listeners.clear();
        }
    }
    /** Check if an event has any listeners. */
    hasListeners(event) {
        return (this.listeners.get(event)?.size ?? 0) > 0;
    }
}
