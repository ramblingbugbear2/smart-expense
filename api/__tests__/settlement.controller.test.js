/**
 * settlement.controller.test.js
 */
jest.setTimeout(20000); // plenty of time

const http                = require('http');
const request             = require('supertest');
const mongoose            = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app                 = require('../app');
const User                = require('../models/user.model');
const Group               = require('../models/group.model');
const Expense             = require('../models/expense.model');
const Settlement          = require('../models/settlement.model');

describe('Settlements API (integration)', () => {
  let server;
  let mongod;
  let uri;
  let token;
  let users, group;

  beforeAll(async () => {
    // 1) Spin up in-memory MongoDB
    mongod = await MongoMemoryServer.create();
    uri    = mongod.getUri();

    // 2) Connect mongoose to it
    await mongoose.connect(uri, {});

    // 3) Start an HTTP server on a random port
    server = http.createServer(app).listen(0);

    // 4) Seed your users with valid passwords
    users = await User.create([
      { name: 'Alice', email: 'a@x.com', password: 'password' },
      { name: 'Bob',   email: 'b@x.com', password: 'password' },
      { name: 'Carol', email: 'c@x.com', password: 'password' },
    ]);

    // 5) Create a group
    group = await Group.create({
      name:      'TestGroup',
      members:   users.map((u) => u._id),
      createdBy: users[0]._id,
    });

    // 6) Seed an expense
    await Expense.create({
      group:        group._id,
      payer:        users[0]._id,
      amount:       300,
      description:  'Dinner',
      participants: [
        { user: users[1]._id, share: 150 },
        { user: users[2]._id, share: 150 },
      ],
    });
    // // 7) Seed one settlement so the history endpoint returns something
    //   await Settlement.create({
    //     group:  group._id,
    //     from:   users[1]._id,
    //     to:     users[0]._id,
    //     amount: 150,
    //     note:   'Settling dinner',
    //   });
        // 8) Forge a token that protect.js will accept
    const jwt = require('jsonwebtoken');
    process.env.JWT_ACCESS_SECRET = 'test-secret';     // same env var the guard reads
    token = jwt.sign(
      { userId: users[0]._id.toString() },             // payload field must be userId
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '1h' }
    );    
  });

  afterAll(async () => {
    // Tear everything down
    await mongoose.disconnect();
    await mongod.stop();
    server.close();
  });

  test('GET pending returns optimal transfers', async () => {
    const res = await request(server)
      .get(`/api/settlements/pending/${group._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { from: users[1]._id.toString(), to: users[0]._id.toString(), amount: 150 },
      { from: users[2]._id.toString(), to: users[0]._id.toString(), amount: 150 },
    ]);
  });

  test('POST /settlements creates a settlement', async () => {
    const payload = {
      group:  group._id.toString(),
      from:   users[1]._id.toString(),
      to:     users[0]._id.toString(),
      amount: 150,
      note:   'Settling dinner',
    };

    const res = await request(server)
      .post('/api/settlements')
      .set('Authorization', `Bearer ${token}`)
      .send(payload);
 
    expect(res.status).toBe(201);
    expect(res.body).toMatchObject(payload);

    const docs = await Settlement.find({ group: group._id });
    expect(docs).toHaveLength(1);
  });

  test('GET /group/:id returns history', async () => {
    const res = await request(server)
      .get(`/api/settlements/group/${group._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0]).toHaveProperty('amount', 150);
  });
});
