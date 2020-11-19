/**
 * 生成一个整数n，n ∈[start, end)
 */
export function genRangeInteger (start: number, end: number) {
    const delta = Math.random() * (end - start)
    return start + Math.floor(delta)
}
