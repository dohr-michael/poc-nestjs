import { Collection, FilterQuery, FindOneOptions, OptionalId } from 'mongodb';

export abstract class MongoRepository<Doc extends { _id: any }, Type> {
    protected constructor(
        protected readonly collection: Collection<Doc>,
        private readonly toType: (doc: Doc) => Type,
        private readonly toDoc: (entity: Type) => Doc,
    ) {}

    byId(id: any): Promise<Type | undefined> {
        return this.collection.findOne({ _id: id }).then(doc => {
            if (!doc) return undefined;
            return this.toType(doc);
        });
    }

    filter(query: FilterQuery<Doc> = {}, options: FindOneOptions<never> = { limit: 10, skip: 0 }): Promise<Array<Type>> {
        return this.collection.find(query, options).toArray().then(a => a.map(this.toType));
    }

    insertOne(entity: Type): Promise<Type> {
        return this.collection.insertOne(this.toDoc(entity) as OptionalId<never>).then(() => entity);
    }

}
