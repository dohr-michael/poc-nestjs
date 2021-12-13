import { EventReducer, EventReducerBuilder, reduceAll } from './event-reducer';

abstract class EventType {constructor(public readonly name: string) {}}
class Event1 extends EventType {}
class Event2 extends EventType {}
class Event3 extends EventType {}

abstract class StateType {constructor(public readonly name: string) {}}
class State1 extends StateType {}
class State2 extends StateType {}
class State3 extends StateType {constructor(name: string, public readonly other: string) {super(name);}}


describe('EventReducer', () => {
    let reducerBuilder: EventReducerBuilder<EventType, StateType>
    let reducer: EventReducer<EventType, StateType>;

    beforeAll(async () => {
        reducerBuilder = EventReducerBuilder
            .fromEmpty<EventType, StateType>(Event1, (e: Event1) => new State1(e.name))
            .fromEmpty(Event2, (e: Event2) => new State2(e.name))
            .from(Event2, State1, (e, s) => new State3(s.name, e.name))
            .from(Event3, State1, (e, s) => new State3(s.name, e.name));
        reducer = reducerBuilder.asReducer();
    });

    describe('reducer', () => {
        it('should return state fromEmpty definition', () => {
            const value1 = reducer(new Event1('test1'), null);
            expect(value1).toBeInstanceOf(State1);
            expect(value1.name).toBe('test1');
            const value2 = reducer(new Event2('test2'), null);
            expect(value2).toBeInstanceOf(State2);
            expect(value2.name).toBe('test2');
        });
        it('should return state from definition', () => {
            const evt3 = new Event3('my other');
            const state = new State1('my name');
            const value = reducer(evt3, state);
            expect(value).toBeInstanceOf(State3);
            expect(value.name).toBe('my name');
            expect((value as State3).other).toBe('my other');
        })
        it('should return an exception if the transition is not in the state machine', () => {
            expect(() => reducer(new Event3('toto'), null)).toThrow();
            expect(() => reducer(new Event3('test1'), new State3('test1', 'test2'))).toThrow();
        });
        it('should return an exception if transition already exists in definition', () => {
            expect(() => reducerBuilder.fromEmpty(Event1, () => new State1(''))).toThrow();
            expect(() => reducerBuilder.from(Event3, State1, () => new State1(''))).toThrow();
        });
        it('should reduce all without error', () => {
            const result1 = reduceAll(reducer, [new Event1('evt1'), new Event3('evt3')]);
            expect(result1).toBeInstanceOf(State3);
            expect(result1.name).toBe('evt1');
            expect((result1 as State3).other).toBe('evt3');

            const result2 = reduceAll(reducer, [new Event3('evt3')], new State1('evt1'));
            expect(result2).toBeInstanceOf(State3);
            expect(result2.name).toBe('evt1');
            expect((result2 as State3).other).toBe('evt3');
        })
    });
});
