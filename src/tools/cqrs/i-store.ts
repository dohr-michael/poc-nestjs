import { Optional } from '~/tools/types';

export interface IStore<M> {
    byId(id: string): Promise<Optional<M>>;
    save(entity: M): Promise<void>;
}
