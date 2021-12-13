// eslint-disable-next-line @typescript-eslint/ban-types
export type Constructor = new (...args: any[]) => {};
export type ClassOf<T> = new (...args: any[]) => T;
