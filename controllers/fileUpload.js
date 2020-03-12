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

        // console.log("dtaa", req)
        upload(req, res, function (err) {

            if (err) {
                reject({ msg: "Error occured", "err": err, });
            } else {
                let path = [];
                req.files.forEach(element => {
                    path.push(element.filename);
                });
                console.log("testing", path);
                resolve({ msg: "Successfully uploaded", imagePath: path.join(",") });
            }

        });
    });
}


module.exports = upload1;