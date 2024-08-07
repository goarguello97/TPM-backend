import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const EMAIL = process.env.EMAIL as string;
const PASS = process.env.PASS as string;

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
      <h2>¡Hola ${userName}!</h2>
      <p>Gracias por registrarte. Debes activar tu cuenta ingresando al siguiente enlace.</p>
      <a
          href="http://localhost:3000/auth/${token}"
          target="_blank"
      >Confirmar cuenta</a>
    </div>`;
};

const getTemplateRecover = (userName: string, token: string) => {
  return `
    <div id="email___content">
    <h2>¡Hola ${userName}!</h2>
    <p>Entra al siguiente enlace para recuperar tu contraseña.</p>
    <a
        href="http://localhost:3000/change-password/${token}"
        target="_blank"
    >Cambiar contraseña</a>
  </div>`;
};

export { transporter, getTemplate, getTemplateRecover };
