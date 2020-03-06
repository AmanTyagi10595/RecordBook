const SaleRecord = require("../../models/schema").SaleRecord;
const CustomerSchema = require("../../models/schema").Customer;
module.exports = {
    // Adding Owner
    addSalerecord: (req, res, next) => {
        console.log("test", req.body);
        var data = req.body;
        var balance = (data.amount) - (data.payedAmout);
        data.balance = balance;
        var saleRecord = new SaleRecord(data);
        saleRecord.save().then((result) => {
            console.log("result3", result.toObject());
            CustomerSchema.update(
                { email: `${data.email}` },
                { $inc: { 'balance': `${data.balance}` } }).then(function (result) {
                    console.log("resu", result)
                    res.status(200).send({ status: "success", msg: result });
                }).catch((err) => {
                    console.log("error", err)
                    res.satus(400).send({ status: "failure", msg: err });
                });
        }).catch((err) => {
            res.status(400).send({ status: "failure", msg: err });
        });
    },
    // Get getSalerecord
    getSalerecord: (req, res, next) => {
        SaleRecord.find().then(function (data) {

            res.status(200).send({ status: "success", msg: data });
        }).catch((e) => {
            next(new Error(400, e.message));
        });
    },
    // Get getSalerecord for single customer by his email
    getSingleUserSaleRecord: async (req, res, next) => {
        SaleRecord.find({ email: req.params.email }).then((data) => {
            res.status(200).send({ status: "success", msg: data });
        }).catch((e) => {
            next(new Error(400, e.message));
        });
    },
    // Delete SaleRecord
    deleteSaleRecord: (req, res, next) => {
        SaleRecord.findOneAndRemove({ "_id": req.params._id }).then((data) => {
            res.status(200).send({ status: "success", msg: data });
        }).catch((e) => {
            next(new Error(400, e.message));
        });

    },
    // Updaete saleReport
    updateSaleReoport: (req, res, next) => {
        console.log("In update sale record", req.body);
        let val = req.body;
        if (val) {
            SaleRecord.findOneAndUpdate({ "email": req.body.email }, { $set: { buss_num: val.buss_num, name: val.name, mo_num: val.mo_num } }).then((data) => {
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