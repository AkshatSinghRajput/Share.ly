const nodemailer = require("nodemailer");

function mailsend(user, key) {


    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'OrgaChrdomeHms23@gmail.com',
            pass: 'QWErty@765'
        }
    });
    var mailOptions = {
        from: 'OrgaChrdomeHms23@gmail.com',
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