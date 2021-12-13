import { Inject } from '@nestjs/common';
import { CommandHandler } from '@nestjs/cqrs';
import { CommandEngine, FromNonEmptyStateCommandHandler, BadRequestException } from '~/tools/cqrs';
import { CanteenState } from '~/app/canteen/states';
import { CanteenEvent, AddressChanged } from '~/app/canteen/events';
import { ChangeAddressEnvelop } from '~/app/canteen/commands';

@CommandHandler(ChangeAddressEnvelop)
export class ChangeAddressHandler extends FromNonEmptyStateCommandHandler<CanteenState, ChangeAddressEnvelop, CanteenEvent> {
    constructor(@Inject('canteen-command-engine') commandEngine: CommandEngine<CanteenEvent, CanteenState, any>) {
        super('change-address', commandEngine);
    }

    protected async applyCommand(command: ChangeAddressEnvelop, state: CanteenState): Promise<CanteenEvent> {
        if (state.location === command.command.location) {
            throw new BadRequestException('errors.commands.change-address.identical');
        }
        return new AddressChanged(command.command.location, command.context.userId, command.context.now);
    }
}
