const SaleRecord = require("../../models/schema").SaleRecord;

module.exports = {
    // Adding Owner
    addSalerecord: (req, res, next) => {
        console.log("api running add addCustomer", req.body);
        var saleRecord = new SaleRecord(req.body);
        saleRecord.save().then(function (data) {
            res.status(200).send(data);
        }).catch(next);
    },
    // Get getSalerecord
    getSalerecord: (req, res, next) => {
        console.log("api running ");
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
        console.log("Hi delete api running")
        SaleRecord.findOneAndRemove({ "email": req.body.email }).then((data) => {
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