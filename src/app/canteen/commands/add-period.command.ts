import { CommandEnvelop } from '~/tools/cqrs';

export class AddPeriod {
    constructor(
        public readonly periodId: string,
        public readonly name: string,
    ) {}
}

export class AddPeriodEnvelop extends CommandEnvelop<AddPeriod> {}
