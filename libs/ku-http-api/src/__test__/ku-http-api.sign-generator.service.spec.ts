import { KuSignGeneratorService } from '..';


describe(KuSignGeneratorService.name, () => {
    const keys = {
        API_PASSPHRASE: 'hello world',
        API_SECRET: 'sim-sim',
        API_KEY: 'alahamora',
    };

    it.skip.each([
        {
            expectedStr: JSON.stringify({
                'KC-API-SIGN': 'Ms20xHvWR51XwBNNqnB40JAmUO3RbqRVHYYncfumD6A=',
                'KC-API-TIMESTAMP': '1577836800000',
                'KC-API-KEY': 'alahamora',
                'KC-API-PASSPHRASE': 'IUJZ5Zwp1jJNF27rOadt0ALeI9Winz4jK/fCYArH+Go=',
                'KC-API-KEY-VERSION': '2',
                'Content-Type': 'application/json'
            }, null, 4),
            source: {
                method: 'GET',
                endpoint: '/test',
                body: {} as any,
                params: { foo: 'bar' },
            } as const,
        },
        {
            expectedStr: JSON.stringify({
                'KC-API-SIGN': 'BIISeG5/7mJo/sTxkk0JOcxcFBhHeu4xXw4KG/crKvA=',
                'KC-API-TIMESTAMP': '1577836800000',
                'KC-API-KEY': 'alahamora',
                'KC-API-PASSPHRASE': 'IUJZ5Zwp1jJNF27rOadt0ALeI9Winz4jK/fCYArH+Go=',
                'KC-API-KEY-VERSION': '2',
                'Content-Type': 'application/json'
            }, null, 4),
            source: {
                method: 'POST',
                endpoint: '/test2',
            } as const,
        }
    ])('Should generate $expectedStr from $sourceStr', ({ expectedStr, source }) => {
        jest
            .useFakeTimers()
            .setSystemTime(new Date('2020-01-01'));

        const actual = new KuSignGeneratorService().generateHeaders(source, keys);
        const expected = JSON.parse(expectedStr);

        expect(actual).toEqual(expected);
    });
});

