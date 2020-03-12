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
}).array("imgUploader", 3);

function upload1(req, res) {

    return new Promise((resolve, reject) => {

        upload(req, res, function (err) {
            if (err) {
                reject({ msg: "Error occured", "err": err, });
                // return res.end("Something went wrong!");
            }
            resolve({ msg: "Successfully uploaded" });
            // return res.end("File uploaded sucessfully!.");
            // res.status(200).json({ success: true, message: 'File uploaded successfully' });
        });
    });
}


module.exports = upload1;