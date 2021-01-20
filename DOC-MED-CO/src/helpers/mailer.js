import { createTransport, getTestMessageUrl } from "nodemailer";

// async..await is not allowed in global scope, must use a wrapper
async function sendRejectionMail(toMail) {

  // create reusable transporter object using the default SMTP transport
  let transporter = createTransport({
    service: 'gmail',
    auth: {
      user: "vishalmishra4842@gmail.com", // generated ethereal user
      pass: "@Doitnow23", // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'vishalmishra4842@gmail.com', // sender address
    to: toMail, // list of receivers
    subject: "Hello", // Subject line
    html: "<b>Admin finds some malicious information therefore reject your request.<br>For more information contact admin@gmail.com<br><br></b>Thanks you<br><b>DOC-MED-CO</b>", // html body
  });

}

export default sendRejectionMail;