import { describePortal } from '..';

const separateDescribe = (name: string, getContext: () => {
    hello: string,
}) => describe(name, () => {
    let hello: string;

    beforeEach(() => {
        hello = getContext().hello;
    });

    it('Should return "hello world"', () => {
        expect(hello).toBe('world');
        console.log(hello);
    });
});

describe(describePortal.name, () => {
    separateDescribe('Check mounting "describe" from another file', () => ({ hello: 'world' }));
});
