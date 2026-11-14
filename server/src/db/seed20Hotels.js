require('dotenv').config();
const { pool, q } = require('./pool');

function getRandomPrice() {

  const min = 500;
  const max = 6000;
  const steps = Math.floor(Math.random() * ((max - min) / 50 + 1));
  return (min + steps * 50).toFixed(2);
}

const HOTELS_20 = [
  {
    title: 'Lake Pichola Heritage Suite',
    description: 'A restored haveli room right on the water, with arched windows opening onto the City Palace skyline. Rooftop breakfast and a sunset boat ride are included with every stay.',
    latitude: 24.5764,
    longitude: 73.6835,
    image: '/uploads/seed/hotel-01.jpg',
  },
  {
    title: 'Candolim Beach House',
    description: 'Two minutes on foot from Candolim beach, this airy Goan house has a shaded veranda and an outdoor shower. Comes with bicycles for the short ride to Sinquerim Fort.',
    latitude: 15.5156,
    longitude: 73.7655,
    image: '/uploads/seed/hotel-02.jpg',
  },
  {
    title: 'Mumbai Skyline Hotel',
    description: 'Compact business hotel on Marine Drive with floor-to-ceiling views over the Arabian Sea. Fast Wi-Fi, late checkout on request and a filter-coffee counter that never closes.',
    latitude: 19.0760,
    longitude: 72.8777,
    image: '/uploads/seed/hotel-03.jpg',
  },
  {
    title: 'Jaipur Haveli Boutique',
    description: 'Twelve rooms wrapped around a 200-year-old courtyard in the old city. Hand-painted frescoes, a small plunge pool and rooftop dinners under the Aravalli sky.',
    latitude: 26.9124,
    longitude: 75.7873,
    image: '/uploads/seed/hotel-04.jpg',
  },
  {
    title: 'Manali Pine Lodge',
    description: 'Timber cottages under deodar trees, ten minutes from Old Manali bridge. Wood-burning stoves in every room and paragliding pickup from the gate in season.',
    latitude: 32.2432,
    longitude: 77.1892,
    image: '/uploads/seed/hotel-05.jpg',
  },
  {
    title: 'Rishikesh Riverside Camp',
    description: 'Safari tents on a sandy Ganga beach with morning yoga on the deck. Rafting runs leave twice a day and the bonfire kitchen serves till midnight.',
    latitude: 30.0869,
    longitude: 78.2676,
    image: '/uploads/seed/hotel-06.jpg',
  },
  {
    title: 'Kochi Backwater Villa',
    description: 'A converted spice warehouse on the Fort Kochi shoreline, all teak and laterite. Chinese fishing nets are visible from the breakfast deck at high tide.',
    latitude: 9.9312,
    longitude: 76.2673,
    image: '/uploads/seed/hotel-07.jpg',
  },
  {
    title: 'Delhi Airport Transit Hotel',
    description: 'Sound-proofed rooms five minutes from Terminal 3 by complimentary shuttle. Rain showers, 24-hour room service and a breakfast buffet that opens at 4:30 AM.',
    latitude: 28.5562,
    longitude: 77.1000,
    image: '/uploads/seed/hotel-08.jpg',
  },
  {
    title: 'Varanasi Ghat View Inn',
    description: 'Balconies hang directly over Dashashwamedh Ghat, so the evening aarti happens right in front of you. Small, spotless rooms with jasmine-scented linen.',
    latitude: 25.3176,
    longitude: 82.9739,
    image: '/uploads/seed/hotel-09.jpg',
  },
  {
    title: 'Mysore Heritage Residency',
    description: 'A quiet colonial-era bungalow behind the zoo, surrounded by bougainvillea. Hand-woven floor mats, South Indian thali dinners and palace tour bookings.',
    latitude: 12.2958,
    longitude: 76.6394,
    image: '/uploads/seed/hotel-10.jpg',
  },
  {
    title: 'Dubai Marina Grand',
    description: 'Glass tower rooms overlooking the marina walk, with an infinity pool on the 41st floor. Direct metro link to the beach clubs and the gold souk.',
    latitude: 25.0760,
    longitude: 55.1335,
    image: '/uploads/seed/hotel-11.jpg',
  },
  {
    title: 'Singapore Orchard Suites',
    description: 'Quiet suites one block off Orchard Road, above a hawker centre that locals actually queue at. Late-night pool, early check-in for red-eye arrivals.',
    latitude: 1.3048,
    longitude: 103.8318,
    image: '/uploads/seed/hotel-12.jpg',
  },
  {
    title: 'Agra Taj View Resort',
    description: 'Boutique suites with uninterrupted views of the Taj Mahal dome from private balconies. Rooftop Mughal dining and early morning sunrise tours.',
    latitude: 27.1751,
    longitude: 78.0421,
    image: '/uploads/seed/hotel-01.jpg',
  },
  {
    title: 'Ooty Nilgiri Tea Bungalow',
    description: 'Colonial stone bungalow set amid emerald green tea estates in the Nilgiri hills. Fireplace in every suite and afternoon garden high-tea.',
    latitude: 11.4102,
    longitude: 76.6950,
    image: '/uploads/seed/hotel-02.jpg',
  },
  {
    title: 'Darjeeling Himalayan View Lodge',
    description: 'Charming wooden lodge facing the Kanchenjunga mountain range. Organic breakfast, Darjeeling tea tastings, and peaceful pine walking trails.',
    latitude: 27.0410,
    longitude: 88.2663,
    image: '/uploads/seed/hotel-05.jpg',
  },
  {
    title: 'Alleppey Houseboat Retreat',
    description: 'Traditional thatched kettuvallam cruiser moored along palm-fringed backwaters. Private chef, fresh catch dinners, and tranquil backwater kayaking.',
    latitude: 9.4981,
    longitude: 76.3388,
    image: '/uploads/seed/hotel-07.jpg',
  },
  {
    title: 'Jaisalmer Desert Oasis Camp',
    description: 'Luxury desert tents near the golden Sam Sand Dunes. Folk music, camel safari at dusk, and magical stargazing under the Thar desert sky.',
    latitude: 26.9157,
    longitude: 70.9083,
    image: '/uploads/seed/hotel-04.jpg',
  },
  {
    title: 'Munnar Cloud Valley Estate',
    description: 'High-altitude cottages wrapped in morning mist and cardamom plantations. Mountain stream waterfalls and refreshing cool hill station breeze.',
    latitude: 10.0889,
    longitude: 77.0595,
    image: '/uploads/seed/hotel-06.jpg',
  },
  {
    title: 'Pondicherry French Quarter Villa',
    description: 'Restored 18th-century Franco-Tamil heritage home with yellow arches and courtyard café. Just three minutes walk to the famous Promenade Beach.',
    latitude: 11.9416,
    longitude: 79.8083,
    image: '/uploads/seed/hotel-03.jpg',
  },
  {
    title: 'Ladakh Mountain Stargazer Resort',
    description: 'Solar-heated luxury suites overlooking snow-capped Himalayan peaks. Telescope observation deck for astronomy and Tibetan monastery excursions.',
    latitude: 34.1526,
    longitude: 77.5771,
    image: '/uploads/seed/hotel-11.jpg',
  },
];

async function seed20Hotels() {
  console.log('Seeding 20 hotels with random prices between ₹500 and ₹6,000...');

  await q('TRUNCATE TABLE hotels RESTART IDENTITY CASCADE');

  for (const h of HOTELS_20) {
    const price = getRandomPrice();
    await q(
      `INSERT INTO hotels (title, description, price, latitude, longitude, image_url)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [h.title, h.description, price, h.latitude, h.longitude, h.image]
    );
    console.log(`Inserted: "${h.title}" — Price: ₹${price}`);
  }

  const count = await q('SELECT COUNT(*) FROM hotels');
  console.log(`\nSuccessfully seeded ${count[0].count} hotels!`);
}

seed20Hotels()
  .catch((err) => {
    console.error('Seeding error:', err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
