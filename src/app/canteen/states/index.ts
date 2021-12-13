import { Context } from '~/context';
import { AddressChanged, Created, PeriodAdded } from '../events';

export class CanteenState {
    constructor(
        public readonly name: string,
        public readonly location: string,
        public readonly periods: Array<{ id: string, name: string }>,
        public readonly createdAt: Date,
    ) {}

    private copy(props: Partial<CanteenState>): CanteenState {
        return new CanteenState(
            props.name || this.name,
            props.location || this.location,
            [ ...(props.periods || this.periods) ],
            props.createdAt || this.createdAt,
        )
    }

    static onCreated(evt: Created): CanteenState {
        return new CanteenState(evt.name, evt.location, [], evt.at);
    }

    onAddressChanged(evt: AddressChanged): CanteenState {
        return this.copy({
            location: evt.location,
        });
    }

    onPeriodAdded(evt: PeriodAdded): CanteenState {
        return this.copy({
            periods: this.periods.concat([ { id: evt.periodId, name: evt.name } ])
        });
    }
}
