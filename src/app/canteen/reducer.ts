import { EventReducer, EventReducerBuilder } from '~/tools/cqrs';
import * as events from './events';
import * as states from './states';
import { CanteenState } from './states';

export const canteenReducer: EventReducer<any, any> = EventReducerBuilder
    .fromEmpty<events.CanteenEvent, states.CanteenState>(events.Created, states.CanteenState.onCreated)
    .from(events.AddressChanged, states.CanteenState, (e, s) => s.onAddressChanged(e))
    .from(events.PeriodAdded, states.CanteenState, (e, s) => s.onPeriodAdded(e))
    .asReducer
