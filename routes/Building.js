const router = require('express').Router();
const buildingController = require('../controllers/building/building.controller');

//Get all Buildings
router.get('/', buildingController.getBuilding);

// Get single building
router.get('/:id', buildingController.getSingleBuilding);

// Add Building
router.post('/add', buildingController.addBuilding);

// Delete Building
router.delete('/delete', buildingController.deleteBuilding);

// Update Building
router.patch('/update', buildingController.updateBuilding);

module.exports = router;
