import { CommandEnvelop } from '~/tools/cqrs';

export class ChangeAddress {
    constructor(
        public readonly location: string,
    ) {}
}

export class ChangeAddressEnvelop extends CommandEnvelop<ChangeAddress> {}
