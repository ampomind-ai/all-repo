// ─────────────────────────────────────────────────────────────────────────────
// EventBus — Type-safe publish/subscribe event system
// Zero dependencies. Generic over an event map for compile-time safety.
// ─────────────────────────────────────────────────────────────────────────────

type Handler<T> = (payload: T) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class EventBus<EventMap extends Record<string, any>> {
    private readonly listeners = new Map<keyof EventMap, Set<Handler<never>>>();

    /** Subscribe to an event. Returns an unsubscribe function. */
    on<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>): () => void {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        const set = this.listeners.get(event)!;
        set.add(handler as Handler<never>);
        return () => { set.delete(handler as Handler<never>); };
    }

    /** Unsubscribe a specific handler. */
    off<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>): void {
        this.listeners.get(event)?.delete(handler as Handler<never>);
    }

    /** Emit an event to all subscribed handlers synchronously. */
    emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void {
        const set = this.listeners.get(event);
        if (!set) return;
        for (const handler of set) {
            (handler as Handler<EventMap[K]>)(payload);
        }
    }

    /** Remove all listeners for a specific event or all events. */
    clear(event?: keyof EventMap): void {
        if (event) {
            this.listeners.delete(event);
        } else {
            this.listeners.clear();
        }
    }

    /** Check if an event has any listeners. */
    hasListeners(event: keyof EventMap): boolean {
        return (this.listeners.get(event)?.size ?? 0) > 0;
    }
}
