import { Context } from '~/context';

export abstract class CommandEnvelop<T> {
    protected constructor(
        public readonly entityId: string,
        public readonly context: Context,
        public readonly command: T,
    ) {}
}
