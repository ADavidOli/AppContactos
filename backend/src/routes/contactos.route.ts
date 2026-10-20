import { Router } from "express";
import { contactosController } from "../controllers/ContactosController.js";
import { ContactValidator } from "../validators/contactos.validator.js";

const router = Router();

router.get('/', contactosController.getContactos);
router.post('/create',ContactValidator.saveContacto,contactosController.createContacto);
router.get('/:id', contactosController.getContacto);
router.patch('/:id',ContactValidator.updateContacto,contactosController.updateContacto);
router.delete('/:id', contactosController.deleteContacto);

export default router;