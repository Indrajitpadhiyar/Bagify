import nodeMailer from "nodemailer";

const sendEmail = async (options) => {
  const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_SERVICE,
    port: Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    logger: true,
    debug: true,
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
  const mailOptions = {
    from: "Bagify <" + process.env.SMTP_MAIL + ">",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

export default sendEmail;
