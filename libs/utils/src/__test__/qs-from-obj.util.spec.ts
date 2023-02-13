import { qsFromObj } from '..';

describe(qsFromObj.name, () => {
    it.each([
        { hello: 'world' },
        { ok: 'google', repeat: 1000 },
        { users: ['biba', 'boba'] },
    ])('Should correctly parse %j to query string', (obj) => {
        const actual = qsFromObj(obj);
        const completedUrlSearchParams = Object.entries(obj).reduce((acc, [k, v]) => {
            acc.append(k, v);

            return acc;
        }, new URLSearchParams());

        expect(actual).toBe(completedUrlSearchParams.toString());
    });
});
