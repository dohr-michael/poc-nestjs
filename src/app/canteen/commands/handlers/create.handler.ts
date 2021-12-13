import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CommandEngine, FromEmptyStateCommandHandler } from '~/tools/cqrs';
import { CanteenState } from '~/app/canteen/states';
import { CanteenEvent, Created } from '~/app/canteen/events';
import { CreateEnvelop } from '~/app/canteen/commands';

@CommandHandler(CreateEnvelop)
export class CreateHandler extends FromEmptyStateCommandHandler<CreateEnvelop, CanteenEvent> {
    constructor(@Inject('canteen-command-engine') commandEngine: CommandEngine<CanteenEvent, CanteenState, any>) {
        super('create', commandEngine);
    }

    protected async applyCommand(command: CreateEnvelop): Promise<CanteenEvent> {
        return new Created(command.command.name, command.command.location, command.context.userId, command.context.now);
    }
}
