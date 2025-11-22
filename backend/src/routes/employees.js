const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/employeeController');

router.use(auth);
router.get('/', ctrl.listEmployees);
router.post('/', ctrl.createEmployee);
router.get('/:id', ctrl.getEmployee);
router.put('/:id', ctrl.updateEmployee);
router.delete('/:id', ctrl.deleteEmployee);

module.exports = router;
