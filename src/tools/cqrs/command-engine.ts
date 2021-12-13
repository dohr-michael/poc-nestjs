import { EventReducer, reduceAll } from './event-reducer';
import { IJournal } from './i-journal';
import { IStore } from './i-store';
import { CommandEnvelop } from './command-envelop';
import { EventBus } from '@nestjs/cqrs';
import { Optional } from '../types';

export class CommandEngine<Event, State, Command extends CommandEnvelop<any>> {
    constructor(
        readonly eventBus: EventBus,
        readonly reducer: EventReducer<Event, State>,
        readonly journal: IJournal<Event>,
        readonly store: IStore<State>,
    ) {}

    async run(name: string, command: Command, handle: (state: Optional<State>, command: Command) => Promise<Event>): Promise<State> {
        await command.context.isAllowed(name);
        const events = await this.journal.byEntityId(command.entityId);
        const entity = reduceAll(this.reducer, events);
        const event = await handle(entity, command);
        const newEntity = reduceAll(this.reducer, [ event ], entity);
        await this.journal.save(command.entityId, event);
        await this.store.save(newEntity);
        this.eventBus.publish(event);
        return newEntity;
    }
}
