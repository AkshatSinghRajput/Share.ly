const nodemailer = require("nodemailer");

function mailsend(user, key) {


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });
    var mailOptions = {
        from: process.env.EMAIL,
        to: user,
        subject: 'Confirmation Email',
        text: key,
    };
    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log("Email Sent Succesfully " + info);
        }
    });
};

module.exports = mailsend;