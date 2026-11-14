const test = require('node:test');
const assert = require('node:assert/strict');

const BASE_URL = 'http://localhost:4001';

test('API Integration Unit Tests', async (t) => {
  let adminToken = '';
  let userToken = '';

  await t.test('GET /api/health should return ok: true', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.ok, true);
  });

  await t.test('GET /api/hotels should return paginated list of hotels', async () => {
    const res = await fetch(`${BASE_URL}/api/hotels?limit=5&offset=0`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.data), 'body.data must be an array');
    assert.ok(body.total >= 0, 'body.total must be numeric');
    assert.equal(body.limit, 5);
    assert.equal(body.offset, 0);
  });

  await t.test('GET /api/hotels with search query should filter by title', async () => {
    const res = await fetch(`${BASE_URL}/api/hotels?search=Lake`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.data));
    for (const hotel of body.data) {
      assert.match(hotel.title.toLowerCase(), /lake/);
    }
  });

  await t.test('GET /api/hotels with price range should filter correctly', async () => {
    const min = 100;
    const max = 250;
    const res = await fetch(`${BASE_URL}/api/hotels?minPrice=${min}&maxPrice=${max}`);
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(Array.isArray(body.data));
    for (const hotel of body.data) {
      const price = Number(hotel.price);
      assert.ok(price >= min && price <= max, `Price ${price} should be within [${min}, ${max}]`);
    }
  });

  await t.test('POST /api/auth/login with valid admin should return admin JWT token', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'namlaadmin@gmail.com', password: 'admin' }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.token, 'Must return JWT token');
    assert.equal(body.user.role, 'admin');
    assert.equal(body.user.email, 'namlaadmin@gmail.com');
    adminToken = body.token;
  });

  await t.test('POST /api/auth/login with valid user should return user JWT token', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'user@hotels.com', password: 'user' }),
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.ok(body.token);
    assert.equal(body.user.role, 'user');
    userToken = body.token;
  });

  await t.test('POST /api/auth/login with bad password should return 401', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'namlaadmin@gmail.com', password: 'wrongpassword' }),
    });
    assert.equal(res.status, 401);
  });

  await t.test('GET /api/auth/me should return authenticated profile with token', async () => {
    const res = await fetch(`${BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.equal(res.status, 200);
    const body = await res.json();
    assert.equal(body.user.email, 'namlaadmin@gmail.com');
  });

  await t.test('POST /api/hotels without token should be blocked with 401', async () => {
    const res = await fetch(`${BASE_URL}/api/hotels`, { method: 'POST' });
    assert.equal(res.status, 401);
  });

  await t.test('POST /api/hotels with standard user token should be blocked with 403', async () => {
    const res = await fetch(`${BASE_URL}/api/hotels`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.equal(res.status, 403);
  });
});
