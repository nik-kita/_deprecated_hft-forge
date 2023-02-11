import { faker } from '@faker-js/faker';


export function genUniqueStr() {
    return faker.helpers.unique(() => {
        return `Bird "${faker.animal.bird()}" ${faker.name.firstName()}`;
    });
}
