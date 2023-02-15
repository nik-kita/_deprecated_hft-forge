import { itif } from '..';


describe(itif.name, () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {
        /**
         * Comment this /.spyOn/ if you want to enable console.warn it these tests
         */
    });

    let shouldBeExecuted = 0;
    let shouldBeSkipped = 0;
    
    const ITIF = process.env.ITIF;

    afterAll(() => {
        if (ITIF) process.env.ITIF = ITIF;
        else delete process.env.ITIF;
    });

    describe('All these tests should be skipped', () => {
        describe('When "ITIF" cli variable is not provided', () => {
            delete process.env.ITIF;

            itif({ customCondition: true })('Should be skipped even with truly condition', () => {
                ++shouldBeSkipped;

                expect(process.env.ITIF).toBeUndefined();
                expect('not').toBe('here');
            });
        });


        describe('Even when run with "ITIF=true"', () => {
            process.env.ITIF = 'true';

            itif({ customCondition: false })('Should be skipped because of "customCondition: false"', () => {
                ++shouldBeSkipped;
   
                expect(process.env.ITIF).toBe('true');
                expect('not').toBe('here');
            });
    
            itif({ customCondition: () => false })('Should be skipped because of "customCondition" callback', () => {
                ++shouldBeSkipped;
    
                expect('not').toBe('here');
            });

            itif({ needEnv: {
                envFilePath: '.unexisted.env',
                envVariables: ['FAKE', 'VARIABLES'],
            }})('Should be skipped because need some environment variables', () => {
                ++shouldBeSkipped;
    
                expect('not').toBe('here');
            });
        });
    });

    describe('All these tests should not be skipped', () => {
        process.env.ITIF = 'true';

        // 1
        itif({ customCondition: true })('Should be executed "customCondition: true"', () => {
            ++shouldBeExecuted;
        });

        // 2
        itif({ customCondition: () => true })('Should be executed "customCondition: () => true"', () => {
            ++shouldBeExecuted;
        });
    });

    describe('Check conditional test executions', () => {
        it('Should execute all tests with final truly condition', () => {
            /**
             * Total tests count inside "All these tests should not be skipped" describe block
             */
            const TOTAL_NOT_SKIPPED_TESTS_COUNT = 2;

            expect(shouldBeExecuted).toBe(TOTAL_NOT_SKIPPED_TESTS_COUNT);
        });

        it('Should not execute any of tests that has final falsy condition', () => {
            expect(shouldBeSkipped).toBe(0);
        });
    });
});
