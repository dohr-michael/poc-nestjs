import { CommandEnvelop } from '~/tools/cqrs';

export class Create {
    constructor(
        public readonly name: string,
        public readonly location: string,
    ) {}
}

export class CreateEnvelop extends CommandEnvelop<Create> {}
