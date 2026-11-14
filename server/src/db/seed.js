require('dotenv').config();
const { pool, q } = require('./pool');

const DEMO_HOTELS = [
  {
    title: 'Lake Pichola Heritage Suite',
    description:
      'A restored haveli room right on the water, with arched windows opening onto the City Palace skyline. Rooftop breakfast and a sunset boat ride are included with every stay.',
    price: 220.0,
    latitude: 24.5764,
    longitude: 73.6835,
    image: '/uploads/seed/hotel-01.jpg',
  },
  {
    title: 'Candolim Beach House',
    description:
      'Two minutes on foot from Candolim beach, this airy Goan house has a shaded veranda and an outdoor shower. Comes with bicycles for the short ride to Sinquerim Fort.',
    price: 145.5,
    latitude: 15.5156,
    longitude: 73.7655,
    image: '/uploads/seed/hotel-02.jpg',
  },
  {
    title: 'Mumbai Skyline Hotel',
    description:
      'Compact business hotel on Marine Drive with floor-to-ceiling views over the Arabian Sea. Fast Wi-Fi, late checkout on request and a filter-coffee counter that never closes.',
    price: 310.0,
    latitude: 19.076,
    longitude: 72.8777,
    image: '/uploads/seed/hotel-03.jpg',
  },
  {
    title: 'Jaipur Haveli Boutique',
    description:
      'Twelve rooms wrapped around a 200-year-old courtyard in the old city. Hand-painted frescoes, a small plunge pool and rooftop dinners under the Aravalli sky.',
    price: 98.0,
    latitude: 26.9124,
    longitude: 75.7873,
    image: '/uploads/seed/hotel-04.jpg',
  },
  {
    title: 'Manali Pine Lodge',
    description:
      'Timber cottages under deodar trees, ten minutes from Old Manali bridge. Wood-burning stoves in every room and paragliding pickup from the gate in season.',
    price: 64.5,
    latitude: 32.2432,
    longitude: 77.1892,
    image: '/uploads/seed/hotel-05.jpg',
  },
  {
    title: 'Rishikesh Riverside Camp',
    description:
      'Safari tents on a sandy Ganga beach with morning yoga on the deck. Rafting runs leave twice a day and the bonfire kitchen serves till midnight.',
    price: 42.0,
    latitude: 30.0869,
    longitude: 78.2676,
    image: '/uploads/seed/hotel-06.jpg',
  },
  {
    title: 'Kochi Backwater Villa',
    description:
      'A converted spice warehouse on the Fort Kochi shoreline, all teak and laterite. Chinese fishing nets are visible from the breakfast deck at high tide.',
    price: 87.25,
    latitude: 9.9312,
    longitude: 76.2673,
    image: '/uploads/seed/hotel-07.jpg',
  },
  {
    title: 'Delhi Airport Transit Hotel',
    description:
      'Soundproofed rooms a five-minute shuttle from Terminal 3, booked in flexible hourly blocks. Ideal for layovers — wake-up calls, hot showers and a 24-hour gym.',
    price: 56.75,
    latitude: 28.5562,
    longitude: 77.1,
    image: '/uploads/seed/hotel-08.jpg',
  },
  {
    title: 'Varanasi Ghat View Inn',
    description:
      'Balconies hang directly over Dashashwamedh Ghat, so the evening aarti happens right in front of you. Small, spotless rooms with jasmine-scented linen.',
    price: 38.5,
    latitude: 25.3176,
    longitude: 82.9739,
    image: '/uploads/seed/hotel-09.jpg',
  },
  {
    title: 'Mysore Heritage Residency',
    description:
      'Colonial-era bungalow a short walk from the Amba Vilas palace gates. masala dosas at dawn, filter coffee all day, and a courtyard library for slow evenings.',
    price: 51.0,
    latitude: 12.2958,
    longitude: 76.6394,
    image: '/uploads/seed/hotel-10.jpg',
  },
  {
    title: 'Dubai Marina Grand',
    description:
      'Glass tower rooms overlooking the marina walk, with an infinity pool on the 41st floor. Direct metro link to the beach clubs and the gold souk.',
    price: 240.0,
    latitude: 25.076,
    longitude: 55.1335,
    image: '/uploads/seed/hotel-11.jpg',
  },
  {
    title: 'Singapore Orchard Suites',
    description:
      'Quiet suites one block off Orchard Road, above a hawker centre that locals actually queue at. Late-night pool, early check-in for red-eye arrivals.',
    price: 189.99,
    latitude: 1.3048,
    longitude: 103.8318,
    image: '/uploads/seed/hotel-12.jpg',
  },
];

async function main() {
  const { rows } = await pool.query('SELECT COUNT(*)::int AS count FROM hotels');
  if (rows[0].count > 0) {
    console.log(`Table "hotels" already has ${rows[0].count} row(s) — skipping seed.`);
    return;
  }

  for (const hotel of DEMO_HOTELS) {
    await q(
      `INSERT INTO hotels (title, description, price, latitude, longitude, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [hotel.title, hotel.description, hotel.price, hotel.latitude, hotel.longitude, hotel.image]
    );
  }
  console.log(`Seeded ${DEMO_HOTELS.length} demo hotels.`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
