import "server-only";

import nodemailer from "nodemailer";

type SmtpConfig = {
  appName: string;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  fromName: string;
  fromEmail: string;
};

let transporterPromise: Promise<ReturnType<typeof nodemailer.createTransport>> | undefined;

function parseBoolean(value: string | undefined, fallback = false) {
  if (!value) {
    return fallback;
  }

  return value.toLowerCase() === "true";
}

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required mail environment variable: ${name}`);
  }

  return value;
}

function getSmtpConfig(): SmtpConfig {
  return {
    appName: process.env.MAIL_APP_NAME || "NFC F. Sanchez",
    host: getRequiredEnv("SMTP_HOST"),
    port: Number(process.env.SMTP_PORT || 587),
    secure: parseBoolean(process.env.SMTP_SECURE),
    user: getRequiredEnv("SMTP_USER"),
    pass: getRequiredEnv("SMTP_PASS"),
    fromName:
      process.env.SMTP_FROM_NAME || process.env.MAIL_APP_NAME || "NFC F. Sanchez",
    fromEmail: getRequiredEnv("SMTP_FROM_EMAIL"),
  };
}

async function getTransporter() {
  transporterPromise ??= Promise.resolve().then(() => {
    const smtp = getSmtpConfig();

    return nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });
  });

  return transporterPromise;
}

export async function sendPasswordResetEmail(input: {
  email: string;
  name?: string | null;
  resetUrl: string;
}) {
  const smtp = getSmtpConfig();
  const transporter = await getTransporter();
  const recipientName = input.name?.trim() || input.email;

  await transporter.sendMail({
    from: `"${smtp.fromName}" <${smtp.fromEmail}>`,
    to: input.email,
    subject: `${smtp.appName} | Recuperacion de contrasena`,
    text: [
      `Hola ${recipientName},`,
      "",
      "Recibimos una solicitud para restablecer tu contrasena.",
      "Abre este enlace para elegir una nueva:",
      input.resetUrl,
      "",
      "Si no pediste este cambio, puedes ignorar este mensaje.",
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6; max-width: 640px; margin: 0 auto; padding: 24px;">
        <p style="font-size: 12px; letter-spacing: 0.28em; text-transform: uppercase; color: #6b7280; margin: 0 0 16px;">
          ${smtp.appName}
        </p>
        <h1 style="font-size: 28px; margin: 0 0 16px; color: #111827;">
          Recuperacion de contrasena
        </h1>
        <p style="margin: 0 0 16px;">Hola ${recipientName},</p>
        <p style="margin: 0 0 16px;">
          Recibimos una solicitud para restablecer tu contrasena. Usa el siguiente enlace para elegir una nueva.
        </p>
        <p style="margin: 24px 0;">
          <a
            href="${input.resetUrl}"
            style="display: inline-block; padding: 12px 18px; background: #111827; color: #ffffff; text-decoration: none;"
          >
            Restablecer contrasena
          </a>
        </p>
        <p style="margin: 0 0 12px;">
          Si el boton no abre correctamente, copia y pega esta URL en tu navegador:
        </p>
        <p style="margin: 0 0 16px; word-break: break-all;">
          <a href="${input.resetUrl}" style="color: #111827;">${input.resetUrl}</a>
        </p>
        <p style="margin: 0; color: #6b7280;">
          Si no pediste este cambio, puedes ignorar este mensaje.
        </p>
      </div>
    `,
  });
}
