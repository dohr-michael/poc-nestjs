import { Optional } from '../types';
import { ClassOf } from '~/tools/types/class-of';

export type EventReducer<Event, State> = (event: Event, state: Optional<State>) => State;
export type EventPredicate<Event, State> = (event: ClassOf<Event>, state: Optional<ClassOf<State>>) => boolean;

function asPredicate<Event, State>(eventClass: ClassOf<Event>, stateClass?: ClassOf<State>): EventPredicate<Event, State> {
    return (cEvent, cState) => {
        if (!stateClass && cState || stateClass && !cState) return false;
        if (cEvent !== eventClass) return false;
        if (stateClass && cState) return stateClass === cState;
        return true;
    }
}

export function reduceAll<Event, State>(reducer: EventReducer<Event, State>, events: Array<Event>, initialState?: State): State {
    return events.reduce<State>((state, evt) => reducer(evt, state), initialState);
}

export class EventReducerBuilder<Event, State> {
    constructor(
        private reducers: Array<{ predicate: (event: ClassOf<Event>, state: Optional<ClassOf<State>>) => boolean, reducer: EventReducer<Event, State> }>
    ) {}

    static fromEmpty<Event, State, CurrentEvent extends Event = Event>(eventClass: ClassOf<CurrentEvent>, reducer: (evt: CurrentEvent) => State): EventReducerBuilder<Event, State> {
        return new EventReducerBuilder<Event, State>([ { predicate: asPredicate(eventClass), reducer } ])
    }

    fromEmpty<CurrentEvent extends Event = Event>(eventClass: ClassOf<CurrentEvent>, reducer: (evt: CurrentEvent) => State): EventReducerBuilder<Event, State> {
        if (!!this.reducers.find(r => r.predicate(eventClass, null))) {
            throw new Error(`predicate from event ${ eventClass.name } already exists`);
        }
        this.reducers = [ ...this.reducers, { predicate: asPredicate(eventClass), reducer } ];
        return this;
    }

    fromPredicate<CurrentEvent extends Event = Event, CurrentState extends State = State>(predicate: EventPredicate<CurrentEvent, CurrentState>, reducer: (evt: CurrentEvent, state: CurrentState) => State): EventReducerBuilder<Event, State> {
        this.reducers = [ ...this.reducers, { predicate, reducer } ];
        return this;
    }

    from<CurrentEvent extends Event = Event, CurrentState extends State = State>(eventClass: ClassOf<CurrentEvent>, stateClass: ClassOf<CurrentState>, reducer: (evt: CurrentEvent, state: CurrentState) => State): EventReducerBuilder<Event, State> {
        if (!!this.reducers.find(r => r.predicate(eventClass, stateClass))) {
            throw new Error(`predicate from event ${ eventClass.name } and state ${ stateClass.name } already exists`);
        }
        return this.fromPredicate(asPredicate(eventClass, stateClass), reducer);
    }

    asReducer(): EventReducer<Event, State> {
        const reducers = this.reducers.concat([]);
        return (event: Event, state: Optional<State>): State => {
            const fn = reducers.find(r => r.predicate(event.constructor as ClassOf<Event>, state ? state.constructor as ClassOf<State> : null));
            if (!fn) {
                throw new Error(`no transition found between ${ event.constructor.name } ${ state ? state.constructor.name : 'empty' }`);
            }
            return fn.reducer(event, state);
        }
    }
}

