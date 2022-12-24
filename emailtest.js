"use strict";
const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  // let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: "solanki.maulik@outlook.com", // generated ethereal user
      pass: "3nT2caD7SRJdtp0C", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Administrator" <admin@donotreplay.com>', // sender address
    to: "mauliksolanki48@gmail.com", // list of receivers
    subject: "Forgot Password", // Subject line
    text: "This is regarding forgot your account password.", // plain text body
    html: "<p>Dear User,</p><p>You have requested for password reset request, please click on below link to reset password.</p><p>Regards,</p><p>Admin</p>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);
