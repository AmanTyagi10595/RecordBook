const Customer = require("../../models/schema").Customer;
const SaleRecord = require("../../models/schema").SaleRecord;
const upload = require("../fileUpload");
const notifie = require("../notifie");

module.exports = {

    // Adding Owner
    addCustomer: (req, res, next) => {
        // console.log("trr", req.body);
        upload(req, res).then(result => {
            console.log("response", result, JSON.parse(req.body.test));
            let data = JSON.parse(req.body.test);
            data.img_url = result['imagePath'];
            var customer = new Customer(data);
            customer.save().then(function (data) {

                res.status(200).send({ status: "success", msg: "uploadSave" });
            }).catch(next);
        }, err => {
            console.log("error", err);
            var customer = new Customer(JSON.parse(req.body.test));
            customer.save().then(function (data) {
                res.status(200).send({ status: "success", msg: "onlydSave" });
            }).catch(next);
        });
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
        console.log("delet customer", req.body)
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
    notify: (req, res, next) => {
        notifie.notifie(req.body).then(result => {
            res.status(200).send({ msg: "Customer notified", status: "success" });
        }).catch(err => {
            res.status(422).send({ msg: "Somthing wrong", status: "failure" });
        })

    },
    groupNotifie: (req, res, next) => {
        console.log(req.body);
        notifie.groupNotifie(req.body).then(result => {
            res.status(200).send({ msg: "Customer notified", status: "success" });
        }).catch(err => {
            res.status(422).send({ msg: "Somthing wrong", status: "failure" });
        })
    },
    rangedCustomer: (req, res, next) => {
        Customer.find({ balance: { $gt: `${req.body.minValue}`, $lt: `${req.body.maxValue}` } }).then(result => {
            if (result) {
                res.status(200).send({ status: "sucess", msg: result });
            }
        }).catch(err => {
            res.status(400).send({ status: "failure", msg: err });
        });
    },

    dateRangedCustomers: (req, res, next) => {
        console.log("running", req.body);
        SaleRecord.aggregate(
            [
                { $match: { promis_date: { $gte: new Date(`${(req.body.minValue)}`), $lte: new Date(`${(req.body.maxValue)}`) } } },
                {
                    $group: {
                        _id: "$email",
                        maxPromDate: { $max: "$promis_date" }
                    }
                },
                {
                    "$lookup": {
                        "from": "customers",
                        "localField": "_id",
                        "foreignField": "email",
                        "as": "userinfo"
                    }
                },
                {
                    "$project": {
                        "maxPromDate": 1,
                        "userinfo": 1
                    }
                }
            ]
        ).then(result => {
            if (result) {
                console.log("hi", result);

                res.status(200).send({ status: "sucess", msg: result });
            }
        }).catch(err => {
            console.log("errtt", err);
            res.status(400).send({ status: "failure", msg: err });
        });
    }

};