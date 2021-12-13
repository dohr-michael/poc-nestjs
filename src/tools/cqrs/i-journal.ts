export interface IJournal<Event> {
    byEntityId(entityId: string): Promise<Array<Event>>;
    save(entityId: string, event: Event): Promise<void>;
}
