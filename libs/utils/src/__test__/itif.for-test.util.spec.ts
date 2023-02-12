import { itif } from '..';


describe(itif.name, () => {
    let shouldBeExecuted = false;
    let shouldBeSkipped = false;

    itif(true)('Should be executed', () => {
        shouldBeExecuted = true;
    });

    itif(false)('Should be skipped', () => {
        shouldBeSkipped = true;
    });

    describe('Check conditional test executions', () => {
        it('Should be executed', () => {
            expect(shouldBeExecuted).toBe(true);
        });

        it('Shoudl be skipped', () => {
            expect(shouldBeSkipped).toBe(false);
        });
    });
});
