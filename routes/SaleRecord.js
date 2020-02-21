const router = require('express').Router();
const saleRecordController = require('../controllers/saleRecord/saleRecord.controller');

//Get all Customer
router.get('/', saleRecordController.getSalerecord);

// Get single Customer sale record by his email
router.get('/:email', saleRecordController.getSingleUserSaleRecord);

// // // Add Customer
router.post('/add', saleRecordController.addSalerecord);

// // // Delete Customer
router.delete('/delete', saleRecordController.deleteSaleRecord);

// // // Update Customer
router.put('/update', saleRecordController.updateSaleReoport);

module.exports = router;