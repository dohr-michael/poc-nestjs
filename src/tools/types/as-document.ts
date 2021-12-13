export type AsDocument<T extends { id: any, toDocument: () => AsDocument<T> }, Ex extends keyof T = never> = Omit<T, 'id' | 'toDocument' | Ex> & { _id: any };
