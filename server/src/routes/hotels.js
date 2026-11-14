const router = require('express').Router();
const controller = require('../controllers/hotels.controller');
const upload = require('../middleware/upload');
const { validateHotelPayload } = require('../middleware/validate');
const { requireAdmin } = require('../middleware/auth');

router.get('/', controller.list);
router.get('/:id', controller.getOne);

router.post('/', requireAdmin, upload.single('image'), validateHotelPayload(true), controller.create);
router.put('/:id', requireAdmin, upload.single('image'), validateHotelPayload(false), controller.update);
router.delete('/:id', requireAdmin, controller.remove);

module.exports = router;
