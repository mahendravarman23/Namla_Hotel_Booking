require('dotenv').config();
const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');

const hotelRoutes = require('./routes/hotels');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 4000;

const uploadsDir = path.join(__dirname, '..', 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.use('/uploads', express.static(uploadsDir, { maxAge: '7d', immutable: true }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/hotels', hotelRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

const clientDist = path.join(__dirname, '..', '..', 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));

  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.use((err, _req, res, _next) => {
  console.error('[api error]', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'Image is too large — the limit is 5 MB.' });
  }
  if (err.code === '23505') {
    return res.status(409).json({ message: 'This record already exists.' });
  }
  if (err.status === 400) {
    return res.status(400).json({ message: err.message });
  }

  res.status(err.status || 500).json({ message: err.message || 'Something went wrong on the server.' });
});

app.listen(PORT, () => {
  console.log(`Hotel API listening on http://localhost:${PORT}`);
});
