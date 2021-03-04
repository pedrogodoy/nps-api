import request from 'supertest';
import { app } from '../app';

import createConnection from '../database'

describe("User",  () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = await createConnection();
    await connection.dropDatabase();
  })

  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/users")
    .send({
      email: "user@example1.com",
      name: "User Example"
    });

    expect(response.status).toBe(201);
  });

  it("should not be able to create a user with exists email", async () => {
    const response = await request(app).post("/users")
    .send({
      email: "user@example1.com",
      name: "User Example"
    });

    expect(response.status).toBe(400);
  });

});