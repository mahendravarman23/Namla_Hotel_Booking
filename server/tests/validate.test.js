const test = require('node:test');
const assert = require('node:assert/strict');
const { validateHotelPayload } = require('../src/middleware/validate');

function createMockReqRes(body = {}, file = null) {
  const req = { body, file, clean: null };
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
      return this;
    },
  };
  return { req, res };
}

test('Validation Middleware Unit Tests', async (t) => {
  await t.test('should reject hotel payloads with empty fields', () => {
    const { req, res } = createMockReqRes({}, null);
    let nextCalled = false;
    const middleware = validateHotelPayload(true);

    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, false, 'Middleware should block empty request');
    assert.equal(res.statusCode, 400);
    assert.ok(res.data.errors.title, 'Should report missing title');
    assert.ok(res.data.errors.description, 'Should report missing description');
    assert.ok(res.data.errors.price, 'Should report missing price');
    assert.ok(res.data.errors.latitude, 'Should report missing latitude');
    assert.ok(res.data.errors.longitude, 'Should report missing longitude');
    assert.ok(res.data.errors.image, 'Should report missing image for create');
  });

  await t.test('should enforce coordinate boundaries (-90..90 and -180..180)', () => {
    const { req, res } = createMockReqRes({
      title: 'Valid Hotel Title',
      description: 'This is a sufficiently long description for validation.',
      price: '150.00',
      latitude: '95.5',
      longitude: '-200.0',
    }, { filename: 'test.jpg' });

    const middleware = validateHotelPayload(true);
    middleware(req, res, () => {});

    assert.equal(res.statusCode, 400);
    assert.ok(res.data.errors.latitude);
    assert.ok(res.data.errors.longitude);
  });

  await t.test('should allow optional image when requireImage is false (edit mode)', () => {
    const { req, res } = createMockReqRes({
      title: 'Updated Boutique Resort',
      description: 'Updated long description that exceeds ten characters.',
      price: '199.99',
      latitude: '26.9124',
      longitude: '75.7873',
    }, null);

    let nextCalled = false;
    const middleware = validateHotelPayload(false);
    middleware(req, res, () => {
      nextCalled = true;
    });

    assert.equal(nextCalled, true, 'Edit without new image should proceed');
    assert.equal(res.statusCode, 200);
    assert.equal(req.clean.title, 'Updated Boutique Resort');
    assert.equal(req.clean.price, 199.99);
    assert.equal(req.clean.latitude, 26.9124);
  });
});
