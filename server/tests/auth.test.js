const test = require('node:test');
const assert = require('node:assert/strict');
const { hashPassword, verifyPassword, signToken, verifyToken } = require('../src/utils/auth');

test('Auth Unit Tests - Password Hashing & Verification', async (t) => {
  await t.test('hashPassword should generate salt:hash format', () => {
    const hash = hashPassword('secretPassword123');
    assert.ok(hash.includes(':'), 'Hash must contain a salt delimiter');
    const parts = hash.split(':');
    assert.equal(parts.length, 2, 'Hash must consist of salt and key');
    assert.ok(parts[0].length >= 32, 'Salt should be at least 16 bytes in hex');
    assert.ok(parts[1].length >= 64, 'Key should be at least 32 bytes in hex');
  });

  await t.test('verifyPassword should return true for correct password', () => {
    const hash = hashPassword('correctPassword');
    const isValid = verifyPassword('correctPassword', hash);
    assert.equal(isValid, true, 'Matching password must be verified as true');
  });

  await t.test('verifyPassword should return false for incorrect password', () => {
    const hash = hashPassword('correctPassword');
    const isValid = verifyPassword('wrongPassword', hash);
    assert.equal(isValid, false, 'Mismatched password must return false');
  });

  await t.test('verifyPassword should handle empty or null values gracefully', () => {
    assert.equal(verifyPassword('', 'invalid:hash'), false);
    assert.equal(verifyPassword(null, 'invalid:hash'), false);
    assert.equal(verifyPassword('pass', ''), false);
    assert.equal(verifyPassword('pass', 'nosalt'), false);
  });
});

test('Auth Unit Tests - JWT Signing & Verification', async (t) => {
  await t.test('signToken should produce a valid 3-segment JWT string', () => {
    const payload = { id: 10, email: 'tester@example.com', role: 'user' };
    const token = signToken(payload, 3600);
    assert.equal(typeof token, 'string');
    const parts = token.split('.');
    assert.equal(parts.length, 3, 'JWT must have header, payload, and signature');
  });

  await t.test('verifyToken should successfully decode valid token payload', () => {
    const payload = { id: 42, email: 'admin@hotels.com', role: 'admin' };
    const token = signToken(payload, 3600);
    const decoded = verifyToken(token);
    assert.ok(decoded, 'Decoded token should not be null');
    assert.equal(decoded.id, 42);
    assert.equal(decoded.email, 'admin@hotels.com');
    assert.equal(decoded.role, 'admin');
    assert.ok(decoded.exp > Math.floor(Date.now() / 1000));
  });

  await t.test('verifyToken should reject tampered signatures', () => {
    const token = signToken({ id: 1, role: 'user' }, 3600);
    const tampered = token.slice(0, -5) + 'abcde';
    const decoded = verifyToken(tampered);
    assert.equal(decoded, null, 'Tampered token must fail verification');
  });

  await t.test('verifyToken should reject expired tokens', () => {

    const expiredToken = signToken({ id: 99 }, -10);
    const decoded = verifyToken(expiredToken);
    assert.equal(decoded, null, 'Expired token must fail verification');
  });
});
