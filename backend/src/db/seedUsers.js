require('dotenv').config();
const { pool, q } = require('./pool');
const { hashPassword } = require('../utils/auth');

async function seedUsers() {
  console.log('Seeding initial users...');

  const defaultUsers = [
    {
      name: 'System Admin',
      email: 'namlaadmin@gmail.com',
      password: 'admin',
      role: 'admin',
    },
    {
      name: 'Admin Manager',
      email: 'admin@hotels.com',
      password: 'admin',
      role: 'admin',
    },
    {
      name: 'Guest Traveler',
      email: 'user@hotels.com',
      password: 'user',
      role: 'user',
    },
  ];

  for (const u of defaultUsers) {
    const existing = await q('SELECT id FROM users WHERE LOWER(email) = LOWER($1)', [u.email]);
    if (existing.length === 0) {
      const hash = hashPassword(u.password);
      await q(
        'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)',
        [u.name, u.email.toLowerCase(), hash, u.role]
      );
      console.log(`Created ${u.role}: ${u.email}`);
    } else {

      const hash = hashPassword(u.password);
      await q(
        'UPDATE users SET password_hash = $1, role = $2 WHERE id = $3',
        [hash, u.role, existing[0].id]
      );
      console.log(`Updated ${u.role}: ${u.email}`);
    }
  }

  console.log('Users ready.');
}

if (require.main === module) {
  seedUsers()
    .catch((err) => {
      console.error('Seed users error:', err);
      process.exitCode = 1;
    })
    .finally(() => pool.end());
}

module.exports = { seedUsers };
