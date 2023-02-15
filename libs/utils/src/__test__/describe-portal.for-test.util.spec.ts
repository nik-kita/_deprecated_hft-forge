import { describePortal } from '..';

const separateDescribe = (name: 'Check mounting "describe" from another file', getContext: () => {
    hello: string,
}) => describe(name, () => {
    let hello: string;

    beforeEach(() => {
        hello = getContext().hello;
    });

    it('Should return "hello world"', () => {
        expect(hello).toBe('world');
    });
});

describe(describePortal.name, () => {
    describePortal(
        separateDescribe,
        'Check mounting "describe" from another file',
        () => ({ hello: 'world' }),
    );
});
