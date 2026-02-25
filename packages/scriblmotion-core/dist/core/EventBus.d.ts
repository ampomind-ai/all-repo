type Handler<T> = (payload: T) => void;
export declare class EventBus<EventMap extends Record<string, any>> {
    private readonly listeners;
    /** Subscribe to an event. Returns an unsubscribe function. */
    on<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>): () => void;
    /** Unsubscribe a specific handler. */
    off<K extends keyof EventMap>(event: K, handler: Handler<EventMap[K]>): void;
    /** Emit an event to all subscribed handlers synchronously. */
    emit<K extends keyof EventMap>(event: K, payload: EventMap[K]): void;
    /** Remove all listeners for a specific event or all events. */
    clear(event?: keyof EventMap): void;
    /** Check if an event has any listeners. */
    hasListeners(event: keyof EventMap): boolean;
}
export {};
//# sourceMappingURL=EventBus.d.ts.map