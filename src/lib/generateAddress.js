import { faker } from '@faker-js/faker';

// Generates a realistic email local part using faker
export function generateAddress() {
    // Use first and last name, add a random number for uniqueness
    const first = faker.person.firstName().toLowerCase();
    const last = faker.person.lastName().toLowerCase();
    const num = Math.floor(Math.random() * 10000);
    return `${first}.${last}${num}`;
}
