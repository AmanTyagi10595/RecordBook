const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Error = require('./error/error');
var cors = require('cors')
var AuthController = require('./auth/AuthController');

var multer = require('multer');
var Storage = multer.diskStorage({
    destination: function (req, file, callback) {
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
}).array("imgUploader", 3); //Field name and max count

// set up express app
const app = express();

// connect to mongodb
mongoose.connect('mongodb://localhost/RecordBook');
mongoose.Promise = global.Promise;

// use body-parser middleware
app.use(cors())
app.use(bodyParser.json());
app.use(require('body-parser').urlencoded({ extended: true }));
// initialize routes

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.post("/api/Upload", function (req, res) {
    upload(req, res, function (err) {
        console.log("body", JSON.parse(req.body.test));
        if (err) {
            return res.end(err.message);
        }

        return res.status(200).json({ success: true, message: 'File uploaded successfully' });
    });
});
app.use('/api/auth', AuthController);
app.use('/building', require('./routes/Building'));
app.use('/owner', require('./routes/Owner'));
app.use('/customer', require('./routes/Customer'));
app.use('/saleRecord', require('./routes/SaleRecord'));

// error handling middleware
app.use(function (err, req, res, next) {
    console.log("Error:", err.message); // to see properties of message in our console
    res.status(err.status).send({ error: err.message });
});

// listen for requests
app.listen(process.env.port || 4000, function () {
    console.log('listening at 4000');
});
