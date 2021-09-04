const router = require('express').Router();
const nodemailer = require('nodemailer');
const google = require('googleapis');
const config = require('../config');
const OAuth2 = google.Auth.OAuth2Client;

// nodemailer is a module created in  node.js and has been created in order to send mails

// in order to send mails you have to follow 3 steps:
// 1.Create nodemailer transporter
// --the most common is SMTP
// --SENDMAIL is a command for simple message. like mail() in php

// 2. Set nodemailer message options(mailOptions)
// we specify the sender,messages

// 3.deliver a message with sendmail

const OAuth2_Client = new OAuth2(config.client_ID, config.Client_Secret);
OAuth2_Client.setCredentials({ refresh_token: config.Refresh_Token });

router.post('/contact', (req, res) => {
  let data = req.body;

  const accessToken = OAuth2_Client.getAccessToken();

  // if the fields are empty we want to appear a message
  if (
    data.name.length === 0 ||
    data.email.length === 0 ||
    data.message.length === 0
  ) {
    return res.json({ msg: 'Please fill all the fields' });
  }

  //   we create a transporter
  let smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    // the connect port
    port: 465,

    // authenticate
    auth: {
      type: 'OAuth2',
      user: config.user,
      pass: process.env.EMAIL_PASSWORD,
      clientId: config.client_ID,
      clientSecret: config.Client_Secret,
      refreshToken: config.Refresh_Token,
      accessToken: accessToken,
    },
  });
  // define the mailoptions
  let mailOptions = {
    from: data.email,
    to: 'sevenicbookings@gmail.com',
    subject: `Message from ${data.name}`,
    html: `
    
    <h3>Informations</h3>
    <ul>
    <li>Name: ${data.name}</li>
    <li>Email: ${data.email}</li>
   
    </ul>

    <h3>Message</h3>
    <p>${data.message}</p>
    
    
    `,
  };

  // 3.send the message with sendmail
  smtpTransport.sendMail(mailOptions, (err) => {
    try {
      if (err) return res.status(400).json({ msg: err });

      res
        .status(200)
        .json({ msg: 'Thank you for contacting Sibusiso Shongwe!' });
    } catch (err) {
      if (err) return res.status(500).json({ msg: 'There is server error' });
      if (err) return res.status(400).json({ msg: 'There is server error' });
    }
  });
});

module.exports = router;
