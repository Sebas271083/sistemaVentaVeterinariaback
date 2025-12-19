import { Router } from "express";

import { enviarFormularioContacto } from "../controller/enviarFormulario.controller.js";

const router = Router();

router.post("/", enviarFormularioContacto);


export default router;