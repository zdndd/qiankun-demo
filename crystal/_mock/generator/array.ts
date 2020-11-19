import _ from 'lodash';
import { genRangeInteger } from './number';

export function genRangeArray(source: any[], length: number) {
    return _.range(length).map(() => {
        const index = genRangeInteger(0, source.length);
        return source[index];
    });
}

export function genUniqueRangeArray(source: any[], length: number) {
    const result = new Set();
    while (result.size < length) {
        const index = genRangeInteger(0, source.length);
        result.add(source[index]);
    }
    return Array.from(result);
}
