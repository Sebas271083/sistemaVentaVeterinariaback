import fs from "fs";
import path from "path";
import { crearMailer } from "../config/mailer.js";

function guardarEnArchivo(data) {
  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "contactos.jsonl");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(
    file,
    JSON.stringify({ ...data, createdAt: new Date().toISOString() }) + "\n",
    "utf8"
  );
}

function esEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor || "").trim());
}

export const enviarFormularioContacto = async (req, res) => {
  try {
    const { nombre, clinica, contacto = "" } = req.body || {};

    if (!nombre || !clinica || !contacto) {
      return res.status(400).json({ error: "Faltan campos obligatorios" });
    }

    guardarEnArchivo({ nombre, clinica, contacto });

    const mailer = crearMailer();

    const info = await mailer.sendMail({
      from: process.env.MAIL_FROM,
      to: process.env.MAIL_TO,
      subject: `Nueva solicitud de demo - ${nombre} | ${clinica}`,
      text: `Nombre: ${nombre}\nClínica: ${clinica}\nContacto: ${contacto}`,
      html: `
        <h3>Nueva solicitud de demo</h3>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Clínica:</b> ${clinica}</p>
        <p><b>Contacto:</b> ${contacto}</p>
      `,
      ...(esEmail(contacto) ? { replyTo: contacto } : {}),
    });

    console.log("📬 Mailtrap OK. ID:", info.messageId);

    return res.json({ ok: true });
  } catch (err) {
    console.error("❌ Error Mailtrap:", err);
    return res.status(500).json({ error: "No se pudo enviar" });
  }
};
