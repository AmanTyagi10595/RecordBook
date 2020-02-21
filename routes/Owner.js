const router = require('express').Router();
const ownerController = require('../controllers/owner/owner.controller');

//Get all Owner
router.get('/', ownerController.getOwner);

// Get single Owner
router.get('/:email', ownerController.getSingleOwner);

// Add Owner
router.post('/add', ownerController.addOwner);

// Delete Owner
router.delete('/delete', ownerController.deleteOwner);

// Update Owner
router.put('/update', ownerController.updateOwner);

module.exports = router;