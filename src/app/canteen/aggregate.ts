import * as events from './events';
import { CanteenState } from './states';

export class Canteen {
    constructor(
        public readonly id: string,
        public readonly data?: CanteenState,
        public readonly version: number = 0,
    ) {}
}
