import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const EMAIL = process.env.EMAIL as string;
const PASS = process.env.PASS as string;
const FRONTEND_URL = process.env.FRONTEND_URL as string

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: PASS,
  },
});

const getTemplate = (userName: string, token: string) => {
  return `
  <div id="email___content">
    <h2>¡Hi ${userName}!</h2>
    <p>Thanks for signing up. You must activate your account with the link below.</p>
    <a
        href="${FRONTEND_URL}/auth/${token}"
        target="_blank"
    >Confirm account</a>
  </div>`;
};

const getTemplateRecover = (userName: string, token: string) => {
  return `
  <div id="email___content">
  <h2>¡Hi ${userName}!</h2>
  <p>Enter the following link to recover your password.</p>
  <a
      href="${FRONTEND_URL}/change-password/${token}"
      target="_blank"
  >Change password</a>
</div>`;
};

export { transporter, getTemplate, getTemplateRecover };
