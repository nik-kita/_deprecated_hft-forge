import { genUniqueStr } from '..';

describe(genUniqueStr.name, () => {
    it('Should never repeat', () => {
        const generated = new Set<string>();
        const expected = 100_000;

        for (let i = 0; i < expected; ++i) {
            generated.add(genUniqueStr());
        }

        expect(generated.size).toBe(expected);
    });
});
