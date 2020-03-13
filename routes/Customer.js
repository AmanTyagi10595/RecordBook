const router = require('express').Router();
const customerController = require('../controllers/Customer/customer.controller');

//get customer with similar email
router.get('/like', customerController.getSimilarCustomer);

//Get all Customer
router.get('/', customerController.getCustomer);

// Get single Customer
router.get('/:email', customerController.getSingleCustomer);

// // Add Customer
router.post('/add', customerController.addCustomer);

// // Delete Customer
router.post('/delete', customerController.deleteCustomer);

// // Update Customer
router.put('/update', customerController.updateCustomer);

//get one customer remaining balance
router.get('/balance/:email', customerController.getCustomerBalance);

router.post('/notifyOneCustomer', customerController.notify);


module.exports = router;