import fs from "fs";
import path from "path";
import { mailer } from "../config/mailer.js";


function guardarEnArchivo(data) {
  const dir = path.join(process.cwd(), "data");
  const file = path.join(dir, "contactos.jsonl");

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const linea = JSON.stringify({ ...data, createdAt: new Date().toISOString() }) + "\n";
  fs.appendFileSync(file, linea, "utf8");
}



export const enviarFormularioContacto = async (req, res) => {
  // Lógica para manejar el envío del formulario de contacto
  const { nombre, clinica, contacto } = req.body || {};

  console.log("Formulario de contacto recibido:", { nombre, clinica, contacto });

  // Validación mínima
  if (!nombre || !clinica || !contacto) {
    return res.status(400).json({ error: "Faltan campos obligatorios (nombre, email, mensaje)" });
  }

  // Anti-spam básico: largo máximo
  if (contacto.length > 2000) {
    return res.status(400).json({ error: "El mensaje es demasiado largo" });
  }

  const payload = { nombre: String(nombre).trim(), clinica: String(clinica).trim(), contacto: String(contacto).trim() };

  // ✅ Guardar
  guardarEnArchivo(payload);

        // Enviar mail
      await mailer.sendMail({
        from: process.env.MAIL_FROM,
        to: email,
        subject: "Tu código para la tienda de la veterinaria",
        text: ` Tu código de acceso es: ${codigoPlano}`,
        html: `<p>Hola ${nombre}. <br> Tu código de acceso es:</p><p style="font-size:20px;"><b>${codigoPlano}</b></p>`,
      });

      res.json({
        ok: true,
        message: "Código enviado al email",
      });
 

  // ✅ Responder
  return res.json({ ok: true, mensaje: "Solicitud recibida" });
}   