import fs from "fs";
import path from "path";
import { crearMailer } from "../config/mailer.js";

function guardarEnArchivo(data) {
  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "contactos.jsonl");
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.appendFileSync(file, JSON.stringify({ ...data, createdAt: new Date().toISOString() }) + "\n", "utf8");
}

function esEmail(valor) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(valor || "").trim());
}

export const enviarFormularioContacto = async (req, res) => {
  try {
    // ✅ debug para ver qué hay EN ESE MOMENTO
    console.log("EMAIL_FROM:", process.env.EMAIL_FROM);
    console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD ? "OK" : "VACIO");

    const { nombre, clinica, contacto = "" } = req.body || {};
    if (!nombre || !clinica || !contacto) {
      return res.status(400).json({ error: "Faltan campos obligatorios (nombre, clinica, contacto)." });
    }

    const payload = {
      nombre: String(nombre).trim(),
      clinica: String(clinica).trim(),
      contacto: String(contacto).trim(),
    };

    guardarEnArchivo(payload);

    const to = process.env.MAIL_TO;
    const from = process.env.MAIL_FROM || process.env.EMAIL_FROM;


    if (!from) {
      return res.status(500).json({ error: "MAIL_FROM/EMAIL_FROM no configurado en el servidor." });
    }
    if (!to) {
      return res.status(500).json({ error: "MAIL_TO no configurado en el servidor." });
    } else {
      const mailer = crearMailer(); // ✅ se crea acá, no al importar
      await mailer.sendMail({
        from,
        to,
        subject: `Nueva solicitud de demo - ${payload.nombre} | ${payload.clinica}`,
        text: `Nombre: ${payload.nombre}\nClínica: ${payload.clinica}\nContacto: ${payload.contacto}\n`,
        html: `
          <h3>Nueva solicitud de demo</h3>
          <p><b>Nombre:</b> ${payload.nombre}</p>
          <p><b>Clínica:</b> ${payload.clinica}</p>
          <p><b>Contacto:</b> ${payload.contacto}</p>
        `,
        ...(esEmail(payload.contacto) ? { replyTo: payload.contacto } : {}),
      });
    }

    console.log("✅ Formulario de contacto enviado y guardado.");

    return res.json({ ok: true, mensaje: "Solicitud recibida. Te contactaremos pronto." });
  } catch (err) {
    console.error("❌ Error enviarFormularioContacto:", err);
    return res.status(500).json({ error: err.message || "Error interno." });
  }
};
