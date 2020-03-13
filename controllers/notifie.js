require('dotenv').config()
var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email,
        pass: process.env.password
    }
});

module.exports = {


    notifie: (data) => {
        var mailOptions = {
            from: 'amantyagi10595js@gmail.com',
            to: data['email'],
            subject: 'Regarding Payment',
            // text: 'Hi',
            html: `<h1>Hi,${data.name}</h1><p>The pending amount you need to pay us : <b>${data.balance}</b>, thanks</p>`
        };
        return new Promise(function (resolve, reject) {
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    reject({ code: 400, status: "failure" });
                } else {
                    resolve({ code: 200, status: "success" });
                }
            });
        });

    }
};