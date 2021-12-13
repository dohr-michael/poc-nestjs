import { ICommandHandler } from '@nestjs/cqrs';
import { Optional } from '~/tools/types';
import { CommandEnvelop } from './command-envelop';
import { CommandEngine } from '~/tools/cqrs/command-engine';
import { Context } from '~/context';
import * as exceptions from './cqrs-exceptions';

export abstract class AbstractCommandHandler<State,
    Command extends CommandEnvelop<any>,
    Event> implements ICommandHandler<Command, State> {

    protected constructor(
        readonly name: string,
        readonly engine: CommandEngine<Event, State, Command>,
    ) {}

    private applyCommandThis: (entity: Optional<State>, command: Command) => Promise<Event> = (state, command) => {
        return this.isAvailableAt(state, command.context).then(() => this.applyCommand(command, state));
    };

    protected isAvailableAt(state: Optional<State>, ctx: Context): Promise<void> {
        return Promise.resolve();
    }

    protected abstract applyCommand(command: Command, state: Optional<State>): Promise<Event>;

    async execute(command: Command): Promise<State> {
        return this.engine.run(this.name, command, this.applyCommandThis);
    }
}

export abstract class FromEmptyStateCommandHandler<Command extends CommandEnvelop<any>, Event> extends AbstractCommandHandler<any, Command, Event> {
    protected isAvailableAt(state: Optional<undefined>, ctx: Context): Promise<void> {
        if (!state) {
            return Promise.resolve();
        }
        return Promise.reject(new exceptions.BadRequestException('errors.commands.non-empty-state'));
    }

    protected abstract applyCommand(command: Command): Promise<Event>;
}

export abstract class FromNonEmptyStateCommandHandler<State, Command extends CommandEnvelop<any>, Event> extends AbstractCommandHandler<State, Command, Event> {
    protected isAvailableAt(state: Optional<State>, ctx: Context): Promise<void> {
        if (state) {
            return Promise.resolve();
        }
        return Promise.reject(new exceptions.BadRequestException('errors.commands.empty-state'));
    }

    protected abstract applyCommand(command: Command, state: State): Promise<Event>;
}
