// config/mailer.js
import nodemailer from "nodemailer";

export function crearMailer() {
  if (!process.env.EMAIL_FROM || !process.env.EMAIL_PASSWORD) {
    throw new Error("EMAIL_FROM o EMAIL_PASSWORD no definidos");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}