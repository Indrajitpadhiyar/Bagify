import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMPT_SERVICE,
    port: Number(process.env.SMPT_PORT),
    secure: false, // true for 465, false for other ports
    logger: true,
    debug: true,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false, // Use only for dev/Ethereal if having certificate issues
    },
  });
  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions)
};

export default sendEmail;
