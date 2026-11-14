const fs = require('fs');

function toNumber(value) {
  if (value === undefined || value === null || value === '') return NaN;
  return Number(value);
}

function validateHotelPayload(requireImage) {
  return (req, res, next) => {
    const body = req.body || {};
    const errors = {};

    const title = (body.title || '').trim();
    if (title.length < 3) errors.title = 'Title must be at least 3 characters long.';
    else if (title.length > 160) errors.title = 'Title cannot exceed 160 characters.';

    const description = (body.description || '').trim();
    if (description.length < 10) errors.description = 'Please write at least 10 characters.';
    else if (description.length > 3000) errors.description = 'Description cannot exceed 3000 characters.';

    const price = toNumber(body.price);
    if (Number.isNaN(price) || price < 0 || price > 1_000_000) {
      errors.price = 'Price must be a number between 0 and 1,000,000.';
    }

    const latitude = toNumber(body.latitude);
    if (Number.isNaN(latitude) || latitude < -90 || latitude > 90) {
      errors.latitude = 'Latitude must be between -90 and 90.';
    }

    const longitude = toNumber(body.longitude);
    if (Number.isNaN(longitude) || longitude < -180 || longitude > 180) {
      errors.longitude = 'Longitude must be between -180 and 180.';
    }

    if (requireImage && !req.file) {
      errors.image = 'Please upload a photo for this hotel.';
    }

    if (Object.keys(errors).length > 0) {

      if (req.file && req.file.path) fs.unlink(req.file.path, () => {});
      return res.status(400).json({ errors });
    }

    req.clean = { title, description, price, latitude, longitude };
    next();
  };
}

module.exports = { validateHotelPayload };
