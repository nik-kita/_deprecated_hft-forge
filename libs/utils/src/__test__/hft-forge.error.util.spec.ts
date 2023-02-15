import { HftForgeError } from '..';


describe(HftForgeError.name, () => {
    it('Should be thrown', () => {
        try {
            throw new HftForgeError('oops');
        } catch (error) {
            if (error instanceof HftForgeError) {
                expect(error.name).toBe(HftForgeError.name);
                expect(error.message).toBe('oops');
            } else {
                expect('not').toBe('here');
            }
        }
    });

    it('Should contain details', () => {
        const sound = 'hmm';

        try {
            throw new HftForgeError('oops', { sound });
        } catch (error) {
            if (error instanceof HftForgeError) {
                expect(error.message).toBe('oops');
                expect(error.details.sound).toBe('hmm');
            } else {
                expect('not').toBe('here');
            }
        }
    });

    it('Should not be recognized on standard error', () => {
        try {
            throw new Error();
        } catch (error) {
            if (error instanceof HftForgeError) {
                expect('not').toBe('here');
            }
        }
    });
});
