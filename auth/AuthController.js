var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var Owner = require('../models/schema').Owner;
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');
var VerifyToken = require('./VerifyToken');


router.post('/register', function (req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    Owner.create({
        name: req.body.name,
        email: req.body.email,
        mo_num: req.body.mobile,
        password: hashedPassword,
        buss_num: req.body.buss_num
    }, function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user.");
        // create a token
        var token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
    });
});
// to get back the ID of user
router.get('/me', VerifyToken, function (req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function (err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        res.status(200).send(decoded);
    });
});
//login Api
router.post('/login', function (req, res) {

    Owner.findOne({ email: req.body.email }, function (err, user) {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) {
            return res.status(401).send({ auth: false, token: null });
        } else {
            var token = jwt.sign({ id: user._id }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
            });

            res.status(200).send({ auth: true, token: token });
        }
    });
});

router.get('/logout', function (req, res) {
    res.status(200).send({ auth: false, token: null });
});


module.exports = router;