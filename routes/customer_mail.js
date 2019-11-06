var nodemailer = require('nodemailer');

function sentMailToCustomers(req, res, cb){

  var req = req.body;

    if(req.email && req.password){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'mukeshsb44@gmail.com',
          clientId: '875489581055-5tjp5tbv78raj9vedafrmffe7g045l3a.apps.googleusercontent.com',
          clientSecret: 'Kqlw_MRO6xeD2tjVT6Lhmx43',
          refreshToken: '1/gDxnohnkxsaAp5uvMQT7kDhKKS2eIGoAmhEvrHeGbnU',
          accessToken: 'ya29.Glt1BpZskVeZmUj2D8Zfr_CzKETlBso_Lcf1JPoT3f5LuQKHp-I7j_sHR4Lsh_6UnD3tn-WTKYr5ETnE22WCeicJXAoJsPxdmVnKA6VHjYygou3GXreFEjkCfbdy',
          expires: 3600
        },
        tls: {
            rejectUnauthorized: false
        }
      });

      var mailOptions = {
        from: 'admin@standrop.com',
        to: req.email,
        subject: 'Registration',
        text: 'Hello,Welcome to Standrop.This is admin welcoming you to our Standrop website.Sign in and get help today.'
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            cb(error);
        } else {
            cb(null, 'Email sent: ' + info.response)
        }
      });
    } else {
      cb("Please provide valid details.")
    }


}

exports.sentMailToCustomers  = sentMailToCustomers;
