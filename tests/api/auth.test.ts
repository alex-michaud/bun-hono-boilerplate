import { beforeAll, describe, expect, it } from 'bun:test';
import { faker } from '@faker-js/faker';
import { app } from '../../src/server';

let testPassword: string;
let testEmail: string;
let testName: string;

describe('Auth API endpoints', () => {
  beforeAll(async () => {
    testPassword = faker.internet.password();
    testEmail = faker.internet.email().toLocaleLowerCase();
    testName = faker.person.fullName();
  });

  it('should sign up a user', async () => {
    const user = {
      email: testEmail,
      password: testPassword,
      name: testName,
    };
    const response = await app.request('/api/auth/sign-up/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sign Up failed: ${errorText}`);
    }
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      user: {
        id: string;
        email: string;
        name: string;
        image: string;
        emailVerified: boolean;
      };
      token: string;
    };
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('email', user.email.toLocaleLowerCase());
    expect(body.user).toHaveProperty('name', user.name);
    expect(body).toHaveProperty('token');
  });

  it('should sign in a user', async () => {
    const response = await app.request('/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Sign In failed: ${errorText}`);
    }
    expect(response.status).toBe(200);
    const body = (await response.json()) as {
      user: {
        id: string;
        email: string;
        name: string;
        image: string;
        emailVerified: boolean;
      };
      token: string;
    };
    expect(body).toHaveProperty('user');
    expect(body.user).toHaveProperty('id');
    expect(body.user).toHaveProperty('email', testEmail);
    expect(body.user).toHaveProperty('name', testName);
    expect(body).toHaveProperty('token');
  });
});
