export function formatPrice(price) {
  const value = Number(price);
  return Number.isNaN(value) ? '—' : `₹${value.toFixed(2)}`;
}

export function formatCoord(value) {
  const n = Number(value);
  return Number.isNaN(n) ? '—' : n.toFixed(4);
}

export function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d < 1 ? `${Math.round(d * 1000)} m` : `${d.toFixed(1)} km`;
}

export function formatDate(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getHotelLocation(hotel) {
  if (!hotel) return 'Premier Stay';
  const text = `${hotel.title || ''} ${hotel.description || ''}`.toLowerCase();
  if (text.includes('pichola') || text.includes('udaipur')) return 'Udaipur, Rajasthan';
  if (text.includes('candolim') || text.includes('goa') || text.includes('sinquerim')) return 'Candolim, Goa';
  if (text.includes('mumbai') || text.includes('marine drive')) return 'Mumbai, Maharashtra';
  if (text.includes('jaipur') || text.includes('aravalli')) return 'Jaipur, Rajasthan';
  if (text.includes('manali')) return 'Manali, Himachal Pradesh';
  if (text.includes('rishikesh') || text.includes('ganga')) return 'Rishikesh, Uttarakhand';
  if (text.includes('kochi') || text.includes('kerala')) return 'Fort Kochi, Kerala';
  if (text.includes('delhi')) return 'New Delhi, India';
  if (text.includes('varanasi') || text.includes('ghat')) return 'Varanasi, Uttar Pradesh';
  if (text.includes('mysore')) return 'Mysore, Karnataka';
  if (text.includes('dubai')) return 'Dubai Marina, UAE';
  if (text.includes('singapore') || text.includes('orchard')) return 'Orchard Road, Singapore';

  if (hotel.latitude && hotel.longitude) {
    const lat = Number(hotel.latitude);
    const lng = Number(hotel.longitude);
    if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
      return `${lat >= 0 ? lat.toFixed(2) + '°N' : Math.abs(lat).toFixed(2) + '°S'}, ${lng >= 0 ? lng.toFixed(2) + '°E' : Math.abs(lng).toFixed(2) + '°W'}`;
    }
  }
  return 'Prime Location';
}
