const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/logController');

router.use(auth);
router.get('/', ctrl.listLogs);

module.exports = router;
