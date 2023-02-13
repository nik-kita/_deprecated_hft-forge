import { BindThis } from '..';

class NonDecorated {
    secret = 'world';

    method() {
        return {
            hello: this.hello
        };
    }

    hello() {
        return this.secret;
    }
}

@BindThis()
class Decorated {
    secret = 'world';

    method() {
        return {
            hello: this.hello
        };
    }

    hello() {
        return this.secret;
    }
}

@BindThis()
class DecoratedButExtended extends NonDecorated {
    secret = 'google';

    childMethod() {
        return {
            ok: this.ok,
        };
    }

    ok() {
        return this.secret;
    }
}

describe(BindThis.name, () => {
    it.each([NonDecorated, DecoratedButExtended])('/hello/ method should NOT return /"world"/', (clazz) => {
        const actual = new clazz().method().hello();

        expect(actual).not.toBe('world');
    });

    it('/hello/ method should return /"world"/', () => {
        const actual = new Decorated().method().hello();

        expect(actual).toBe('world');
    });

    it('/ok/ method should return /google/', () => {
        const actual = new DecoratedButExtended().childMethod().ok();

        expect(actual).toBe('google');
    });
});
