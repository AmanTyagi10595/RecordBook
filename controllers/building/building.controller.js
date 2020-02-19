const Building = require('../../models/schema').Building;
const Error = require('../../error/error');

module.exports = {
    // Adding Building
    addBuilding: (req, res, next) => {
        console.log("api running addBuilding", req.body);
        var building = new Building(req.body);
        building.save().then(function (data) {
            console.log(data.toObject(), "saved");
            res.status(200).send(data);
        }).catch(next);
    },
    // Get Building
    getBuilding: (req, res, next) => {
        Building.find().then(function (data) {
            res.status(200).send(data);
        }).catch(next);
    },
    // Get single building
    getSingleBuilding: async (req, res, next) => {
        Building.findById(req.params.id).then((data) => {
            res.status(200).send({ status: "success", msg: data });
        }).catch((e) => {
            // next({ status: 402, message: e.message });
            next(new Error(400, e.message));
        });
    },
    // Delete Building
    deleteBuilding: (req, res, next) => {
        Building.findOneAndRemove({ "_id": req.body.id }).then((data) => {
            res.status(200).send({ status: "success", msg: data });
        }).catch((e) => {
            next(new Error(400, e.message));
        });

    },

    updateBuilding: (req, res, next) => {
        let val = req.body
        if (val.id) {
            Building.findOneAndUpdate({ "_id": val.id }, { $set: { name: val.name, state: val.state, city: val.city, phone: val.phone } }).then((data) => {
                res.status(200).send({ status: "success", msg: data });
            }).catch((e) => {
                next(new Error(400, e.message));
            });
        }
        else {
            res.status(400).send({ status: "fail", msg: "please provide Id" });
        }
    }

};