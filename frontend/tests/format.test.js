import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatPrice,
  formatCoord,
  formatDate,
  getHotelLocation,
  calculateDistanceKm,
} from '../src/utils/format.js';

test('Format Utils Unit Tests', async (t) => {
  await t.test('formatPrice should output Rupee symbol (₹) and 2 decimals', () => {
    assert.equal(formatPrice(120), '₹120.00');
    assert.equal(formatPrice('99.5'), '₹99.50');
    assert.equal(formatPrice(0), '₹0.00');
    assert.equal(formatPrice('invalid'), '—');
  });

  await t.test('formatCoord should output 4 fixed decimal places', () => {
    assert.equal(formatCoord(26.912435), '26.9124');
    assert.equal(formatCoord(-18.52), '-18.5200');
    assert.equal(formatCoord('invalid'), '—');
  });

  await t.test('calculateDistanceKm should compute Haversine distance correctly', () => {

    const dist = calculateDistanceKm(28.6139, 77.209, 19.076, 72.8777);
    assert.ok(dist.includes('km'));
    const km = parseFloat(dist);
    assert.ok(km > 1100 && km < 1300, `Distance ${km}km should be around ~1160km`);

    const close = calculateDistanceKm(28.6139, 77.209, 28.6145, 77.2095);
    assert.ok(close.includes('m'));
  });

  await t.test('getHotelLocation should identify location from title/desc', () => {
    assert.equal(getHotelLocation({ title: 'Udaipur Pichola Suite' }), 'Udaipur, Rajasthan');
    assert.equal(getHotelLocation({ title: 'Goa Candolim Beach Villa' }), 'Candolim, Goa');
    assert.equal(getHotelLocation({ title: 'Dubai Marina Luxury Tower' }), 'Dubai Marina, UAE');
  });

  await t.test('getHotelLocation should fallback to coordinates if no text matches', () => {
    const loc = getHotelLocation({ title: 'Unnamed Stay', latitude: 15.2, longitude: 73.9 });
    assert.equal(loc, '15.20°N, 73.90°E');
  });
});
