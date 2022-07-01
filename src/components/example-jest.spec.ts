import { sum } from "./example-jest"

it('sum 5 and 2 will return 7', () => {
    expect(sum(5,2)).toBe(7)
})