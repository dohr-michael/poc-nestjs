import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Collection, Db, IndexSpecification, MongoClient } from 'mongodb';

export * from './mongo-repository';

export function collectionFeature(collectionName: string): string { return `MONGO_COLLECTION_${ collectionName }`;}
function toIndexName(index: any): string {
  if (!index) return '';
  if (index.name) return index.name;
  if (!index.key || typeof index.key !== 'object') return '';
  return Object.keys(index.key).map(c => `${ c }_${ index.key[ c ] }`).join('_');
}

@Module({})
export class CollectionModule {

}

@Global()
@Module({})
export class MongoModule {
  static async forFeature(collectionName: string, autoIndexes: Array<IndexSpecification> = []): Promise<DynamicModule> {
    const collectionInitProvider: Provider = {
      provide: `INIT_${ collectionFeature(collectionName) }`,
      inject: [ Db ],
      useFactory: async (db: Db): Promise<Collection> => {
        const cols = await db.collections();
        let col: Collection = cols.find(c => c.collectionName === collectionName);
        if (!col) {
          col = await db.createCollection(collectionName);
        }
        if (autoIndexes.length === 0) return col;
        const indexes = (await col.listIndexes().toArray()).map(toIndexName);
        const toCreate = autoIndexes.filter(v => {
          const name = toIndexName(v);
          return !indexes.includes(name);
        });
        if (toCreate.length === 0) return col;
        await col.createIndexes(toCreate);
        return col;
      },
    };
    const collectionProvider: Provider = {
      provide: collectionFeature(collectionName),
      inject: [ `INIT_${ collectionFeature(collectionName) }` ],
      useFactory(col: Collection): Collection {
        return col;
      },
    };
    return {
      module: CollectionModule,
      imports: [ MongoModule ],
      providers: [
        collectionInitProvider,
        collectionProvider,
      ],
      exports: [
        collectionProvider,
      ],
    };
  }

  static async forRootAsync(): Promise<DynamicModule> {
    const mongoClientAsyncProvider: Provider = {
      provide: 'ASYNC_MONGO_CLIENT',
      inject: [ ConfigService ],
      useFactory: async (config: ConfigService): Promise<MongoClient> => {
        return MongoClient.connect(config.get('mongo.uri'), { useUnifiedTopology: true });
      },
    };
    const mongoClientProvider: Provider<MongoClient> = {
      provide: MongoClient,
      inject: [ 'ASYNC_MONGO_CLIENT' ],
      useFactory(client: MongoClient) { return client; },
    };
    const mongoDatabaseProvider: Provider<Db> = {
      provide: Db,
      inject: [ MongoClient ],
      useFactory(client: MongoClient) {
        console.log('mongo_db');
        return client.db();
      },
    };

    return {
      module: MongoModule,
      imports: [ ConfigModule ],
      providers: [
        mongoClientAsyncProvider,
        mongoClientProvider,
        mongoDatabaseProvider,
      ],
      exports: [
        mongoClientProvider,
        mongoDatabaseProvider,
      ],
    };
  }
}
