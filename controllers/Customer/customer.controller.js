const Customer = require("../../models/schema").Customer;

module.exports = {
    // Adding Owner
    addCustomer: (req, res, next) => {
        console.log("api running add addCustomer", req.body);
        var customer = new Customer(req.body);
        customer.save().then(function (data) {
            res.status(200).send(data);
        }).catch(next);
    },
    // Get Building
    getCustomer: (req, res, next) => {
        Customer.find().then(function (data) {
            res.status(200).send(data);
        }).catch(next);
    },
    // Get single building
    getSingleCustomer: async (req, res, next) => {
        Customer.findOne({ email: req.params.email }).then((data) => {
            res.status(200).send({ status: "success", msg: data });
        }).catch((e) => {
            next(new Error(400, e.message));
        });
    },
    // Delete Building
    deleteCustomer: (req, res, next) => {
        Customer.findOneAndRemove({ "email": req.body.email }).then((data) => {
            res.status(200).send({ status: "success", msg: data });
        }).catch((e) => {
            next(new Error(400, e.message));
        });

    },

    updateCustomer: (req, res, next) => {
        let val = req.body;
        if (val) {
            Customer.findOneAndUpdate({ "email": req.body.email }, { $set: { email: val.email, buss_num: val.buss_num, name: val.name, mo_num: val.mo_num } }).then((data) => {
                res.status(200).send({ status: "success", msg: data });
            }).catch((e) => {
                next(new Error(400, e.message));
            });
        }
        else {
            res.status(400).send({ status: "fail", msg: "please provide Update Details" });
        }
    }

};