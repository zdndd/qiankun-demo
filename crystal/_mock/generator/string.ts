import _ from 'lodash';
import { genRangeInteger } from './number'

const digits = '0123456789'
const lowerLetters = 'abcdefghijklmnopqrstuvwxyz'
const upperLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const letters = digits + lowerLetters + upperLetters

export function genChineseString (length: number) {
    const chineseLetters = []
    while(length--) {
        const letterCharCode = genRangeInteger(0x4E00, 0x9FA5)
        chineseLetters.push(letterCharCode)
    }
    return String.fromCharCode(...chineseLetters)
}

export function genString (length: number, prefix: string = '', seed = letters) {
    return prefix + (_.range(length) as number[]).map(() => {
        const index = genRangeInteger(0, seed.length)
        return seed[index]
    }).join('')
}

export function genIntString (length: number, prefix: string = '') {
    return genString(length, prefix, digits)
}

export function genGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
        const digit = genRangeInteger(0, 15)
        return digit.toString(16)
    });
}
