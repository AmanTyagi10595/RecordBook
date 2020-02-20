const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create geolocation Schema
const GeoSchema = new Schema({
    type: {
        type: String,
        default: 'Point'
    },
    coordinates: {
        type: [Number],
        index: '2dsphere'
    }
});

// create ninja Schema & model
const NinjaSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    rank: {
        type: String
    },
    available: {
        type: Boolean,
        default: false
    }
});

//schema to add buildings
const BuildingSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Building name is required']
    },
    rooms: [{
        id: Number
    }],
    assets: [{
        id: Number
    }],
    state: {
        type: String
    },
    city: {
        type: String
    },
    phone: {
        type: Number
    }
});

const OwnerSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name field is required']
    },
    mo_num: {
        type: Number,
        required: [true, 'Mobile number is required'],

    },
    buss_num: {
        type: String
    },
    email: {
        type: String
    }
});

const Ninja = mongoose.model('ninja', NinjaSchema);
const Building = mongoose.model('Building', BuildingSchema);
const Owner = mongoose.model('Owner', OwnerSchema);

module.exports.Ninja = Ninja;
module.exports.Building = Building;
module.exports.Owner = Owner;
