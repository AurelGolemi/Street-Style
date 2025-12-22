import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    user: "resend",
    pass: "re_YOUR_API_KEY",
  },
});

transporter.sendMail({
  from: '"Street Style" <onboarding@resend.com>',
  to: "your_email@example.com",
  subject: "SMTP Test",
  text: "Testing SMTP from Resend",
}).then(info => console.log("Sent:", info))
  .catch(err => console.error("Error:", err));
