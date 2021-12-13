export interface CanteenEvent {
    by: string;
    at: Date;
}

export class Created implements CanteenEvent {
    constructor(
        public readonly name: string,
        public readonly location: string, // TODO Change that to address.
        public readonly by: string,
        public readonly at: Date,
    ) {}
}

export class AddressChanged implements CanteenEvent {
    constructor(
        public readonly location: string,
        public readonly by: string,
        public readonly at: Date,
    ) {}
}

export class PeriodAdded implements CanteenEvent {
    constructor(
        public readonly periodId: string,
        public readonly name: string,
        public readonly by: string,
        public readonly at: Date,
    ) {}
}
