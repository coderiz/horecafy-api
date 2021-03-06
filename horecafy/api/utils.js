var crypto = require('crypto');
var constants = require('./constants');

const nodemailer = require('nodemailer');
var sgTransport = require('nodemailer-sendgrid-transport');

var options = {
    auth: {
        api_user: 'carlosoderiz@horecafy.com',
        api_key: 'Carlos@1234'
    }
}

var transporter = nodemailer.createTransport(sgTransport(options));

// var fs = require('fs');
// var path = require('path');
var constants = require('./constants');

//var uploadBasePath = path.join(__dirname, '/public');

module.exports = {
	md5: function(string) {
        return crypto.createHash('md5').update(string).digest('hex');
    },
	validateParam: function(param, res) {
        if (param.value === null || (param.value === undefined)) {
            const data = this.buildResponse(0, null, null, constants.messages.MISSING_PARAM, param.name + ' param is missing', []);
            res.status(200).json(data);
            // res.status(400).json({
            //         totalRows: 0,
            //         error: param.name + " param is missing",
            //         data: []
            //     });
           return false;
        }
		return true;
	},
	GetUserByEmail: function GetUserByEmail(db, email, callback) {
        var query = {
            sql: 'GetUserByEmail @email',
            parameters: [
                { name: 'email', value: email }
            ]
        };
        db.execute(query)
        .then(function (results) {
            callback(results, null);
        })
        .catch(function(err) {
            callback(null, err);
        });
    },
	GetUserByEmailAndPassword: function GetUserByEmail(db, email, password, callback) {
        var query = {
            sql: 'GetUserByEmailAndPassword @email, @password',
            parameters: [
                { name: 'email', value: email },
				{ name: 'password', value: password }
            ]
        };
        db.execute(query)
        .then(function (results) {
            callback(results, null);
        })
        .catch(function(err) {
            callback(null, err);
        });
    },
	sendEmail: function (emailFrom, emailTo, subject, body, attachment, callback) {

        this.sendCCEmail(emailFrom, emailTo, {}, subject, body, attachment, function(response) {
            callback(response);  
        });
    },
    sendCCEmail: function (emailFrom, emailTo, emailCC, subject, body, attachment, callback) {
        
        for (var key in emailTo) {
            var emailTo = key;
        }

        for (var key in emailCC) {
            var emailCC = key;
        }

        let mailOptions = {
            from: emailFrom[0],
            to: emailTo,
            cc: emailCC,
            subject: subject,
            html: body
        };

        console.log(mailOptions);

        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
            if(error) {
                callback('{ "code": "failure", "message": "Email failed to send!.", "data": "{}" }');
            }

            callback('{ "code": "success", "message": "Email sent successfully.", "data": "{}" }');

            // var client = new Mailin("https://api.sendinblue.com/v2.0", "5cVYhrRL2vUJtQbS");
            // data = {
            //     to: emailTo,
            //     cc: emailCC,
            //     from: emailFrom,
            //     subject: subject,
            //     html: body,
            //     attachment: attachment
            // }
            // console.log('data -> ', data);

            // client.send_email(data).on('complete', function (response) {
            //     console.log(response);
            //     // callback(response);
            // });

            // callback(info);
        });

        
    },
    buildResponse: function(totalRows, page, rows, error, message, data) {
        return {
            totalRows,
            page,
            rows,
            error,
            message,
            data
        };
    }
};