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
            text: 'Hi',
            // html: `<h1>Hi,${data.name}</h1><p>The pending amount you need to pay us : <b>${data.balance}</b>, thanks</p>`
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

    },
    groupNotifie: (data) => {
        console.log("in Noyifie grour", data);
        var mailOptions = {
            from: 'amantyagi10595js@gmail.com',
            to: "",
            subject: 'Regarding Payment',
            text: "",
        };
        let err = false;
        let promises = [];
        data.forEach((element) => {
            if (element['maxPromDate']) {
                mailOptions.to = element.email,
                    mailOptions.text = "You need to pay " + `${(element.balance)}` + " rupees, your last promise date was" + `${element.maxPromDate}`,
                    mailOptions.subject = "Hi, " + `${element.name}`;
                promises.push(transporter.sendMail(mailOptions));
            } else {
                mailOptions.to = element.email,
                    mailOptions.text = "You need to pay " + `${(element.balance)}` + " rupees",
                    mailOptions.subject = "Hi, " + `${element.name}`;
                promises.push(transporter.sendMail(mailOptions));
            }

        });
        return Promise.all(promises).then(data => {
            return new Promise(resolve => resolve("success"));
        }).catch(e => {
            return new Promise(reject => reject(e));
        })

    }
};