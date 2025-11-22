const express = require('express');
const router = express.Router();
const auth = require('../middlewares/authMiddleware');
const ctrl = require('../controllers/teamController');
const { Employee, EmployeeTeam } = require('../models');

router.use(auth);

// CRUD
router.get('/', ctrl.listTeams);
router.post('/', ctrl.createTeam);
router.put('/:id', ctrl.updateTeam);
router.delete('/:id', ctrl.deleteTeam);

// Assign / Unassign
router.post('/:teamId/assign', ctrl.assignEmployeeToTeam);
router.post('/:teamId/unassign', ctrl.unassignEmployeeFromTeam);
router.post('/:teamId/assign-batch', ctrl.assignBatch);

// ============================
//  TEAM MEMBERS (IMPORTANT)
// ============================
router.get('/:teamId/employees', async (req, res) => {
  try {
    const { teamId } = req.params;

    const employees = await Employee.findAll({
      include: [
        {
          model: EmployeeTeam,
          where: { team_id: teamId },
          required: true
        }
      ]
    });

    res.json(employees);
  } catch (err) {
    console.error("Error fetching team members:", err);
    res.json([]); // SAFE fallback
  }
});

module.exports = router;
