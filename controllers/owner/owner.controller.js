const Owner = require("../../models/schema").Owner;

module.exports = {
    // Adding Owner
    addOwner: (req, res, next) => {
        console.log("api running add owner", req.body);
        var owner = new Owner(req.body);
        owner.save().then(function (data) {
            console.log(data.toObject(), "saved");
            res.status(200).send(data);
        }).catch(next);
    },
    // Get Building
    getOwner: (req, res, next) => {
        Owner.find().then(function (data) {
            res.status(200).send(data);
        }).catch(next);
    },
    // Get single building
    getSingleOwner: async (req, res, next) => {
        Owner.findOne({ mo_num: req.params.id }).then((data) => {
            res.status(200).send({ status: "success", msg: data });
        }).catch((e) => {
            // next({ status: 402, message: e.message });
            next(new Error(400, e.message));
        });
    },
    // Delete Building
    deleteOwner: (req, res, next) => {
        Owner.findOneAndRemove({ "mo_num": req.body.mo_num }).then((data) => {
            res.status(200).send({ status: "success", msg: data });
        }).catch((e) => {
            next(new Error(400, e.message));
        });

    },

    updateOwner: (req, res, next) => {
        console.log(req.body);
        let val = req.body;
        if (val) {
            Owner.findOneAndUpdate({ "mo_num": req.body.mo_num }, { $set: { email: val.email, buss_num: val.buss_num, name: val.name, mo_num: val.mo_num } }).then((data) => {
                console.log(data.toObject())
                res.status(200).send({ status: "success", msg: data });
            }).catch((e) => {
                console.log(e)
                next(new Error(400, e.message));
            });
        }
        else {
            res.status(400).send({ status: "fail", msg: "please provide Update Details" });
        }
    }

};