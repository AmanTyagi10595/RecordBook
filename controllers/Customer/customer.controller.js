const Customer = require("../../models/schema").Customer;
var multer = require('multer');
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
        console.log(file)
        if (file.mimetype.slice(0, 5) == "image") {
            callback(null, "./uploads/Images");
        } else {
            callback(null, "./uploads/Files");
        }

    },
    filename: function (req, file, callback) {
        callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
var upload = multer({
    storage: Storage
}).array("imgUploader", 3);

module.exports = {
    // Adding Owner
    addCustomer: (req, res, next) => {
        upload(req, res, async err => {
            console.log(err)
        })
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

    //get custommer similar to the serched email ID
    getSimilarCustomer: (req, res, next) => {
        console.log("In get like customer", req.query);
        Customer.find({
            email: {
                $regex: req.query.data
            }
        }, { email: 1, _id: 0 }).then(function (data) {
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
    },

    getCustomerBalance: (req, res, next) => {
        Customer.find({ "email": req.params.email }, { balance: 1, "_id": 0 }).then(data => {
            res.status(200).send(data);
        }).catch(err => {
            res.status(200).send(err);
        });

    },

};